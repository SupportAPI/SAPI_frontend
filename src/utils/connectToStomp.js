import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const connectToStomp = (onConnected) => {
  const client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws/ws-stomp'),
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
    reconnectDelay: 5000,
  });

  client.activate();

  return client;
};

export default connectToStomp;
