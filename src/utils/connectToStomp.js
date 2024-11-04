import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// STOMP에 연결하는 함수
const connectToStomp = (onConnected) => {
  const client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws/ws-stomp'), // 정확한 URL 설정
    onConnect: () => {
      console.log('Connected to STOMP');
      if (onConnected) onConnected();
    },
    onDisconnect: () => {
      console.log('Disconnected');
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
    debug: (str) => {
      console.log(str);
    },
    reconnectDelay: 5000, // 자동 재연결 시도 간격 설정 (5초)
  });

  client.activate(); // STOMP 클라이언트를 활성화하여 연결 시도

  return client;
};

export default connectToStomp;
