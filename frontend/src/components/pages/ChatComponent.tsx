import React, { useEffect, useState } from 'react';

const ChatComponent: React.FC = () => {
  // Use WebSocket | null as the state type for ws
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Adjusted WebSocket connection to use the /ws/ endpoint
    const websocket = new WebSocket('ws://localhost/ws/generate_chat');

    // Connection opened
    websocket.addEventListener('open', function (event) {
      console.log('Connected to WS Server');
    });

    // Listen for messages
    websocket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
    });

    // Update the state with the new WebSocket
    setWs(websocket);

    // Cleanup on component unmount
    return () => {
      if(websocket) {
        websocket.close();
      }
    };
  }, []); // Empty array ensures effect only runs once at mount

  const sendMessage = () => {
    const payload: any = {
        prompt: "Make a joke.",
        max_tokens: 150,
        temperature: 0.7,
        top_p: 1.0,
    }
    if (ws) {
      ws.send(payload);
    }
  };

  return (
    <div>
      <button onClick={() => sendMessage()}>Send Message</button>
    </div>
  );
}

export default ChatComponent;