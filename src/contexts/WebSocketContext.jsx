import { createContext, useContext, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useAuthStore from '../stores/useAuthStore';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const stompClient = useRef(null);
  const userId = useAuthStore((state) => state.userId); // userId 가져오기

  useEffect(() => {
    if (!userId) return; // userId가 없으면 WebSocket 연결하지 않음

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws/ws-stomp'),
      reconnectDelay: 5000,
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
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
  }, [userId]); // userId가 변경될 때마다 실행

  return <WebSocketContext.Provider value={stompClient}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => useContext(WebSocketContext);
