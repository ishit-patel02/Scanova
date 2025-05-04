# Scanova - OCR Application


##  Overview 👀
Scanova is an user-friendly web application designed to make handwritten or printed digital documents by converting text from images into editable formats like `.TXT`, `.PDF`, and `.DOCX`that you can edit, save, or share. It solves the problem of dealing with handwritten notes, forms, or records that are hard to search, share, or store.

 
## Key features 🗝️
-  Upload images of handwritten text (drag-and-drop interface)
-  Handwritten Text Recognition using OCR & CNN models
-  Dark Mode Support
-  Export recognized text to `.TXT`, `.PDF`, and `.DOCX`
-  Real-time processing with Flask backend and React frontend
-  Responsive UI with Tailwind CSS
-  Modular architecture for easy scalability and updates

## How It Works 📑
  1. Image Upload: Drag-and-drop a JPG/PNG containing handwritten or printed text.
  2. Preprocessing: Image cleaned using OpenCV (e.g., noise reduction, resizing, thresholding).
  3. OCR Engine Selection:
     - Tesseract – for clean, printed text.
     - EasyOCR – for cursive or messy handwriting.
  4. Text Extraction: OCR engine extracts text and applies formatting.
  5. Refinement: Spell-check and formatting tools enhance readability.
  6. Export/Actions: Output the result to `.TXT`, `.PDF`, and `.DOCX` 
  7. Interface & Security: Frontend in React.js; backend powered by Flask, with authentication using JWT and bcrypt.

## Technologies Used 🛠️
| Category       | Technologies                          |
|----------------|---------------------------------------|
| Frontend       | HTML, CSS, JavaScript (Vite + React)  |
| Backend        | Flask, Python                        |
| Image Processing | OpenCV (cv2), PIL                     |
| OCR            | EasyOCR, Tesseract (pytesseract)      |
| Authentication | Flask-JWT-Extended, Bcrypt            |

## Who It’s For 👥
  - Students & Educators: For digitizing notes or grading written assignments.
  - Healthcare Professionals: To transcribe prescriptions or case notes.
  - Historians & Archivists: For converting historical handwritten documents.
  - General Users: Anyone needing to digitize handwritten content for better usability.


## Why It Matters 💡
  - Saves time by reducing manual transcription.
  - Enhances accessibility of handwritten materials.
  - Facilitates digital storage, search, and sharing.
  - Especially valuable in education, healthcare, and historical research.


##  Installation 🏁

### Prerequisites
- Python 3.8+
- React + Vite (for frontend)
- Tesseract OCR installed on your system

## Screenshots 📸

### Login Page:
Here is the welcoming Login section of the website:
![Login Page](screenshot/Screenshot(1).png)

### Signup Page:
![Signup Page](screenshot/Screenshot(2).png)

### Preview:
![Preview](screenshot/Screenshot(3).png)

### File Selection:
![File Selection](screenshot/Screenshot(4).png)

### EasyOCR Model Translation:
![EasyOCR Model Translation](screenshot/Screenshot(5).png)

### Tesseract Model Translation:
![Tesseract Model Translation](screenshot/Screenshot(6).png)

### Download Options:
![Download Options](screenshot/Screenshot(7).png)

### Downloaded Sucessfully:
![Downloaded Sucessfully](screenshot/Screenshot(8).png)

### Light and Dark Mode:
![Light and Dark Mode](screenshot/Screenshot(9).png)

### Info:
![Info](screenshot/Screenshot(10).png) <br />
<br />

## Step-by-Step: Running Scanova Locally 🚀

### 1. Clone the Repository:
      git clone https://github.com/ishit-patel02/Scanova.git
      cd Scanova
      
### 2. Backend Setup (Flask + Python): 
It's Navigate to the backend directory
```bash
  cd backend
```
      
### 3. Install Python dependencies:
      pip install flask flask-cors pytesseract opencv-python Pillow numpy python-dotenv
      npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons
      npm install react react-dom @types/react @types/react-dom @vitejs/plugin-react axios react-dropzone @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons tailwindcss postcss autoprefixer pdf-lib docx file-saver @types/file-saver --save

### 4. Run the backend server:
      python3 backend/app.py

### 5. Install frontend dependencies: 
If you haven’t already, initialize and install:    
```bash
  npm install
```      
### 6. Start the frontend development server:
      npm run dev

## License 🪪
This project is licensed under the MIT License. Feel free to use, modify, and distribute this project.

## Contact ✉️
- **Developer**: Trupal Chauhan and Ishit Patel
- **Email**: acrosstheocean55@gmail.com
- **Location**: Ahmedabad, Gujarat

## Ownership 🫱🏻‍🫲🏼
This project is hosted on [Ishit Patel]'s GitHub account but was co-developed with [Trupal Chauhan].
This project was collaboratively created by:

- **Ishit Patel** ([GitHub Profile](https://github.com/ishit-patel02))
- **Trupal Chauhan** ([GitHub Profile](https://github.com/TrupalChauhan7))
