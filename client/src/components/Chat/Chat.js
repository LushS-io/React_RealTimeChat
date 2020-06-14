import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

import './Chat.css';

//outside of component create socket var
let socket;

// location passed from react router
const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    // const data = queryString.parse(location.search);
    // a better way with destructuring
    const { name, room } = queryString.parse(location.search);

    // after first connection
    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.emit('disconnect');
      socket.off();
    };
  }, [ENDPOINT, location.search]);
  // use array above to indicate when useEffect should render. Which is when ENDPOINT || location.search changes.

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault(); // prevent default of keypress or button press to refresh the entire page

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  console.log(message);
  console.log(messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name}></Messages>
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      {/* text container */}
    </div>
  );
};

export default Chat;
