import { createContext, useEffect } from 'react';
import * as Y from 'yjs';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router';
import { useApiDocDetail } from '../api/queries/useApiDocsQueries';

const YjsContext = createContext(null);

export const YjsProvider = ({ children }) => {
  const { workspaceId, apiId } = useParams();
  const { data } = useApiDocDetail(workspaceId, apiId);

  const doc = new Y.Doc();
  const apiData = doc.getMap('apiData');

  useEffect(() => {
    if (!data) return;

    // 데이터를 Yjs로 초기화
    apiData.set('docId', new Y.Text(data.docId || ''));
    apiData.set('apiId', new Y.Text(data.apiId || ''));

    // Category 설정
    const category = new Y.Map();
    category.set('categoryId', data.category?.categoryId || 0);
    category.set('name', data.category?.name || '미설정');
    apiData.set('category', category);

    // 일반 필드 설정
    apiData.set('name', new Y.Text(data.name || ''));
    apiData.set('method', new Y.Text(data.method || 'GET'));
    apiData.set('path', new Y.Text(data.path || ''));
    apiData.set('description', new Y.Text(data.description || ''));
    apiData.set('managerEmail', new Y.Text(data.managerEmail || ''));
    apiData.set('managerName', new Y.Text(data.managerName || ''));
    apiData.set('managerProfileImage', new Y.Text(data.managerProfileImage || ''));

    // Parameters 설정
    const parameters = new Y.Map();
    parameters.set('authType', new Y.Text(data.parameters?.authType || 'NOAUTH'));
    parameters.set('headers', new Y.Array(data.parameters?.headers || []));
    parameters.set('pathVariables', new Y.Array(data.parameters?.pathVariables || []));
    parameters.set('queryParameters', new Y.Array(data.parameters?.queryParameters || []));
    parameters.set('cookies', new Y.Array(data.parameters?.cookies || []));
    apiData.set('parameters', parameters);

    // Request 설정
    const request = new Y.Map();
    request.set('bodyType', new Y.Text(data.request?.bodyType || 'NONE'));
    const json = new Y.Map();
    json.set('id', new Y.Text(data.request?.json?.id || ''));
    json.set('value', new Y.Text(data.request?.json?.value || ''));
    request.set('json', json);
    request.set('formData', new Y.Array(data.request?.formData || []));
    apiData.set('request', request);

    // Response 설정
    apiData.set('response', new Y.Array(data.response || []));
    apiData.set('createdDate', new Y.Text(data.createdDate || ''));
    apiData.set('lastModifyDate', new Y.Text(data.lastModifyDate || ''));

    // STOMP Client 설정
    const client = new Stomp.Client({
      webSocketFactory: () => new SockJS(`http://192.168.31.219:8080/ws/ws-stomp`), // Spring Boot의 STOMP WebSocket URL
      reconnectDelay: 5000, // 재연결 딜레이
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
      onConnect: () => {
        console.log('Connected to STOMP WebSocket');

        // STOMP 주제 구독
        client.subscribe(`/ws/sub/room-${workspaceId}-${apiId}`, (message) => {
          const update = new Uint8Array(JSON.parse(message.body));
          Y.applyUpdate(doc, update); // Yjs 문서에 업데이트 적용
        });
      },
      onStompError: (frame) => {
        console.error('STOMP Broker error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
      },
    });

    client.activate(); // STOMP 연결 활성화

    // Yjs 변경 사항 감지 및 STOMP로 전송
    const updateHandler = (update) => {
      if (client.connected) {
        client.publish({
          destination: `/ws/pub/room-${workspaceId}-${apiId}`,
          body: JSON.stringify(Array.from(update)),
        });
      }
    };

    doc.on('update', updateHandler);

    // Cleanup
    return () => {
      doc.off('update', updateHandler); // Yjs 변경 사항 핸들러 해제
      client.deactivate(); // STOMP 연결 해제
      console.log('STOMP WebSocket disconnected');
    };
  }, [data, apiData, workspaceId, apiId, doc]);

  return <YjsContext.Provider value={{ doc, apiData }}>{children}</YjsContext.Provider>;
};
