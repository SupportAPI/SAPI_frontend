import { useState, useRef, useEffect } from 'react';
import { BsSend } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import { Client } from '@stomp/stompjs';
import { useMutation } from 'react-query';
import SockJs from 'sockjs-client';
import { findComments, findIndex, findUsers } from '../../api/queries/useCommentsQueries';
import User2 from '../../assets/workspace/user2.png';

const Comments = () => {
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [optionsDropdownPosition, setOptionsDropdownPosition] = useState({ top: 0, left: 0 })
  const [sendContent, setSendContent] = useState('');
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const stompClient = useRef(null);
  const [initIndex, setInitIndex] = useState(-1);
  const [index, setIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const setRef = useRef(null);

  // 수정, 삭제 드롭다운 열기
  const handleIconClick = (e) => {
    e.stopPropagation();
    const { top, left, height } = e.currentTarget.getBoundingClientRect();
    setOptionsDropdownPosition({ top: top + height + window.scrollY, left: left + window.scrollX - 50 });
    setShowOptionsDropdown(!showOptionsDropdown);
  };

  // 드롭다운 바깥 선택 시 꺼짐
  const handleClickOutside = (event) => {
    if (setRef.current && !setRef.current.contains(event.target)){
      setShowOptionsDropdown(false);
    }
  };

  // 드롭다운 열렸을 떄 스크롤 방지
  const preventScroll = () => {
    if(scrollContainerRef.current){
      scrollContainerRef.current.style.overflow = "hidden";
    }
  };

  const allowScroll = () => {
    if(scrollContainerRef.current){
      scrollContainerRef.current.style.overflow = "auto";
    }
  };

  useEffect(()=> {
    if(showOptionsDropdown){
      preventScroll();
    }else{
      allowScroll();
    };
  }, [showOptionsDropdown]);

  const indexMutation = useMutation(() => findIndex('1'), {
    onSuccess: (response) => {
      if (response !== undefined) setInitIndex(response + 1);
    },
    onError: (error) => console.error('Index fetch error:', error),
  });

  const findInitMutation = useMutation(() => findComments('1', initIndex, 5, '커비'), {
    onSuccess: (response) => {
      setMessages((prevMessages) => [...prevMessages, ...response.content]);
      setIndex(Math.min(...response.content.map((message) => message.id)));
    },
    onError: (error) => console.error('Find comments error:', error),
  });

  const findMutation = useMutation(() => findComments('1', index, 5, '커비'), {
    onSuccess: (response) => {
      setMessages((prevMessages) => [...prevMessages, ...response.content]);
      const minIndex = Math.min(...response.content.map((message) => message.id));
      setIndex(minIndex);
    },
    onError: (error) => console.error('Find comments error:', error),
  });

  const findUserMutation = useMutation((nickname) => findUsers(nickname), {
    onSuccess: (response) => {
      console.log(response);  
      setUserSuggestions(response);
    },
    onError: (error) => console.error('User fetch error:', error),
  });

  const connect = () => {
    const socket = new SockJs('http://localhost:8080/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        stompClient.current.subscribe(`/apiComment/sub/save/1`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [receivedMessage, ...prevMessages]);
        });
      },
      onStompError: (frame) => console.error('STOMP error:', frame),
      reconnectDelay: 5000,
    });
    stompClient.current.activate();
  };

  const disconnect = () => {
    if (stompClient.current) stompClient.current.deactivate();
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    connect();
    indexMutation.mutate();
    return () => {
      disconnect();
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
    const lastChar = content[cursorPosition - 1]?.normalize("NFC");
  
    if (/^[가-힣]$/.test(lastChar)) {  
      const atIndex = content.lastIndexOf('@');
      const searchQuery = content.substring(atIndex + 1, cursorPosition);
      if (searchQuery) {
        findUserMutation.mutate(searchQuery); 
        const { top, left, height } = textarea.getBoundingClientRect();
        setDropdownPosition({ top: top + window.scrollY, left: left + window.scrollX });
        setShowDropdown(true);
      }
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectUser = (nickname) => {
    const atIndex = sendContent.lastIndexOf('@');
    const newContent = `${sendContent.substring(0, atIndex + 1)}${nickname} `;
    setSendContent(newContent);
    setShowDropdown(false);
  };

  const sendMessage = () => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: '/apiComment/save/1',
        body: JSON.stringify({ writerNickname: '커비', content: sendContent }),
      });
      setSendContent('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="w-full h-[650px] bg-[#F8FCFF] flex flex-col justify-start pt-5 overflow-y-auto box-border sidebar-scrollbar"
    >
      <div className="flex flex-col space-y-4 flex-grow">
        {messages.slice().sort((a, b) => b.id - a.id).map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
              {!message.isMine && (
                <img className="w-[40px] h-[40px] rounded-full mr-3 ml-5" src={User2} alt="Profile" />
              )}
              <div className={`relative w-[240px] h-auto p-2 mt-3 rounded-[10px] bg-[#D7E9F4]`}>
                <div className='flex flex-row justify-between'>
                  <p className={`text-xl font-bold my-1 mx-2 ${message.isMine ? 'text-right' : 'text-left'}`}>{message.writerNickname}</p>
                  <FaEllipsisH className='mt-1 mr-2 cursor-pointer' onClick={handleIconClick}/>
                </div>
                <p className={`text-xl my-1 mx-2 ${message.isMine ? 'text-right' : 'text-left'}`}>{message.content}</p>
              </div>
              {message.isMine && (
                <img className="w-[40px] h-[40px] rounded-full mr-5 ml-3" src={User2} alt="Profile" />
              )}
            </div>
            <div className={`flex ${message.isMine ? 'justify-end mr-[72px]' : 'justify-start ml-[72px]'}`}>
              <p className="text-sm">{message.date}</p>
            </div>
          </div>
        ))}
        <div className="absolute bottom-5">
          <div className="flex flex-row w-full rounded-[10px] ml-6 bg-[#D7E9F4] p-3">
            <img className="w-[40px] h-[40px] rounded-full mr-3" src={User2} alt="Profile" />
            <textarea
              ref={textareaRef}
              className="text-xl pt-2 bg-transparent w-full flex-grow resize-none overflow-hidden"
              rows="1"
              placeholder="코멘트 입력"
              onInput={handleInput}
              value={sendContent}
            ></textarea>
            <BsSend onClick={sendMessage} className="mt-1 text-4xl ml-1" />
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
            className="absolute bg-[#EDF7FF] border border-gray-300 w-20 max-h-60 rounded-xl overflow-y-auto sidebar-scrollbar z-10 p-2 shadow-lg"
          >
            <li className="p-2 hover:bg-[#D7E9F4] cursor-pointer text-center">수정</li>
            <li className="p-2 hover:bg-[#D7E9F4] cursor-pointer text-center">삭제</li>
          </ul>
        )}
      {showDropdown && (
        <ul
          style={{
            bottom: `calc(100% - ${dropdownPosition.top - 3}px)`,
            left:`calc(100% - ${dropdownPosition.left + 25}px)`,
          }}
          className="absolute bg-[#EDF7FF] border border-gray-300 w-56 max-h-60 rounded-xl overflow-y-auto sidebar-scrollbar z-10"
        >
          {userSuggestions.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user.nickname)}
              className="p-2 hover:bg-[#D7E9F4] cursor-pointer flex flex-row items-center justify-content"
            >
              <img className="w-[40px] h-[40px] rounded-full mr-5 ml-3" src={SampleImg} alt="Profile" />
              {user.nickname}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;
