from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import timedelta
import easyocr
import pytesseract
from PIL import Image
import io
import cv2
import numpy as np

app = Flask(__name__)

# Enable CORS
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure key in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Initialize OCR engines with English only
easyocr_reader = easyocr.Reader(['en'], gpu=False)  # English only

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# Create the database
with app.app_context():
    db.create_all()

# Sign-up endpoint
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Username, email, and password are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({'token': access_token}), 201

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({'token': access_token}), 200

# Verify token endpoint
@app.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if user:
        return jsonify({'valid': True, 'user_id': user_id}), 200
    return jsonify({'valid': False, 'error': 'User not found'}), 404

# OCR endpoint using EasyOCR or Tesseract (English only)
@app.route('/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    engine = request.form.get('engine', 'easyocr')

    if file and (file.filename.endswith('.jpg') or file.filename.endswith('.jpeg') or file.filename.endswith('.png')):
        try:
            file_bytes = np.frombuffer(file.read(), np.uint8)
            image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

            if engine == 'easyocr':
                result = easyocr_reader.readtext(thresh, detail=0, paragraph=True)
                detected_text = ' '.join(result).strip()
                print("Detected Text (EasyOCR):", detected_text)
            elif engine == 'tesseract':
                pil_image = Image.frombytes('L', (thresh.shape[1], thresh.shape[0]), thresh.ravel())
                custom_config = r'--oem 1 --psm 6 -l eng'  # Force English language
                detected_text = pytesseract.image_to_string(pil_image, config=custom_config).strip()
                print("Detected Text (Tesseract):", detected_text)
            else:
                return jsonify({'error': f'Unsupported OCR engine: {engine}'}), 400

            if not detected_text:
                detected_text = 'No text detected in the image'

            # Force language to 'en' (English only)
            language = 'en'

            return jsonify({
                'detected_text': detected_text,
                'language': language
            }), 200
        except Exception as e:
            print("OCR Error:", str(e))
            return jsonify({'error': f'OCR processing failed: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Unsupported file format'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)