document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const inputField = document.getElementById('message-input');
    const messageText = inputField.value.trim();
    
    if (messageText === '') return;
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'my-message');
    messageElement.textContent = messageText;
    
    document.getElementById('chat-window').appendChild(messageElement);
    inputField.value = '';
    scrollToBottom();

    // Эмуляция сообщения от собеседника
    setTimeout(() => {
        const theirMessageElement = document.createElement('div');
        theirMessageElement.classList.add('message', 'their-message');
        theirMessageElement.textContent = 'Сообщение от собеседника';
        document.getElementById('chat-window').appendChild(theirMessageElement);
        scrollToBottom();
    }, 1000);
}

function scrollToBottom() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
