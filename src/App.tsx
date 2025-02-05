import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import WhatsAppAPI from './services/api';
import styled from 'styled-components';

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
`;

function App() {
  const [api, setApi] = useState<WhatsAppAPI | null>(null);

  const handleLogin = ({ idInstance, apiTokenInstance }: { idInstance: string; apiTokenInstance: string }) => {
    const apiInstance = new WhatsAppAPI(idInstance, apiTokenInstance);
    setApi(apiInstance);
  };

  return (
    <AppContainer>
      {!api ? <Login onLogin={handleLogin} /> : <Chat api={api} />}
    </AppContainer>
  );
}

export default App; 