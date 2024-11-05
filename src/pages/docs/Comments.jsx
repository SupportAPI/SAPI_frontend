import { useState, useRef, useEffect } from 'react';
import { BsSend } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import { Stomp } from '@stomp/stompjs';
import { useMutation } from 'react-query';
import SockJS from 'sockjs-client';
import { findComments, findIndex, findUsers } from '../../api/queries/useCommentsQueries';
import { getToken } from '../../utils/cookies';
import User2 from '../../assets/workspace/basic_image.png';

const Comments = () => {
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [initIndex, setInitIndex] = useState(-1);
  const [index, setIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const setRef = useRef(null);
  const deleteRef = useRef(null);
  const [optionsDropdownPosition, setOptionsDropdownPosition] = useState({ top: 0, left: 0 });
  const [editingMessageId, setEditingMessageId] = useState(null); // 수정 중인 메시지 ID
  const [selectedMessageId, setSelectedMessageId] = useState(null); // 드롭다운에서 선택된 메시지 ID
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [sendContent, setSendContent] = useState('');
  const [sendParsedMessage, setSendParsedMessage] = useState([]); // 메시지 작성 중의 파싱된 메시지 배열
  const [editContent, setEditContent] = useState(''); // 수정 중인 콘텐츠
  const [editParsedMessage, setEditParsedMessage] = useState([]); // 수정 중의 파싱된 메시지 배열

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
    setEditParsedMessage([]); // 수정 중 파싱된 메시지 초기화
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
      destination: '/ws/pub/docs/6ee8aa57-0f62-426b-902a-fd6bda70b9e7/comments',
      body: JSON.stringify({
        type: 'DELETE',
        message: deleteTargetId.commentId,
      }),
    });
    setShowDeleteModal(false);
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    const messageToEdit = messages.find((msg) => msg.commentId === selectedMessageId);
    if (messageToEdit) {
      setEditingMessageId(selectedMessageId);
      setEditContent(messageToEdit.comment[0]?.value || ''); // 현재 메시지 내용을 입력 필드에 설정
      setEditParsedMessage([]); // 편집 상태 초기화
    }
    setShowOptionsDropdown(false); // 옵션 드롭다운 닫기
  };

  // 수정 내용 저장 핸들러
  const handleSaveEdit = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      if (editContent) {
        setEditParsedMessage((prevParsed) => [...prevParsed, { type: 'TEXT', value: editContent }]);
        setSending(true);
      }
    }
  };

  useEffect(() => {
    if (sending) {
      console.log(editParsedMessage);
      stompClientRef.current.publish({
        destination: '/ws/pub/docs/6ee8aa57-0f62-426b-902a-fd6bda70b9e7/comments',
        body: JSON.stringify({
          type: 'UPDATE',
          message: {
            commentId: selectedMessageId,
            message: editParsedMessage,
          },
        }),
      });
      setSending(false);
      setEditingMessageId(null); // 수정 모드 종료
      setEditContent(''); // 수정 필드 초기화
      setEditParsedMessage([]); // 편집 상태 초기화
    }
  }, [editParsedMessage]);

  const handleEditInput = (e) => {
    const textarea = e.target;
    const content = textarea.value;
    setEditContent(content);
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    const cursorPosition = textarea.selectionStart;
    const lastChar = content[cursorPosition - 1]?.normalize('NFC');

    const atIndex = content.lastIndexOf('@');
    if (atIndex !== -1 && cursorPosition > atIndex && /^[가-힣]$/.test(lastChar)) {
      const searchQuery = content.substring(atIndex + 1, cursorPosition);
      if (searchQuery) {
        // 사용자 검색 결과에 따라 handleSelectUser 호출 준비
        findUserMutation.mutate(searchQuery, {
          onSuccess: (response) => {
            setUserSuggestions(response);
            setDropdownPosition({ top: top + window.scrollY, left: left + window.scrollX });
            setShowDropdown(true);
          },
        });
      }
    } else {
      setShowDropdown(false);
    }
  };

  // 드롭다운 바깥 선택 시 꺼짐
  const handleClickOutside = (event) => {
    if (setRef.current && !setRef.current.contains(event.target)) {
      setShowOptionsDropdown(false);
    }
    if (deleteRef.current && !deleteRef.current.contains(event.target)) {
      setShowDeleteModal(false);
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

  const indexMutation = useMutation(() => findIndex(), {
    onSuccess: (response) => {
      if (response !== undefined) setInitIndex(response);
    },
    onError: (error) => console.error('Index fetch error:', error),
  });

  const findInitMutation = useMutation(() => findComments(initIndex, 5), {
    onSuccess: (response) => {
      console.log(response);
      setMessages((prevMessages) => [...prevMessages, ...response]);
      setIndex(Math.min(...response.map((message) => message.id)));
    },
    onError: (error) => console.error('Find comments error:', error),
  });

  const findMutation = useMutation(() => findComments(index, 5), {
    onSuccess: (response) => {
      console.log(response);
      setMessages((prevMessages) => [...prevMessages, ...response]);
      setIndex(Math.min(...response.map((message) => message.id)));
    },
    onError: (error) => console.error('Find comments error:', error),
  });

  const findUserMutation = useMutation((nickname) => findUsers(nickname), {
    onSuccess: (response) => {
      setUserSuggestions(response);
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
    const socket = new SockJS(`http://192.168.31.219:8080/ws/ws-stomp?accessToken=${accessToken}`);
    stompClientRef.current = Stomp.over(socket); // stompClientRef에 STOMP client를 저장

    stompClientRef.current.connect(
      {},
      (frame) => {
        console.log('Connected:', JSON.stringify(frame.headers));

        // 구독 시작
        stompClientRef.current.subscribe(`/ws/sub/docs/6ee8aa57-0f62-426b-902a-fd6bda70b9e7/comments`, (message) => {
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

  const handleInput = (e) => {
    const textarea = e.target;
    const content = textarea.value;
    setSendContent(content);
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    const cursorPosition = textarea.selectionStart;
    const lastChar = content[cursorPosition - 1]?.normalize('NFC');

    const atIndex = content.lastIndexOf('@');
    if (atIndex !== -1 && cursorPosition > atIndex && /^[가-힣]$/.test(lastChar)) {
      const searchQuery = content.substring(atIndex + 1, cursorPosition);
      if (searchQuery) {
        findUserMutation.mutate(searchQuery);
        const { top, left } = textarea.getBoundingClientRect();
        setDropdownPosition({ top: top + window.scrollY, left: left + window.scrollX });
        setShowDropdown(true);
      }
    } else {
      setShowDropdown(false);
    }
  };

  // 유저 선택 시 처리 - 일반 메시지와 수정 모드 구분
  const handleSelectUser = (nickname, userId, isEditing = false) => {
    const content = isEditing ? editContent : sendContent;
    const atIndex = content.lastIndexOf('@');
    const newContent = `${content.substring(0, atIndex)}@${nickname} `;

    if (isEditing) {
      setEditContent(newContent);
      const textBefore = content.substring(0, atIndex);
      setEditParsedMessage((prevParsed) => [
        ...prevParsed,
        { type: 'TEXT', value: textBefore },
        { type: 'USER', value: { userId, nickname } },
      ]);
    } else {
      setSendContent(newContent);
      const textBefore = content.substring(0, atIndex);
      setSendParsedMessage((prevParsed) => [
        ...prevParsed,
        { type: 'TEXT', value: textBefore },
        { type: 'USER', value: { userId, nickname } },
      ]);
    }

    setShowDropdown(false);
  };

  const sendMessage = () => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      if (sendContent) {
        setSendParsedMessage((prevParsed) => [...prevParsed, { type: 'TEXT', value: sendContent }]);
        setSending(true);
      }
    }
  };

  useEffect(() => {
    if (sending) {
      console.log(sendParsedMessage);
      stompClientRef.current.publish({
        destination: '/ws/pub/docs/6ee8aa57-0f62-426b-902a-fd6bda70b9e7/comments',
        body: JSON.stringify({
          type: 'ADD',
          message: sendParsedMessage,
        }),
      });
      setSending(false);
      setSendContent('');
      setSendParsedMessage([]);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }, [sendParsedMessage]);

  const handleUserClick = (nickname, userId) => {
    // isEditing이 true이면 수정 모드에서 handleSelectUser 호출
    if (editingMessageId) {
      handleSelectUser(nickname, userId, true);
    } else {
      handleSelectUser(nickname, userId, false);
    }
  };

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
      {showDropdown && (
        <ul
          style={{
            bottom: `calc(100% - ${dropdownPosition.top - 3}px)`,
            left: `calc(100% - ${dropdownPosition.left + 25}px)`,
          }}
          className='absolute bg-[#EDF7FF] border border-gray-300 w-56 max-h-60 rounded-xl overflow-y-auto sidebar-scrollbar z-10'
        >
          {userSuggestions.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user.nickname, user.id)}
              className='p-2 hover:bg-[#D7E9F4] cursor-pointer flex flex-row items-center justify-content'
            >
              <img className='w-[40px] h-[40px] rounded-full mr-5 ml-3' src={User2} alt='Profile' />
              {user.nickname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
