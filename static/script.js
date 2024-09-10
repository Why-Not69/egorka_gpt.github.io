document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

const maxMessages = 100;
const maxChars = 50;
const userId = generateUserId();  // Генерируем уникальный идентификатор пользователя

// Обработчик для ограничения символов в поле ввода
document.getElementById('message-input').addEventListener('input', function () {
    const inputField = document.getElementById('message-input');
    const charCount = inputField.value.length;

    if (charCount >= maxChars) {
        alert('Достигнут лимит в 50 символов');
        inputField.value = inputField.value.slice(0, maxChars);
    }
});

// Функция отправки сообщения
function sendMessage() {
    const inputField = document.getElementById('message-input');
    const messageText = inputField.value.trim();

    if (messageText === '') return;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'my-message');
    messageElement.textContent = messageText;

    appendMessage(messageElement);
    inputField.value = '';

    // Отправка на сервер
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText, senderId: userId })  // Добавляем уникальный идентификатор пользователя
    }).then(() => {
        fetchMessages();  // После отправки сообщения, обновляем чат
    });

    scrollToBottom();
}

// Функция для получения истории сообщений с сервера
function fetchMessages() {
    fetch('/history')
        .then(response => response.json())
        .then(data => {
            const chatWindow = document.getElementById('chat-window');
            chatWindow.innerHTML = '';  // Очищаем текущее содержимое чата

            data.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', message.senderId === userId ? 'my-message' : 'their-message');
                messageElement.textContent = message.text;
                chatWindow.appendChild(messageElement);
            });

            scrollToBottom();
        });
}

// Функция для добавления сообщения в чат
function appendMessage(messageElement) {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.appendChild(messageElement);

    // Удаляем старые сообщения, если их больше 100
    if (chatWindow.children.length > maxMessages) {
        chatWindow.removeChild(chatWindow.firstChild);
    }

    scrollToBottom();
}

// Функция для автоматической прокрутки чата вниз
function scrollToBottom() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Генерация уникального идентификатора пользователя
function generateUserId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Периодически запрашиваем сообщения с сервера каждые 0,5 секунды
setInterval(fetchMessages, 500);
