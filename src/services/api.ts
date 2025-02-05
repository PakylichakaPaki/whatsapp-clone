import axios from 'axios';

interface SendMessageResponse {
  idMessage: string;
}

interface NotificationResponse {
  receiptId: number;
  body: {
    typeWebhook: string;
    instanceData: {
      idInstance: number;
      wid: string;
      typeInstance: string;
    };
    timestamp: number;
    messageData?: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
    senderData?: {
      chatId: string;
      sender: string;
      senderName: string;
    };
  };
}

class WhatsAppAPI {
  private idInstance: string;
  private apiTokenInstance: string;
  private baseURL: string;

  constructor(idInstance: string, apiTokenInstance: string) {
    this.idInstance = idInstance;
    this.apiTokenInstance = apiTokenInstance;
    this.baseURL = 'https://api.green-api.com';
  }

  async sendMessage(phoneNumber: string, message: string): Promise<SendMessageResponse> {
    try {
      // Формируем chatId в соответствии с документацией
      const chatId = `${phoneNumber}@c.us`;
      
      const response = await axios.post<SendMessageResponse>(
        `${this.baseURL}/waInstance${this.idInstance}/sendMessage/${this.apiTokenInstance}`,
        {
          chatId,
          message
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Сообщение отправлено:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.error('Ошибка валидации:', error.response.data);
        } else if (error.response?.status === 500) {
          console.error('Ошибка сервера:', error.response.data);
        }
      }
      console.error('Ошибка при отправке сообщения:', error);
      throw error;
    }
  }

  async receiveMessage(): Promise<NotificationResponse | null> {
    try {
      // Получаем уведомление
      const response = await axios.get<NotificationResponse>(
        `${this.baseURL}/waInstance${this.idInstance}/receiveNotification/${this.apiTokenInstance}`
      );

      // Если уведомление есть
      if (response.data) {
        console.log('Получено уведомление:', response.data); // Для отладки

        // Удаляем уведомление сразу после получения
        await this.deleteNotification(response.data.receiptId);
        
        // Проверяем тип уведомления
        if (response.data.body.typeWebhook === 'incomingMessageReceived' && 
            response.data.body.messageData?.typeMessage === 'textMessage') {
          return response.data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Ошибка при получении уведомления:', error);
      throw error;
    }
  }

  private async deleteNotification(receiptId: number): Promise<void> {
    try {
      const response = await axios.delete(
        `${this.baseURL}/waInstance${this.idInstance}/deleteNotification/${this.apiTokenInstance}/${receiptId}`
      );
      console.log('Уведомление удалено:', response.data); // Для отладки
    } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
      throw error;
    }
  }

  async setSettings(): Promise<void> {
    try {
      await axios.post(
        `${this.baseURL}/waInstance${this.idInstance}/setSettings/${this.apiTokenInstance}`,
        {
          webhookUrl: "",
          outgoingWebhook: "yes",
          stateWebhook: "yes",
          incomingWebhook: "yes"
        }
      );
    } catch (error) {
      console.error('Ошибка при настройке уведомлений:', error);
      throw error;
    }
  }
}

export default WhatsAppAPI; 