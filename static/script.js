document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

const maxMessages = 100;

// Функция отправки сообщения
function sendMessage() {
    const inputField = document.getElementById('message-input');
    const messageText = inputField.value.trim();
    

    if (messageText === '') return;


    if (messageText.length > 50) {
        inputField.value = messageText.slice(0, 50); // Ограничение на 50 символов
        return;
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'my-message');
    messageElement.textContent = messageText;
    
    document.getElementById('chat-window').appendChild(messageElement);

    appendMessage(messageElement);
    inputField.value = '';

    // Отправка на сервер
    fetch('/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageText })
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

    // Эмуляция сообщения от собеседника
    setTimeout(() => {
        const theirMessageElement = document.createElement('div');
        theirMessageElement.classList.add('message', 'their-message');
        theirMessageElement.textContent = 'Сообщение от собеседника';
        document.getElementById('chat-window').appendChild(theirMessageElement);
        scrollToBottom();
    }, 1000);
            data.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', message.author === 'you' ? 'my-message' : 'their-message');
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

// Периодически запрашиваем сообщения с сервера каждые 0,5 секунды
setInterval(fetchMessages, 500);
