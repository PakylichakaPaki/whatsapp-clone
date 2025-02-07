import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import MessageInput from './MessageInput';
import WhatsAppAPI from '../services/api';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Header = styled.div`
  background-color: #128c7e;
  color: white;
  padding: 16px;
  display: flex;
  align-items: center;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #e5ddd5;
  background-image: url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png');
`;

const Message = styled.div<{ $isSent: boolean }>`
  max-width: 60%;
  padding: 8px 12px;
  margin: 8px;
  border-radius: 8px;
  background-color: ${props => props.$isSent ? '#dcf8c6' : 'white'};
  align-self: ${props => props.$isSent ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
`;

const NewChatForm = styled.div`
  display: flex;
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #ddd;
`;

const PhoneInput = styled.input`
  flex: 1;
  padding: 8px;
  margin-right: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #128c7e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface Message {
  text: string;
  isSent: boolean;
  timestamp: string;
  senderName?: string;
}

interface ChatProps {
  api: WhatsAppAPI;
}

function Chat({ api }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeChatPhone, setActiveChatPhone] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Функция для проверки новых сообщений
  const checkNewMessages = async () => {
    if (!activeChatPhone) return;

    try {
      const notification = await api.receiveMessage();
      console.log('Получено уведомление:', notification); // Отладка

      if (notification) {
        const messageText = notification.body.messageData?.textMessageData?.textMessage;
        const senderData = notification.body.senderData;
        
        if (messageText && senderData) {
          // Извлекаем номер телефона из chatId (убираем @c.us)
          const senderPhone = senderData.chatId.split('@')[0];
          
          // Проверяем, что сообщение от нужного контакта
          if (senderPhone === activeChatPhone) {
            const newMessage: Message = {
              text: messageText,
              isSent: false,
              timestamp: new Date(notification.body.timestamp * 1000).toISOString(),
              senderName: senderData.senderName
            };
            
            console.log('Добавляем новое сообщение:', newMessage); // Отладка
            setMessages(prev => [...prev, newMessage]);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при получении сообщений:', error);
    }
  };

  // Запускаем проверку сообщений каждые 5 секунд
  useEffect(() => {
    if (activeChatPhone) {
      // Сразу проверяем сообщения при активации чата
      checkNewMessages();
      
      // Устанавливаем интервал проверки
      const interval = setInterval(checkNewMessages, 5000);
      
      // Очищаем интервал при размонтировании
      return () => clearInterval(interval);
    }
  }, [activeChatPhone]);

  const handleStartChat = async () => {
    if (phoneNumber) {
      console.log('Начинаем чат с номером:', phoneNumber); // Отладка
      setActiveChatPhone(phoneNumber);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChatPhone) return;

    try {
      console.log('Отправляем сообщение:', text); // Отладка
      const response = await api.sendMessage(activeChatPhone, text);
      console.log('Ответ от сервера:', response); // Отладка

      const newMessage: Message = {
        text,
        isSent: true,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      alert('Не удалось отправить сообщение');
    }
  };

  return (
    <ChatContainer>
      {!activeChatPhone ? (
        <NewChatForm>
          <PhoneInput
            type="text"
            placeholder="Введите номер телефона (например: 79123456789)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button onClick={handleStartChat}>Начать чат</Button>
        </NewChatForm>
      ) : (
        <>
          <Header>
            <h3>Чат с {activeChatPhone}</h3>
          </Header>
          <MessagesContainer>
            <MessagesWrapper>
              {messages.map((message, index) => (
                <Message key={index} $isSent={message.isSent}>
                  {message.senderName && !message.isSent && (
                    <small style={{ color: '#666' }}>{message.senderName}</small>
                  )}
                  <div>{message.text}</div>
                  <small style={{ color: '#666', alignSelf: 'flex-end' }}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </small>
                </Message>
              ))}
            </MessagesWrapper>
            <div ref={messagesEndRef} />
          </MessagesContainer>
          <MessageInput onSendMessage={handleSendMessage} />
        </>
      )}
    </ChatContainer>
  );
}

export default Chat; 