import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import { Platform } from 'react-native';

const getDebuggerHost = () => {
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  if (Platform.OS === 'ios') {
    return 'localhost';
  }
  return null;
};

const DebuggerClient: React.FC = () => {
  const store = useStore();
  const host = getDebuggerHost();

  useEffect(() => {
    if (!__DEV__ || !host) return;

    const ws = new WebSocket(`ws://${host}:8086`);

    ws.onopen = () => {
      console.log('Debugger WebSocket connected');
      ws.send(JSON.stringify({ type: 'hello', message: 'Client connected' }));
    };

    const originalLog = console.log;
    console.log = (...args: any[]) => {
      originalLog(...args);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'console', data: args }));
      }
    };

    const unsubscribe = store.subscribe(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'redux', state: store.getState() }));
      }
    });

    const originalFetch = global.fetch;
    global.fetch = async (input: RequestInfo, init?: RequestInit) => {
      const response = await originalFetch(input, init);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'network',
          request: { input, init },
          response: { status: response.status }
        }));
      }
      return response;
    };

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string | URL
    ): void {
      (this as any)._debuggerMethod = method;
      (this as any)._debuggerUrl = url;
      return originalXhrOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body?: Document | BodyInit | null): void {
      const xhr = this;
      const onReadyStateChange = () => {
        if (xhr.readyState === 4) {
          const sendPayload = (responseText: any) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'network',
                request: {
                  method: (xhr as any)._debuggerMethod,
                  url: (xhr as any)._debuggerUrl,
                  body: body || null,
                },
                response: {
                  status: xhr.status,
                  responseText,
                }
              }));
            }
          };

          if (xhr.responseType === '' || xhr.responseType === 'text') {
            sendPayload(xhr.responseText);
          } else if (xhr.responseType === 'blob' && xhr.response) {
            const reader = new FileReader();
            reader.onload = () => sendPayload(reader.result);
            reader.readAsText(xhr.response);
          } else {
            sendPayload(null);
          }
        }
      };

      this.addEventListener('readystatechange', onReadyStateChange);
      return originalXhrSend.apply(this, arguments);
    };

    return () => {
      unsubscribe();
      console.log = originalLog;
      global.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXhrOpen;
      XMLHttpRequest.prototype.send = originalXhrSend;
      ws.close();
    };
  }, [store, host]);

  return null;
};

export default DebuggerClient;
