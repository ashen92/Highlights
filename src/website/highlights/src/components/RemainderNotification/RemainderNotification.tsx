import React, { useState, useEffect } from 'react';
import styles from './RemainderNotification.module.css';  
import 'animate.css';
import Swal from 'sweetalert2';

interface Message {
  id: number;
  title: string;
  message: string;
}

const WebSocketComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9091');
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      const userId = 1; // Replace with the actual userId you want to send
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
      ws.close();
    };
  }, []);

  const showAlert = (message: Message) => {
    Swal.fire({
      title: ` Reminder: ${message.title}`,
      text: message.message,
      iconHtml: '⏰', // Replace the icon with the large-sized image
      iconColor: '#ffcc00',
      background: '#f2f2f2',
      confirmButtonText: 'Got it',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonText: 'Snooze',
      cancelButtonColor: '#d33',
      // backdrop: `
      //   rgba(0,0,123,0.4)
      //   url("https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif")
      //   left top
      //   no-repeat
      // `,
      customClass: {
        title: styles.swalTitle,
        popup: styles.swalPopup,
        confirmButton: styles.swalConfirmButton,
        cancelButton: styles.swalCancelButton,
      },
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  };

  return (
    <div>
      {/* Uncomment the section below if you want to display the messages on the page */}
      {/* 
      <h1>Task Reminders</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <h2>{message.title}</h2>
            <p><strong>{message.message}</strong></p>
          </li>
        ))}
      </ul>
      */}
    </div>
  );
};

export default WebSocketComponent;
