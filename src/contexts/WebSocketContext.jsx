import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useAuthStore from '../stores/useAuthStore';
import { getToken } from '../utils/cookies';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const stompClient = useRef(null);
  const userId = useAuthStore((state) => state.userId);
  const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태 관리

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      // webSocketFactory: () => new SockJS(`http://192.168.31.219:8080/ws/ws-stomp?accessToken=${getToken()}`),
      webSocketFactory: () => new SockJS(`https://k11b305.p.ssafy.io/ws/ws-stomp?accessToken=${getToken()}`),
      reconnectDelay: 5000,
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true); // 연결 완료 상태로 설정
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false); // 연결 해제 상태로 설정
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      debug: (str) => {
        console.log(str);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
        console.log('WebSocket connection deactivated');
      }
    };
  }, [userId]);

  // 주제에 대한 구독 메소드
  const subscribe = (topic, callback) => {
    if (stompClient.current && stompClient.current.connected) {
      const subscription = stompClient.current.subscribe(topic, (message) => {
        callback(JSON.parse(message.body));
      });
      return subscription;
    } else {
      console.error('WebSocket is not connected');
    }
  };

  // 구독 해제 메소드
  const unsubscribe = (subscription) => {
    if (subscription) {
      subscription.unsubscribe();
      console.log('Unsubscribed from topic');
    } else {
      console.error('No subscription to unsubscribe');
    }
  };

  // 메시지 전송 메소드
  const publish = (destination, message) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination,
        body: JSON.stringify(message),
      });
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <WebSocketContext.Provider value={{ subscribe, unsubscribe, publish, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
