from flask import Flask, request, jsonify

app = Flask(__name__) # Flask app instance

@app.route('/', methods=['POST']) # Route
def index():
    return jsonify({'message': 'Hello, World!'}) # Return JSON with a key of 'message' and value of 'Hello, World!'

app.run() # Start the Flask app
