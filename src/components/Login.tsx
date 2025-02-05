import React, { useState } from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #25d366;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #128c7e;
  }
`;

interface LoginProps {
  onLogin: (credentials: { idInstance: string; apiTokenInstance: string }) => void;
}

function Login({ onLogin }: LoginProps) {
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ idInstance, apiTokenInstance });
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>Вход в WhatsApp</h2>
        <Input
          type="text"
          placeholder="Введите idInstance"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Введите apiTokenInstance"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
        />
        <Button type="submit">Войти</Button>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login; 