import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAppContext } from '@/features/account/AppContext';

interface Message {
  id: number;
  title: string;
  message: string;
}

const WebSocketComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { user } = useAppContext();  // Ensure this returns the user object correctly
  const userId = Number(user.id);

  useEffect(() => {
    if (!userId) return;

    const ws = new WebSocket('ws://localhost:9091');
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      ws.send(JSON.stringify({ userId: userId }));
    };

    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
      showAlert(message);  // Trigger the SweetAlert when a message is received
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();  // Close the connection when the component unmounts
    };
  }, [user?.id]);

  const showAlert = (message: Message) => {
    const audio = new Audio('/audio/reminder.mp3');
    
    audio.addEventListener('error', (e) => {
      console.error('Audio load error:', e, audio.error);
    });
    
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  
    Swal.fire({
      title: `Reminder: ${message.title}`,
      text: message.message,
      iconHtml: '⏰',
      iconColor: '#ffcc00',
      background: '#f2f2f2',
      confirmButtonText: 'Got it',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Snooze',
      cancelButtonColor: '#d33',
    });
  };
  
  

  return <div>{/* Optional UI to display messages */}</div>;
};

export default WebSocketComponent;
