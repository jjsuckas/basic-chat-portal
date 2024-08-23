const socket = io();

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const loginContainer = document.getElementById('login-container');
const chatContainer = document.getElementById('chat-container');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');

let username = 'Anonymous'; // Default username if not provided// Handle login form submission
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    username = usernameInput.value.trim() || 'Anonymous'; // Default to 'Anonymous' if empty// Hide login form and show chat interface
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'flex'; // Ensure chat container is visible
    chatInput.disabled = false;

    // Notify server of new user
    socket.emit('joinChat', username);
});

// Function to create a new message element
function createMessageElement(sender, msg) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(sender === username ? 'your-message' : 'other-message');
    messageElement.textContent = `${sender}: ${msg}`;
    return messageElement;
}

// Display messages from other users and self
socket.on('chatMessage', (msg) => {
    const sender = msg.user || 'Anonymous';
    const messageElement = createMessageElement(sender, msg.text);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
});

// Load previous messages when the user connects
socket.on('loadMessages', (messages) => {
    messages.forEach((msg) => {
        const sender = msg.user || 'Anonymous';
        const messageElement = createMessageElement(sender, msg.text);
        chatBox.appendChild(messageElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
});

// Send a message when Enter is pressed
chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && chatInput.value.trim()) {
        const messageText = chatInput.value;
        socket.emit('chatMessage', {text: messageText, user: username});
        chatInput.value = ''; // Clear input field
    }
});
