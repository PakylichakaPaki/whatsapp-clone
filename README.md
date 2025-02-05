# WhatsApp Clone

## Локальная установка и запуск

### Предварительные требования

- Node.js (версия 14.0.0 или выше)
- npm или yarn
- Git

### Шаги по установке

1. Клонируйте репозиторий

   ```bash
   git clone https://github.com/your-username/whatsapp-clone.git
   cd whatsapp-clone
   ```

2. Установите зависимости

   ```bash
   npm install
   # или
   yarn install
   ```

3. Создайте файл `.env` в корневой директории и добавьте необходимые переменные окружения

   ```
   REACT_APP_API_KEY=your_api_key
   REACT_APP_AUTH_DOMAIN=your_auth_domain
   REACT_APP_PROJECT_ID=your_project_id
   REACT_APP_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_APP_ID=your_app_id
   ```

4. Запустите проект
   ```bash
   npm start
   # или
   yarn start
   ```

Приложение будет доступно по адресу `http://localhost:3000`

### Запуск тестов

```bash
npm test
```

или

```
yarn test
```

## Технологии

- React.js
- Firebase
- Material-UI
- React Router

## Лицензия

MIT
