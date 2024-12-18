import { useState, useRef, useEffect, useCallback } from 'react';
import { BsSend } from 'react-icons/bs';
import { useMutation } from 'react-query';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { findComments, findIndex, findInitComments, findUsers } from '../../api/queries/useCommentsQueries';
import { fetchUserInfo } from '../../api/queries/useAPIUserQueries';
import useAuthStore from '../../stores/useAuthStore';
import { throttle } from 'lodash';

const RightSectionComments = ({ docsId, workspaceId }) => {
  // 드롭다운 불러오는 변수들
  // 1. 클릭 시 유저 정보 불러오기
  const [showUser, setShowUser] = useState(false);
  // 2. 유저 태그 시 유저 정보 불러오기
  const [showDropdown, setShowDropdown] = useState(false);
  // 3. 수정/삭제 버튼 드롭다운 불러오기
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  // 4. 코멘트 삭제시 재확인용
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 드롭다운 위치 관련 변수
  // 1. 유저 정보 위치
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  // 2. 수정/삭제 위치
  const [optionsDropdownPosition, setOptionsDropdownPosition] = useState({ top: 0, left: 0 });

  // 유저 정보 관련 변수
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [user, setUser] = useState({});
  const [myInfo, setMyInfo] = useState([]);

  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const setRef = useRef(null);
  const deleteRef = useRef(null);
  const infoRef = useRef(null);
  const userSuggestionRef = useRef(null);

  const [initIndex, setInitIndex] = useState(-1);
  const [index, setIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null); // 수정 중인 메시지 ID
  const [selectedMessageId, setSelectedMessageId] = useState(null); // 드롭다운에서 선택된 메시지 ID

  const [editContent, setEditContent] = useState(''); // 수정 중인 콘텐츠

  const [sendContent, setSendContent] = useState(''); // 사용자 입력 텍스트
  const [internalMessage, setInternalMessage] = useState(''); // 내부 저장 메시지 형식: [닉네임:아이디]
  const [taggedUsers, setTaggedUsers] = useState([]); // 태그된 유저 리스트

  const { userId } = useAuthStore();

  // 소켓 관련 변수들
  const { subscribe, publish, isConnected } = useWebSocket();

  // 초반 화면 렌더링 시 소켓 연결 + 최근 인덱스 불러오기
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    setMessages([]);
    indexMutation.mutate();
    findMyInfoMutation.mutate();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [docsId]);

  useEffect(() => {
    document.removeEventListener('click', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
  }, [docsId, showUser, showDeleteModal, showOptionsDropdown, showDropdown]);

  // 최근 인덱스 호출 완료 -> 코멘트들 불러오기
  useEffect(() => {
    if (initIndex !== -1) {
      findInitMutation.mutate();
    }
  }, [initIndex]);

  // 드롭다운 바깥 선택 시 꺼지는 함수
  const handleClickOutside = useCallback(
    (event) => {
      if (setRef.current && !setRef.current.contains(event.target)) {
        setShowOptionsDropdown(false);
      }
      if (deleteRef.current && !deleteRef.current.contains(event.target)) {
        setShowDeleteModal(false);
      }
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setShowUser(false);
      }
      if (userSuggestionRef.current && !userSuggestionRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    },
    [setRef, deleteRef, infoRef, userSuggestionRef] // 필요한 경우 의존성 추가
  );

  // 소켓 연결 함수
  useEffect(() => {
    if (isConnected) {
      const subScriptionPath = `/ws/sub/docs/${docsId}/comments/user/${userId}/message`;

      const subscription = subscribe(subScriptionPath, (parsedData) => {
        console.log(parsedData);
        const { type, message: receivedMessage } = parsedData;

        switch (type) {
          case 'ADD':
            if (receivedMessage) {
              setMessages((prevMessages) => [receivedMessage, ...prevMessages]);
            }
            break;
          case 'UPDATE':
            if (receivedMessage) {
              setMessages((prevMessages) =>
                prevMessages.map((msg) => (msg.commentId === receivedMessage.commentId ? receivedMessage : msg))
              );
            }
            break;
          case 'DELETE':
            if (receivedMessage) {
              setMessages((prevMessages) => prevMessages.filter((msg) => msg.commentId !== receivedMessage));
            }
            break;
          default:
            console.warn(`Unhandled message type: ${type}`);
        }
      });

      // 컴포넌트 언마운트 시에만 해제되도록 설정
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [isConnected, docsId]); // workspaceId와 subscribe는 필요하지 않으므로 의존성 배열에서 제거

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]); // messages가 변경될 때 실행

  // 리액트 쿼리 호출 함수들

  // 채팅 최근 인덱스
  const indexMutation = useMutation(() => findIndex(docsId), {
    onSuccess: (response) => {
      if (response !== undefined) {
        setInitIndex(response);
      }
    },

    onError: (error) => console.error('Index fetch error:', error),
  });

  // 처음 메세지 불러오기
  const findInitMutation = useMutation(() => findInitComments(initIndex, 6, docsId), {
    onSuccess: (response) => {
      setMessages(response);
      setIndex(Math.min(...response.map((message) => message.commentId)));
      console.log(response);
    },
    onError: (error) => console.error('Find comments error:', error),
  });

  // 메세지 불러오기
  const findMutation = useMutation(() => findComments(index, 5, docsId), {
    onSuccess: (response) => {
      setMessages((prevMessages) => [...prevMessages, ...response]);
      setIndex(Math.min(...response.map((message) => message.commentId)));
    },
    onError: (error) => console.error('Find comments error:', error),
  });

  // 유저 태그 시 유저 정보 불러오기
  const findUserMutation = useMutation(({ searchQuery, startIndex, endIndex }) => findUsers(workspaceId, searchQuery), {
    onSuccess: (response, variables) => {
      setUserSuggestions({
        startIndex: variables.startIndex,
        endIndex: variables.endIndex,
        response: response,
      });
    },
    onError: (error) => console.error('User fetch error:', error),
  });

  // 본인 정보 불러오기
  const findMyInfoMutation = useMutation(() => fetchUserInfo(userId), {
    onSuccess: (response) => {
      setMyInfo(response);
    },
    onError: (error) => console.error('정보를 불러오는데 실패했습니다.', error),
  });

  // 메세지 작성/수정 시 공통 사용 함수들
  // 1. 유저 선택 시 처리 - 일반 메시지와 수정 모드 구분
  const handleSelectUser = (nickname, userId, isEditing) => {
    if (!isEditing) {
      const newContent = `${sendContent.substring(
        0,
        userSuggestions.startIndex
      )}@${nickname}-${userId}${sendContent.substring(userSuggestions.endIndex)}`;

      // 업데이트된 content를 sendContent에 저장
      setSendContent(newContent);
    } else {
      const newContent = `${editContent.substring(
        0,
        userSuggestions.startIndex
      )}@${nickname}-${userId}${editContent.substring(userSuggestions.endIndex)}`;

      // 업데이트된 content를 sendContent에 저장
      setEditContent(newContent);
    }

    // 태그된 유저 추가
    setShowDropdown(false);
  };

  // 2. 유저 태그 드롭다운에서 유저 선택 시 호출되는 함수
  const handleUserClick = (nickname, userId) => {
    // isEditing이 true이면 수정 모드에서 handleSelectUser 호출
    if (editingMessageId) {
      handleSelectUser(nickname, userId, true);
    } else {
      handleSelectUser(nickname, userId, false);
    }
  };

  // 3. 엔터 입력 시 작성/수정 전송 함수
  const handleKeyDownSend = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 기본 줄바꿈 동작 방지
      if (editingMessageId) {
        handleSaveEdit();
      } else {
        handleSave();
      }
    }
  };

  //  <------ 메세지 작성 ------>
  // 1. 댓글 입력창 입력 시 호출되는 함수
  const handleInput = (e) => {
    const textarea = e.target;
    const content = textarea.value;

    // `sendContent` 값을 업데이트하여 입력이 반영되도록 설정
    setSendContent(content);

    // '@' 입력 시 유저 검색 시작
    const cursorPosition = textarea.selectionStart;
    const closestAtIndex = content.lastIndexOf('@', cursorPosition - 1);

    let searchQuery = '';
    let endIndex = content.length; // 기본값을 텍스트 끝으로 설정

    if (closestAtIndex !== -1) {
      const spaceIndex = content.indexOf(' ', closestAtIndex + 1);

      // 공백이 없다면 끝까지, 있다면 공백 전까지 자르기
      if (spaceIndex === -1) {
        searchQuery = content.slice(closestAtIndex + 1);
      } else {
        searchQuery = content.slice(closestAtIndex + 1, spaceIndex);
        endIndex = spaceIndex;
      }

      if (searchQuery) {
        findUserMutation.mutate({
          searchQuery: searchQuery,
          startIndex: closestAtIndex,
          endIndex: endIndex,
        });

        const { top, left } = textarea.getBoundingClientRect();
        const { top: containerTop, left: containerLeft } = scrollContainerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: top - containerTop + scrollContainerRef.current.scrollTop - 80,
          left: left - containerLeft + scrollContainerRef.current.scrollLeft,
        });

        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    } else {
      setShowDropdown(false);
    }

    // textarea 높이 자동 조정 (검색 로직 이후에 수행)
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // 2. 댓글 작성 요청 시 json 파싱
  const parseMessage = (messageText) => {
    return messageText.split(/(@\S+?-\S+)/).map((part) => {
      // '@문자1-문자2' 패턴을 매칭하여 분리
      const match = part.match(/^@(\S+?)-(\S+)$/);
      if (match) {
        // return { type: 'USER', value: match[2] };
        return { type: 'USER', value: match[2], nickname: match[1] };
      }
      // 다른 텍스트는 TEXT 타입으로 처리
      return { type: 'TEXT', value: part };
    });
  };

  // 3. 메시지 전송 함수
  const handleSave = () => {
    if (isConnected && sendContent) {
      const parsedMessage = parseMessage(sendContent);
      publish(`/ws/pub/docs/${docsId}/comments`, {
        type: 'ADD',
        message: parsedMessage,
      });
      setSendContent('');
      setInternalMessage('');
      setTaggedUsers([]);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  //  <------ 메세지 수정 ------>
  // 1. 댓글 수정창 값 입력 시 호출되는 함수
  const handleEditInput = (e) => {
    const textarea = e.target;
    const content = textarea.value;

    setEditContent(content);

    // '@' 입력 시 유저 검색 시작
    const cursorPosition = textarea.selectionStart;
    const closestAtIndex = content.lastIndexOf('@', cursorPosition - 1);

    let searchQuery = '';
    let endIndex = content.length; // 기본값을 텍스트 끝으로 설정
    if (closestAtIndex !== -1) {
      const spaceIndex = content.indexOf(' ', closestAtIndex + 1);

      // 공백이 없다면 끝까지, 있다면 공백 전까지 자르기
      if (spaceIndex === -1) {
        searchQuery = content.slice(closestAtIndex + 1);
      } else {
        searchQuery = content.slice(closestAtIndex + 1, spaceIndex);
        endIndex = spaceIndex;
      }

      if (searchQuery) {
        findUserMutation.mutate({
          searchQuery: searchQuery,
          startIndex: closestAtIndex,
          endIndex: endIndex,
        });

        const { top, left } = textarea.getBoundingClientRect();
        const { top: containerTop, left: containerLeft } = scrollContainerRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: top - containerTop + scrollContainerRef.current.scrollTop - 30,
          left: left - containerLeft + scrollContainerRef.current.scrollLeft,
        });
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    } else {
      setShowDropdown(false);
    }

    // textarea 높이 자동 조정 (검색 로직 이후에 수행)
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // 2. 메세지 수정 요청 시 파싱 함수
  const parseEditMessage = (messageText) => {
    return messageText.split(/(@\S+?-\S+)/).map((part) => {
      // '@문자1-문자2' 패턴을 매칭하여 분리
      const match = part.match(/^@(\S+?)-(\S+)$/);
      if (match) {
        // return { type: 'USER', value: match[2] };
        return { type: 'USER', value: match[2], nickname: match[1] };
      }
      // 다른 텍스트는 TEXT 타입으로 처리
      return { type: 'TEXT', value: part };
    });
  };

  // 3. 수정 전송 함수
  const handleSaveEdit = () => {
    if (isConnected && editContent) {
      const parsedMessage = parseEditMessage(editContent);
      publish(`/ws/pub/docs/${docsId}/comments`, {
        type: 'UPDATE',
        message: {
          commentId: editingMessageId,
          message: parsedMessage,
        },
      });
      setEditContent('');
      setTaggedUsers([]);
      setEditingMessageId(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  // 4. 수정 창 포커싱 잃었을 때 호출하는 함수
  const handleBlurWithTimeout = () => {
    setTimeout(() => {
      handleSaveEdit(); // 저장 호출
    }, 100); // 짧은 지연 시간 설정
  };

  // 더보기 아이콘 (수정/삭제) 클릭
  const handleMoreIconClick = (e, messageId) => {
    e.stopPropagation();
    setSelectedMessageId(messageId); // 선택된 메시지 ID 설정
    setShowOptionsDropdown(!showOptionsDropdown);
  };

  // 수정, 삭제 드롭다운 열렸을 때 스크롤 방지
  useEffect(() => {
    if (showOptionsDropdown) {
      preventScroll();
    } else {
      allowScroll();
    }
  }, [showOptionsDropdown]);

  // 스크롤 허용 함수
  const allowScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflowY = 'auto';
      scrollContainerRef.current.style.paddingRight = '0';
    }
  };

  // 스크롤 금지 함수
  const preventScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflowY = 'hidden';
      scrollContainerRef.current.style.paddingRight = '8px';
    }
  };

  // <------ 메세지 수정 버튼 클릭 ------>
  // 1. 수정 버튼 -> 수정 시작 시 호출되는 함수
  const handleEditClick = () => {
    const messageToEdit = messages.find((msg) => msg.commentId === selectedMessageId);
    if (messageToEdit) {
      setEditingMessageId(selectedMessageId);

      let newEditContent = '';

      messageToEdit.comment.forEach((part) => {
        if (part.type === 'USER') {
          // type이 USER인 경우
          newEditContent += `@${part.value.nickname}-${part.value.userId}`;
        } else if (part.type === 'TEXT') {
          // type이 TEXT인 경우
          newEditContent += part.value;
        }
      });

      setEditContent(newEditContent.trim()); // 최종 editContent 설정
    }
    setShowOptionsDropdown(false); // 옵션 드롭다운 닫기
  };

  // 2. 수정 취소 시 상태 초기화
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setSelectedMessageId(null);
    setEditContent('');
  };

  // <------ 메세지 삭제 버튼 클릭 ------>
  // 1. 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
    setShowOptionsDropdown(false);
  };

  // 2. 삭제 취소
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedMessageId(null);
  };

  // 3. 삭제 클릭 시
  const deleteComment = (e) => {
    e.stopPropagation();
    const deleteTargetId = messages.find((msg) => msg.commentId === selectedMessageId);
    publish(`/ws/pub/docs/${docsId}/comments`, {
      type: 'DELETE',
      message: deleteTargetId.commentId,
    });
    setShowDeleteModal(false);
    setSelectedMessageId(null);
  };

  // 스크롤 감지 후 무한 스크롤 데이터 로딩
  const handleScroll = throttle(() => {
    const scrollContainer = scrollContainerRef.current;
    console.log('스크롤', scrollContainer.scrollTop);
    if (scrollContainer && scrollContainer.scrollTop === 0) {
      findMutation.mutate();
    }
  }, 300);

  // 무한 스크롤시 스크롤 감지
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const showUserInfo = (e, nickname, profileImage, userId) => {
    e.stopPropagation(); // 이벤트 전파 중단

    if (!e || !e.target || !scrollContainerRef.current) {
      console.error('이벤트 또는 이벤트 타겟이 정의되지 않았습니다.');
      return;
    }

    const targetElement = e.target;

    // `targetElement`의 위치를 가져와 드롭다운 위치 계산
    const { top, left } = targetElement.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } = scrollContainerRef.current.getBoundingClientRect();

    setUser({
      userId,
      nickname,
      profileImage,
    });

    setDropdownPosition({
      top: top - containerTop - 85, // 30px 상단 여백 추가
      left: left - containerLeft - 60,
    });

    setShowUser(true); // 드롭다운 표시
  };

  return (
    <div>
      <p className='text-[20px] font-bold mb-4'>Comments</p>
      <div className='relative w-full h-[calc(100vh-200px)] bg-white dark:bg-dark-background mt-3'>
        {/* 입력 영역 (상단 고정) */}
        <div className='absolute w-full z-10 bottom-0 h-12 bg-white'>
          <div className='flex items-center w-[80%] rounded-sm h-full mx-auto border px-3 py-2'>
            <textarea
              ref={textareaRef}
              className='text-[14px] bg-transparent placeholder-gray-500 placeholder-italic placeholder:text-[14px] outline-none w-full h-full resize-none overflow-hidden'
              rows='1'
              style={{
                lineHeight: '2rem', // h-10(2.5rem)와 동일하게 설정
              }}
              placeholder='Enter the comment.'
              onInput={handleInput}
              onKeyDown={handleKeyDownSend}
              value={sendContent}
            ></textarea>
            <BsSend onClick={handleSave} className='text-[20px]' />
          </div>
        </div>
        {/* 스크롤 가능한 메시지 영역 */}
        <div
          ref={scrollContainerRef}
          className='w-full h-[calc(100%-60px)] overflow-y-auto flex flex-col-reverse space-y-4 sidebar-scrollbar'
        >
          <div className='flex flex-col-reverse gap-4 flex-grow'>
            {messages.map((message) => (
              <div key={message.commentId} className={`flex flex-col ${message.isHost ? 'pr-5' : 'pl-5'}`}>
                <div className={`flex ${message.isHost ? 'justify-end' : 'justify-start'}`}>
                  {!message.isHost && (
                    <img
                      className='w-[40px] h-[40px] rounded-full border object-contain mr-2'
                      src={message?.writerProfileImage}
                      alt='Profile'
                    />
                  )}
                  <div
                    className={`relative w-[240px] h-auto p-2 rounded-sm  ${
                      message.isHost ? 'ml-auto text-right shadow-sm bg-[#f7fafb]' : 'text-left shadow-sm bg-gray-100'
                    }`}
                  >
                    <div className={`flex items-center`}>
                      {message.isHost ? (
                        <>
                          {showOptionsDropdown && message.commentId === selectedMessageId && (
                            <ul
                              ref={setRef}
                              style={{
                                top: `${optionsDropdownPosition.top + 10}px`,
                                left: `${optionsDropdownPosition.left}px`,
                              }}
                              className='absolute bg-[#EDF7FF] border border-gray-300 w-20 max-h-60
                            rounded-xl overflow-y-auto sidebar-scrollbar z-10 p-2 shadow-lg'
                            >
                              <li
                                className='p-2 hover:bg-[#D7E9F4] cursor-pointer text-center'
                                onClick={handleEditClick}
                              >
                                수정
                              </li>
                              <li
                                className='p-2 hover:bg-[#D7E9F4] cursor-pointer text-center'
                                onClick={handleDeleteClick}
                              >
                                삭제
                              </li>
                            </ul>
                          )}
                          {showDeleteModal && message.commentId === selectedMessageId && (
                            <ul
                              style={{
                                top: `${optionsDropdownPosition.top + 15}px`,
                                left: `${optionsDropdownPosition.left}px`,
                              }}
                              ref={deleteRef}
                              className='absolute bg-[#EDF7FF] border border-gray-300 w-60 max-h-60 rounded-xl overflow-y-auto sidebar-scrollbar z-10 p-2 shadow-lg'
                            >
                              <li className='p-2 text-center'>정말 삭제하시겠습니까?</li>
                              <li className='p-2 hover:bg-[#D7E9F4] cursor-pointer text-center' onClick={deleteComment}>
                                삭제
                              </li>
                              <li
                                className='p-2 hover:bg-[#D7E9F4] cursor-pointer text-center'
                                onClick={handleCancelDelete}
                              >
                                취소
                              </li>
                            </ul>
                          )}
                          <span className='text-[16px] font-semibold my-1 mx-2'>{message.writerNickname}</span>
                        </>
                      ) : (
                        <span className='text-[16px] font-semibold my-1 mx-2'>{message.writerNickname}</span>
                      )}
                    </div>
                    {editingMessageId === message.commentId ? (
                      <div className='text-xl my-1 mx-2'>
                        <textarea
                          value={editContent}
                          onInput={handleEditInput}
                          onKeyDown={handleKeyDownSend}
                          onBlur={handleBlurWithTimeout}
                          className='w-full p-1 rounded-sm border border-gray-300 resize-none overflow-hidden'
                          style={{ height: 'auto' }}
                        />
                        <button onClick={() => handleSaveEdit()} className='text-blue-500 font-bold mt-2 mr-3'>
                          저장
                        </button>
                        <button onClick={() => handleCancelEdit()} className='text-blue-500 font-bold mt-2'>
                          취소
                        </button>
                      </div>
                    ) : (
                      <div
                        className='text-[14px] my-1 mx-2 text-left'
                        style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                      >
                        {message.comment.map((part, index) =>
                          part.type === 'TEXT' ? (
                            <span key={index} style={{ display: 'inline' }}>
                              {part.value}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className='font-bold text-blue-500 cursor-pointer'
                              style={{ display: 'inline' }}
                            >
                              @{part.value.nickname}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                  {/* {message.isHost && (
                    <img
                      className='w-[40px] h-[40px] rounded-full border object-contain '
                      src={message?.writerProfileImage}
                      alt='Profile'
                    />
                  )} */}
                </div>
                <div className={`flex ${message.isHost ? 'justify-end' : 'justify-start'}`}>
                  <span className='text-[12px] pl-[52px]'>
                    {new Date(message.createdDate).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hourCycle: 'h23', // 24시간 형식으로 표시
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {showDropdown && userSuggestions.response && userSuggestions.response.length > 0 && (
            <ul
              style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
              }}
              ref={userSuggestionRef}
              className='bg-[#EDF7FF] border border-gray-300 w-56 max-h-60 rounded-xl overflow-y-auto sidebar-scrollbar z-10'
            >
              {userSuggestions.response.map((user) => (
                <li
                  key={user.userId}
                  onClick={() => handleUserClick(user.nickname, user.userId)}
                  className='p-2 hover:bg-[#D7E9F4] cursor-pointer flex flex-row items-center'
                >
                  <img
                    className='w-[50px] h-[50px] rounded-full mr-5 ml-3 object-contain'
                    src={user.profileImage || ''}
                    alt='Profile'
                  />
                  {user.nickname}
                </li>
              ))}
            </ul>
          )}
          {showUser && user && (
            <ul
              style={{
                position: 'absolute',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
              }}
              className='bg-[#EDF7FF] border border-gray-300 w-36 max-h-60 rounded-xl overflow-y-auto sidebar-scrollbar z-10'
              ref={infoRef}
            >
              <li key={user.userId} className='p-2 hover:bg-[#D7E9F4] cursor-pointer flex flex-row items-center'>
                <img
                  className='w-[50px] h-[50px] rounded-full mr-5 ml-3 object-contain'
                  src={user.profileImage || ''}
                  alt='Profile'
                />
                {user.nickname}
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSectionComments;
