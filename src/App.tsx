import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './components/DarkModeToggle';
import HowItWorks from './components/HowItWorks';


const App: React.FC = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedText, setDetectedText] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloadFormat, setDownloadFormat] = useState('txt');
  const [ocrEngine, setOcrEngine] = useState('easyocr');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    console.log('Detected Text Updated:', detectedText);
    console.log('Detected Language:', language);
  }, [detectedText, language]);

  const handleLogout = () => {
    console.log('Logout button clicked');
    localStorage.removeItem('token');
    navigate('/', { replace: true });
    console.log('Navigated to /');
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setUploadedImage(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('engine', ocrEngine);

    try {
      const response = await fetch('http://localhost:5000/ocr', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('OCR Response:', data);
      
      if (response.ok) {
        setDetectedText(data.detected_text);
        setLanguage(data.language);
        showToastMessage('Text detection completed successfully!');
      } else {
        setDetectedText(`Error: ${data.error}`);
        setLanguage('unknown');
        showToastMessage('Text detection failed');
      }
    } catch (error) {
      setDetectedText(`Network Error: ${(error as Error).message}`);
      setLanguage('unknown');
      showToastMessage('Failed to connect to server');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      processImage(file);
    } else {
      showToastMessage('Please upload a valid image file (JPG or PNG)');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(detectedText);
    showToastMessage('Detected text copied to clipboard!');
  };

  const clearAll = () => {
    setUploadedImage(null);
    setDetectedText('');
    setLanguage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async () => {
    try {
      switch (downloadFormat) {
        case 'txt':
          const blob = new Blob([detectedText], { type: 'text/plain' });
          saveAs(blob, 'detected-text.txt');
          break;
        case 'pdf':
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage();
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
          page.drawText(detectedText, {
            x: 50,
            y: page.getHeight() - 50,
            font,
            size: 12,
            color: rgb(0, 0, 0),
          });
          const pdfBytes = await pdfDoc.save();
          saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), 'detected-text.pdf');
          break;
        case 'docx':
          const doc = new Document({
            sections: [{
              properties: {},
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: detectedText,
                      font: "Arial",
                      size: 24,
                    })
                  ],
                }),
              ],
            }],
          });
          const buffer = await Packer.toBuffer(doc);
          saveAs(new Blob([buffer]), 'detected-text.docx');
          break;
      }
      showToastMessage(`${downloadFormat.toUpperCase()} downloaded successfully!`);
    } catch (error) {
      showToastMessage(`Failed to generate ${downloadFormat.toUpperCase()} file`);
    }
  };

  // Add speech functionality
  const handleSpeak = () => {
    if (!detectedText) {
      showToastMessage('No text to speak');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(detectedText);
      // Set a slower speech rate (default is 1.0, lower values make it slower)
      utterance.rate = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onstart = () => setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {Array.from({ length: 20 }).map((_, index) => (
            <div 
              key={index}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="py-6 px-8 flex justify-between items-center bg-white dark:bg-gray-800 relative z-10">
        <div className="flex items-center gap-3">
          <i className="fas fa-eye text-3xl text-blue-600 dark:text-blue-400"></i>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Scanova
          </h1>
        </div>
        <div className="flex gap-6 items-center">
          <DarkModeToggle />
          <nav className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Contact</a>
          </nav>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-700/20 dark:hover:bg-red-800/30 text-red-700 dark:text-red-400 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12 max-w-5xl relative z-10 mb-24">
        {/* OCR Engine Selection */}
        <div className="mt-8 flex justify-center">
          <div className="relative">
            <label className="text-gray-600 dark:text-gray-300 mr-2">Select OCR Engine:</label>
            <select
              value={ocrEngine}
              onChange={(e) => setOcrEngine(e.target.value)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors appearance-none pr-8"
            >
              <option value="easyocr">EasyOCR</option>
              <option value="tesseract">Tesseract</option>
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-9 text-gray-500 dark:text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        {/* Upload area */}
        <div
          className={`mt-8 p-8 rounded-lg border-2 border-dashed transition-all duration-300
            ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 bg-white dark:bg-gray-700'}
            ${uploadedImage ? 'border-solid' : ''}
            dark:border-gray-600`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            {!uploadedImage ? (
              <>
                <i className="fas fa-cloud-upload-alt text-5xl text-blue-500 dark:text-blue-400 animate-bounce"></i>
                <h3 className="text-xl text-gray-600 dark:text-gray-300">Drag & Drop your image here or</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Choose File
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Supported formats: JPG, PNG</p>
              </>
            ) : (
              <div className="w-full">
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="max-h-64 mx-auto rounded-lg object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Processing your image...</p>
          </div>
        )}

        {/* Results section */}
        {detectedText && !isProcessing && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Detected Text</h3>
              {/* Enhanced 3D animated buttons */}
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors appearance-none pr-8"
                  >
                    <option value="txt">TXT</option>
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none"></i>
                </div>
                
                {/* Animated Speak Icon Button */}

                
                {/* 3D Download Button - Fixed */}
                <button
                  onClick={handleDownload}
                  className="download-button px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-700/20 dark:hover:bg-green-800/30 text-green-700 dark:text-green-400 rounded-lg transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="flex items-center justify-center relative z-10">
                    <div className="icon-3d-container download-icon">
                      <i className="fas fa-download mr-2"></i>
                    </div>
                    <span>Download</span>
                  </div>
                </button>
                
                {/* Existing buttons */}
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                >
                  <i className="far fa-copy mr-2"></i>Copy
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-700/20 dark:hover:bg-red-800/30 text-red-700 dark:text-red-400 rounded-lg transition-colors"
                >
                  <i className="far fa-trash-alt mr-2"></i>Clear
                </button>
              </div>
            </div>
            {/* Detected Text */}
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Detected Text</h4>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mt-2">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{detectedText}</p>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Language: {language} • {detectedText.length} characters • {detectedText.split(/\s+/).length} words
              </div>
            </div>
          </div>
        )}

        {/* Toast notifications */}
        <div
          className={`fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300
            ${showToast ? 'translate-y-0' : 'translate-y-full'}`}
        >
          {toastMessage}
        </div>
      </main>
      <HowItWorks />
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-8 w-full z-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-between items-center">
            <div className="text-gray-600 dark:text-gray-400">
              © 2025 Scanova. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>

            
    </div>
  );
};

export default App;
