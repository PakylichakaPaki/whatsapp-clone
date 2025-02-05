import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  padding: 16px;
  background-color: #f0f2f5;
  border-top: 1px solid #ddd;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 24px;
  margin-right: 8px;
  font-size: 15px;
`;

const SendButton = styled.button`
  background-color: #128c7e;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <InputContainer>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
        <Input
          type="text"
          placeholder="Введите сообщение"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SendButton type="submit">➤</SendButton>
      </form>
    </InputContainer>
  );
}

export default MessageInput; 