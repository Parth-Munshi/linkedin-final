import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  onInsert: (text: string) => void;
  onClose: () => void;
}

const LinkedInPopup: React.FC<ModalProps> = ({ onInsert, onClose }) => {
  const [generatedText, setGeneratedText] = useState('Thank you');

  const handleGenerate = () => {
    setGeneratedText('Thank you');
  };

  const handleInsert = () => {
    onInsert(generatedText);
    onClose();
  };

  return (
    <div id = "linkedin-popup-modal">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Generate Response</h2>
        <textarea
          value={generatedText}
          onChange={(e) => setGeneratedText(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={4}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleGenerate}
          >
            Generate
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleInsert}
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPopup;
