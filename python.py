from flask import Flask, request, jsonify, render_template
from collections import deque

app = Flask(__name__)

# Очередь для хранения сообщений (не более 100)
messages = deque(maxlen=100)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send', methods=['POST'])
def send_message():
    data = request.get_json()
    message = data.get('message')
    if message:
        messages.append({'text': message, 'author': 'you'})
    return jsonify({'status': 'Message received'})

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(list(messages))

if __name__ == '__main__':
    app.run(debug=True)
