import React from 'react';
import { FaUpload, FaSearch, FaDownload, FaCopy } from 'react-icons/fa';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <FaUpload size={40} />,
      title: "Upload Image",
      description: "Upload your image containing text that you want to extract."
    },
    {
      icon: <FaSearch size={40} />,
      title: "Process Image",
      description: "Our advanced OCR technology scans and extracts text from your image."
    },
    {
      icon: <FaDownload size={40} />,
      title: "Get Results",
      description: "View the extracted text instantly on your screen."
    },
    {
      icon: <FaCopy size={40} />,
      title: "Copy or Download",
      description: "Copy the text to clipboard or download it as a file for your use."
    }
  ];

  return (
    <section className="py-12 pb-32 bg-transparent dark:bg-transparent transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100 relative inline-block">
            How This Tool Works
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our image to text converter makes extracting text from images simple and efficient. 
            Follow these easy steps to convert your images to text.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white/80 dark:bg-gray-700/90 backdrop-blur-sm p-6 rounded-lg shadow-md text-center 
                        transition-all duration-300 hover:shadow-xl hover:-translate-y-2
                        border border-transparent hover:border-blue-300 dark:hover:border-blue-500"
            >
              <div className="flex justify-center mb-4 text-blue-500 dark:text-blue-400 
                            transform transition-transform duration-300 hover:scale-110">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              <div className="mt-4 text-2xl font-bold text-blue-500 dark:text-blue-400 
                            transition-all duration-300 hover:text-purple-500 dark:hover:text-purple-400">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;