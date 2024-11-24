import React, { useState, useEffect } from 'react';
import styles from './RemainderNotification.module.css';  
import 'animate.css';
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
    if (!userId) return;  // Guard clause if user ID is not available

    const ws = new WebSocket('ws://localhost:9091');  // Adjust the WebSocket URL if necessary
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      ws.send(JSON.stringify({ userId: userId }));  // Send userId when connection opens
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
  }, [user?.id]);  // Dependency ensures it runs when user ID is available

  const showAlert = (message: Message) => {
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
