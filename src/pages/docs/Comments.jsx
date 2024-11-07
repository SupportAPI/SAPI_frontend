import { useState, useRef, useEffect } from 'react';
import { BsSend } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import { Stomp } from '@stomp/stompjs';
import { useMutation } from 'react-query';
import SockJS from 'sockjs-client';
import { findComments, findIndex, findUsers } from '../../api/queries/useCommentsQueries';
import { getToken } from '../../utils/cookies';
import User2 from '../../assets/workspace/basic_image.png';

const Comments = ({ docsId, workspaceId }) => {
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [user, setUser] = useState({});
  const [showUser, setShowUser] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [initIndex, setInitIndex] = useState(-1);
  const [index, setIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const setRef = useRef(null);
  const deleteRef = useRef(null);
  const infoRef = useRef(null);
  const [optionsDropdownPosition, setOptionsDropdownPosition] = useState({ top: 0, left: 0 });
  const [editingMessageId, setEditingMessageId] = useState(null); // 수정 중인 메시지 ID
  const [selectedMessageId, setSelectedMessageId] = useState(null); // 드롭다운에서 선택된 메시지 ID
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editContent, setEditContent] = useState(''); // 수정 중인 콘텐츠
  const [editInternalMessage, setEditInternalMessage] = useState(''); // 수정 중의 파싱된 메시지 배열

  const [sendContent, setSendContent] = useState(''); // 사용자 입력 텍스트
  const [internalMessage, setInternalMessage] = useState(''); // 내부 저장 메시지 형식: [닉네임:아이디]
  const [taggedUsers, setTaggedUsers] = useState([]); // 태그된 유저 리스트

  const [sending, setSending] = useState(false);

  const stompClientRef = useRef(null); // stompClient를 useRef로 선언
  const accessToken = getToken();

  const handleIconClick = (e, messageId) => {
    e.stopPropagation();
    setSelectedMessageId(messageId); // 선택된 메시지 ID 설정
    const iconRect = e.currentTarget.getBoundingClientRect();
    const containerRect = scrollContainerRef.current.getBoundingClientRect();
    const calculatedTop = iconRect.top - containerRect.top + 75;
    const calculatedLeft = iconRect.left - containerRect.left + 20;
    const dropdownHeight = 15;
    const dropdownWidth = 50;
    let adjustedTop = calculatedTop;
    let adjustedLeft = calculatedLeft;
    if (adjustedTop + dropdownHeight > scrollContainerRef.current.clientHeight) {
      adjustedTop = calculatedTop - dropdownHeight - e.currentTarget.offsetHeight - 5;
    }
    if (adjustedLeft + dropdownWidth > scrollContainerRef.current.clientWidth) {
      adjustedLeft = scrollContainerRef.current.clientWidth - dropdownWidth - 10;
    }
    setOptionsDropdownPosition({ top: adjustedTop, left: adjustedLeft });
    setShowOptionsDropdown(!showOptionsDropdown);
  };

  // 수정 취소 시 상태 초기화
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
    setShowOptionsDropdown(false);
  };

  const deleteComment = (e) => {
    e.stopPropagation();
    const deleteTargetId = messages.find((msg) => msg.commentId === selectedMessageId);
    stompClientRef.current.publish({
      destination: `/ws/pub/docs/${docsId}/comments`,
      body: JSON.stringify({
        type: 'DELETE',
        message: deleteTargetId.commentId,
      }),
    });
    setShowDeleteModal(false);
  };

  // useEffect(() => {
  //   if (sending) {
  //     console.log(editParsedMessage);
  //     stompClientRef.current.publish({
  //       destination: `/ws/pub/docs/${docsId}/comments`,
  //       body: JSON.stringify({
  //         type: 'UPDATE',
  //         message: {
  //           commentId: selectedMessageId,
  //           message: editParsedMessage,
  //         },
  //       }),
  //     });
  //     setSending(false);
  //     setEditingMessageId(null); // 수정 모드 종료
  //     setEditContent(''); // 수정 필드 초기화
  //   }
  // }, [editParsedMessage]);

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    const messageToEdit = messages.find((msg) => msg.commentId === selectedMessageId);
    console.log(messageToEdit);
    if (messageToEdit) {
      setEditingMessageId(selectedMessageId);

      let newEditContent = '';
      let newEditInternalMessage = '';

      messageToEdit.comment.forEach((part) => {
        if (part.type === 'USER') {
          // type이 USER인 경우
          newEditContent += `@${part.value.nickname} `;
          newEditInternalMessage += `[${part.value.nickname}:${part.value.userId}] `;
        } else if (part.type === 'TEXT') {
          // type이 TEXT인 경우
          newEditContent += part.value;
          newEditInternalMessage += part.value;
        }
      });
      setEditContent(newEditContent.trim()); // 최종 editContent 설정
      setEditInternalMessage(newEditInternalMessage.trim()); // 최종 editInternalMessage 설정
    }
    setShowOptionsDropdown(false); // 옵션 드롭다운 닫기
  };

  console.log(editInternalMessage);

  // 수정 내용 저장 핸들러
  const handleSaveEdit = () => {
    if (stompClientRef.current && stompClientRef.current.connected && editInternalMessage) {
      console.log('수정1', editInternalMessage);
      console.log('수정2', editContent);
      const parsedMessage = parseMessage(editInternalMessage || editContent);
      console.log(parsedMessage);
      stompClientRef.current.publish({
        destination: `/ws/pub/docs/${docsId}/comments`,
        body: JSON.stringify({
          type: 'UPDATE',
          message: {
            commentId: editingMessageId,
            message: parsedMessage,
          },
        }),
      });
      setEditContent('');
      setEditInternalMessage('');
      setTaggedUsers([]);
      setEditingMessageId(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleEditInput = (e) => {
    const textarea = e.target;
    const content = textarea.value;

    // 입력이 추가된 경우
    if (content.length > editContent.length) {
      const newText = content.slice(editContent.length);

      // newText가 일반 텍스트인 경우, [닉네임:아이디] 형식이 변형되지 않도록 처리
      let newInternalMessage = newText.replace(/@(\w+)/g, (match, nickname) => {
        const taggedUser = taggedUsers
          .slice()
          .reverse()
          .find((user) => user.nickname === nickname);
        return taggedUser ? `[${nickname}:${taggedUser.userId}]` : match;
      });

      // 기존 `internalMessage`에 새로운 텍스트를 안전하게 추가
      setEditInternalMessage(editInternalMessage + newInternalMessage);
    }

    // 입력이 삭제된 경우
    else if (content.length < editContent.length) {

      const lastChar = editInternalMessage.slice(-1);
      let modifiedText = editInternalMessage;

      if (lastChar === ']') {
        // `]`가 마지막 문자일 경우 `[닉네임:아이디]` 형식을 찾아서 제거
        const lastIndex = editInternalMessage.lastIndexOf('[');
    
        if (lastIndex !== -1) {
          const substring = editInternalMessage.slice(lastIndex);
          const match = substring.match(/^\[(.*?):(.*?)\]/);
    
          if (match) {
            // `[닉네임:아이디]` 부분 제거
            modifiedText = editInternalMessage.slice(0, lastIndex);
          }
        }
          const lastAtIndex = content.lastIndexOf('@');
        if (lastAtIndex !== -1) { 
          modifiedText += content.slice(lastAtIndex);
          setEditInternalMessage(modifiedText);
        }
      }else {
      // `]`가 아닌 다른 문자가 나오면 끝 문자만 제거
        modifiedText = editInternalMessage.slice(0, -1);
      }
      
      setEditContent(content);
    }

    // 최종적으로 `content`를 `sendContent`에 저장
    setEditContent(content);

    // '@' 입력 시 유저 검색 시작
    const atIndex = content.lastIndexOf('@');
    if (atIndex !== -1) {
      const searchQuery = content.slice(atIndex + 1);
      if (searchQuery) {
        findUserMutation.mutate(searchQuery);
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

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // 드롭다운 바깥 선택 시 꺼짐
  const handleClickOutside = (event) => {
    if (setRef.current && !setRef.current.contains(event.target)) {
      setShowOptionsDropdown(false);
    }
    if (deleteRef.current && !deleteRef.current.contains(event.target)) {
      setShowDeleteModal(false);
    }
    if (infoRef.current && !infoRef.current.contains(event.target)) {
      setShowUser(false);
    }
  };

  // 드롭다운 열렸을 때 스크롤 방지
  const preventScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflowY = 'hidden';
      scrollContainerRef.current.style.paddingRight = '8px';
    }
  };

  const allowScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflowY = 'auto';
      scrollContainerRef.current.style.paddingRight = '0';
    }
  };

  useEffect(() => {
    if (showOptionsDropdown) {
      preventScroll();
    } else {
      allowScroll();
    }
  }, [showOptionsDropdown]);

  const indexMutation = useMutation(() => findIndex(docsId), {
    onSuccess: (response) => {
      if (response !== undefined) setInitIndex(response);
    },

    onError: (error) => console.error('Index fetch error:', error),
  });

  const findInitMutation = useMutation(() => findComments(initIndex, 5, docsId), {
    onSuccess: (response) => {
      console.log(response);
      setMessages((prevMessages) => [...prevMessages, ...response]);
      setIndex(Math.min(...response.map((message) => message.id)));
    },
    onError: (error) => console.error('Find comments error:', error),
  });

  const findMutation = useMutation(() => findComments(index, 5, docsId), {
    onSuccess: (response) => {
      console.log(response);
      setMessages((prevMessages) => [...prevMessages, ...response]);
      setIndex(Math.min(...response.map((message) => message.id)));
    },
    onError: (error) => console.error('Find comments error:', error),
  });

  const findUserMutation = useMutation((searchQuery) => findUsers(workspaceId, searchQuery), {
    onSuccess: (response) => {
      setUserSuggestions(response);
      console.log('코멘트태그', response);
    },
    onError: (error) => console.error('User fetch error:', error),
  });

  // const connect = () => {
  //   const socket = new SockJS('http://192.168.31.219:8080/ws/ws-stomp');
  //   stompClientRef.current = Stomp.over(socket); // stompClientRef에 STOMP client를 저장

  //   stompClientRef.current.connect(
  //     {
  //       Authorization: `Bearer ${accessToken}`, // 헤더로 토큰 전달
  //     },
  //     (frame) => {
  //       console.log('Connected:', JSON.stringify(frame.headers));

  //       // 구독 시작
  //       stompClientRef.current.subscribe(`/ws/sub/docs/6ee8aa57-0f62-426b-902a-fd6bda70b9e7/comments`, (message) => {
  //         console.log('Received data:', message);
  //         const receivedMessage = JSON.parse(message.body);
  //         setMessages((prevMessages) => [receivedMessage, ...prevMessages]);
  //       });
  //     },
  //     (error) => {
  //       console.error('Connection error:', error);
  //     }
  //   );

  //   // 디버그 메시지 출력 설정
  //   stompClientRef.current.debug = (str) => {
  //     console.log(str);
  //   };

  //   // STOMP 오류 핸들링
  //   stompClientRef.current.onStompError = (frame) => {
  //     console.error('STOMP error:', frame);
  //   };
  // };

  // pathvariable
  const connect = () => {
    // accessToken을 URL에 포함
    const socket = new SockJS(`https://k11b305.p.ssafy.io/ws/ws-stomp?accessToken=${accessToken}`);
    stompClientRef.current = Stomp.over(socket); // stompClientRef에 STOMP client를 저장

    stompClientRef.current.connect(
      {},
      (frame) => {
        console.log('Connected:', JSON.stringify(frame.headers));

        // 구독 시작
        stompClientRef.current.subscribe(`/ws/sub/docs/${docsId}/comments`, (message) => {
          const parsedData = JSON.parse(message.body); // message.body 파싱 한 번만 실행
          const { type, message: receivedMessage } = parsedData;

          console.log('Received data:', parsedData);
          console.log('Message type:', type);

          if (type === 'ADD') {
            console.log('ADD 성공');
            if (receivedMessage) {
              // receivedMessage가 있는지 확인
              setMessages((prevMessages) => [receivedMessage, ...prevMessages]);
            }
          } else if (type === 'UPDATE') {
            if (receivedMessage) {
              // receivedMessage가 있는지 확인
              setMessages((prevMessages) =>
                prevMessages.map((msg) => (msg.commentId === receivedMessage.commentId ? receivedMessage : msg))
              );
            }
          } else if (type === 'DELETE') {
            if (receivedMessage && receivedMessage) {
              // receivedMessage와 commentId가 있는지 확인
              setMessages((prevMessages) => prevMessages.filter((msg) => msg.commentId !== receivedMessage));
            }
          }
        });
      },
      (error) => {
        console.error('Connection error:', error);
      }
    );

    // 디버그 메시지 출력 설정
    stompClientRef.current.debug = (str) => {
      console.log(str);
    };

    // STOMP 오류 핸들링
    stompClientRef.current.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    connect();
    console.log(docsId);
    indexMutation.mutate();
    return () => {
      stompClientRef.current.disconnect();
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (initIndex !== -1) findInitMutation.mutate();
  }, [initIndex]);

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (
      scrollContainer &&
      scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 1
    ) {
      if (index > 1) findMutation.mutate();
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // 입력 필드에서 내용 삭제 시 태그된 유저와 내부 메시지 업데이트
  // 메시지 전송 함수
  const sendMessage = () => {
    if (stompClientRef.current && stompClientRef.current.connected && internalMessage) {
      const parsedMessage = parseMessage(internalMessage || sendContent);
      stompClientRef.current.publish({
        destination: `/ws/pub/docs/${docsId}/comments`,
        body: JSON.stringify({
          type: 'ADD',
          message: parsedMessage,
        }),
      });
      setSendContent('');
      setInternalMessage('');
      setTaggedUsers([]);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  // 입력 필드에서 내용 삭제 시 태그된 유저와 내부 메시지 업데이트
  const handleInput = (e) => {
    const textarea = e.target;
    const content = textarea.value;

    // 입력이 추가된 경우
    if (content.length > sendContent.length) {
      const newText = content.slice(sendContent.length);

      // newText가 일반 텍스트인 경우, [닉네임:아이디] 형식이 변형되지 않도록 처리
      let newInternalMessage = newText.replace(/@(\w+)/g, (match, nickname) => {
        const taggedUser = taggedUsers
          .slice()
          .reverse()
          .find((user) => user.nickname === nickname);
        return taggedUser ? `[${nickname}:${taggedUser.userId}]` : match;
      });

      // 기존 `internalMessage`에 새로운 텍스트를 안전하게 추가
      setInternalMessage(internalMessage + newInternalMessage);
    }

    // 입력이 삭제된 경우
    else if (content.length < sendContent.length) {
      // `content`의 길이에 맞춰 `sendContent`를 자르기
      const lastIndex = internalMessage.lastIndexOf('[');
      let modifiedText = internalMessage;

      // 2. `[닉네임:아이디]` 형식을 찾아서 제거
      if (lastIndex !== -1) {
        const substring = internalMessage.slice(lastIndex);
        const match = substring.match(/^\[(.*?):(.*?)\]/);

        if (match) {
          // `[닉네임:아이디]` 부분 제거
          modifiedText = internalMessage.slice(0, lastIndex) + internalMessage.slice(lastIndex + match[0].length);
        }
      }

      // 3. `@` 뒤에 있는 문장을 찾아 추출하고, `modifiedText`에 붙이기
      const atIndex = content.indexOf('@');
      if (atIndex !== -1) {
        const afterAtText = content.slice(atIndex + 1).trim();
        modifiedText += ` ${afterAtText}`;
      }

      setInternalMessage(modifiedText);
    }

    // 최종적으로 `content`를 `sendContent`에 저장
    setSendContent(content);

    // '@' 입력 시 유저 검색 시작
    const atIndex = content.lastIndexOf('@');
    if (atIndex !== -1) {
      const searchQuery = content.slice(atIndex + 1);
      if (searchQuery) {
        findUserMutation.mutate(searchQuery);
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

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const showUserInfo = (e, nickname, profileImage, userId) => {
    e.stopPropagation(); // 이벤트 전파 중단

    // `e`와 `e.target`이 존재하는지 확인
    if (!e || !e.target) {
      console.error('이벤트 또는 이벤트 타겟이 정의되지 않았습니다.');
      return;
    }

    console.log('정보 뜰 준비 완!');

    const targetElement = e.target;

    // `targetElement`가 `span`인지 확인하고 `scrollContainerRef.current`가 존재하는지 확인
    if (targetElement.tagName === 'SPAN' && scrollContainerRef.current) {
      const { top, left } = targetElement.getBoundingClientRect();
      const { top: containerTop, left: containerLeft } = scrollContainerRef.current.getBoundingClientRect();

      setUser({
        userId: userId,
        nickname: nickname,
        profileImage: profileImage,
      });

      // 부모 컨테이너 기준으로 상대 위치를 계산
      setDropdownPosition({
        top: top - containerTop + scrollContainerRef.current.scrollTop - 30,
        left: left - containerLeft + scrollContainerRef.current.scrollLeft,
      });
      setShowUser(true);
    } else {
      console.error('targetElement가 span이 아니거나 scrollContainerRef가 초기화되지 않았습니다.');
    }
  };

  // 유저 선택 시 처리 - 일반 메시지와 수정 모드 구분
  const handleSelectUser = (nickname, userId, isEditing) => {
    if (!isEditing) {
      const atIndex = sendContent.lastIndexOf('@');
      const newContent = `${sendContent.substring(0, atIndex)}@${nickname} `;
      const newInternalMessage = `${internalMessage.substring(0, atIndex)}[${nickname}:${userId}] `;
      setSendContent(newContent);
      setInternalMessage(newInternalMessage);
    } else {
      const atIndex = editContent.lastIndexOf('@');
      const newContent = `${editContent.substring(0, atIndex)}@${nickname} `;
      const newInternalMessage = `${editInternalMessage.substring(0, atIndex)}[${nickname}:${userId}] `;
      setEditContent(newContent);
      setEditInternalMessage(newInternalMessage);
    }

    // 태그된 유저 추가
    setTaggedUsers((prevUsers) => [...prevUsers, { nickname, userId }]);
    setShowDropdown(false);
  };

  // 메시지 파싱 함수
  const parseMessage = (messageText) => {
    return messageText.split(/(\[.*?:.*?\])/).map((part) => {
      const match = part.match(/\[(.*?):(.*?)\]/);
      if (match) {
        return { type: 'USER', value: match[2] }; // userId
      }
      return { type: 'TEXT', value: part };
    });
  };

  const handleUserClick = (nickname, userId) => {
    // isEditing이 true이면 수정 모드에서 handleSelectUser 호출
    if (editingMessageId) {
      handleSelectUser(nickname, userId, true);
    } else {
      handleSelectUser(nickname, userId, false);
    }
  };

  console.log('데이터', userSuggestions);
  console.log('드롭다운', showDropdown);

  return (
    <div
      ref={scrollContainerRef}
      className='w-full h-[700px] bg-[#F8FCFF] flex flex-col justify-start pt-5 pb-24 overflow-y-auto box-border sidebar-scrollbar'
    >
      <div className='flex flex-col space-y-4 flex-grow'>
        {messages.map((message) => (
          <div key={message.commentId} className='flex flex-col'>
            <div className={`flex ${message.isHost ? 'justify-end' : 'justify-start'}`}>
              {!message.isHost && (
                <img className='w-[40px] h-[40px] rounded-full mr-3 ml-5 object-contain' src={User2} alt='Profile' />
              )}
              <div
                className={`relative w-[240px] h-auto p-2 mt-3 rounded-[10px] bg-[#D7E9F4] ${
                  message.isHost ? 'ml-auto text-right' : 'text-left'
                }`}
              >
                <div className={`flex ${message.isHost ? 'justify-between' : 'justify-between'} items-center`}>
                  {message.isHost ? (
                    <>
                      <FaEllipsisH
                        className='mt-1 ml-2 cursor-pointer'
                        onClick={(e) => handleIconClick(e, message.commentId)}
                      />
                      <span className='text-xl font-bold my-1 mx-2'>{message.writerNickname}</span>
                    </>
                  ) : (
                    <span className='text-xl font-bold my-1 mx-2'>{message.writerNickname}</span>
                  )}
                </div>
                {editingMessageId === message.commentId ? (
                  <div className='text-xl my-1 mx-2'>
                    <textarea
                      value={editContent}
                      onInput={handleEditInput}
                      className='w-full p-1 rounded-md border border-gray-300 resize-none overflow-hidden'
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
                  <div className='text-lg my-1 mx-2' style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
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
                          onClick={(e) =>
                            showUserInfo(e, part.value.nickname, part.value.profileImage, part.value.userId)
                          } // 래퍼 함수로 감싸기
                        >
                          @{part.value.nickname}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
              {message.isHost && (
                <img className='w-[40px] h-[40px] rounded-full mr-5 ml-3 object-contain' src={User2} alt='Profile' />
              )}
            </div>
            <div className={`flex ${message.isHost ? 'justify-end mr-[72px]' : 'justify-start ml-[72px]'}`}>
              <span className='text-sm mx-1'>
                {new Date(message.createdDate).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        <div className='absolute bottom-5'>
          <div className='flex flex-row w-full rounded-[10px] ml-6 bg-[#D7E9F4] p-3'>
            <img className='w-[40px] h-[40px] rounded-full mr-3 object-contain' src={User2} alt='Profile' />
            <textarea
              ref={textareaRef}
              className='text-xl pt-2 bg-transparent w-full flex-grow resize-none overflow-hidden'
              rows='1'
              placeholder='코멘트 입력'
              onInput={handleInput}
              value={sendContent}
            ></textarea>
            <BsSend onClick={sendMessage} className='mt-1 text-4xl ml-1' />
          </div>
        </div>
      </div>
      {showOptionsDropdown && (
        <ul
          style={{
            top: `${optionsDropdownPosition.top}px`,
            left: `${optionsDropdownPosition.left}px`,
          }}
          ref={setRef}
          className='absolute bg-[#EDF7FF] border border-gray-300 w-20 max-h-60 rounded-xl overflow-y-auto sidebar-scrollbar z-10 p-2 shadow-lg'
        >
          <li className='p-2 hover:bg-[#D7E9F4] cursor-pointer text-center' onClick={handleEditClick}>
            수정
          </li>
          <li className='p-2 hover:bg-[#D7E9F4] cursor-pointer text-center' onClick={handleDeleteClick}>
            삭제
          </li>
        </ul>
      )}
      {showDeleteModal && (
        <ul
          style={{
            top: `${optionsDropdownPosition.top}px`,
            left: `${optionsDropdownPosition.left}px`,
          }}
          ref={deleteRef}
          className='absolute bg-[#EDF7FF] border border-gray-300 w-60 max-h-60 rounded-xl overflow-y-auto sidebar-scrollbar z-10 p-2 shadow-lg'
        >
          <li className='p-2 text-center'>정말 삭제하시겠습니까?</li>
          <li className='p-2 hover:bg-[#D7E9F4] cursor-pointer text-center' onClick={deleteComment}>
            삭제
          </li>
          <li className='p-2 hover:bg-[#D7E9F4] cursor-pointer text-center' onClick={handleCancelDelete}>
            취소
          </li>
        </ul>
      )}
      {showDropdown && userSuggestions && userSuggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
          className='bg-[#EDF7FF] border border-gray-300 w-56 max-h-60 rounded-xl overflow-y-auto sidebar-scrollbar z-10'
        >
          {userSuggestions.map((user) => (
            <li
              key={user.userId}
              onClick={() => handleUserClick(user.nickname, user.userId)}
              className='p-2 hover:bg-[#D7E9F4] cursor-pointer flex flex-row items-center'
            >
              <img
                className='w-[50px] h-[50px] rounded-full mr-5 ml-3 object-contain'
                src={user.profileImage || User2}
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
              src={user.profileImage || User2}
              alt='Profile'
            />
            {user.nickname}
          </li>
        </ul>
      )}
    </div>
  );
};

export default Comments;