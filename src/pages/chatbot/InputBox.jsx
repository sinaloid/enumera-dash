import React, { useState } from 'react';

const InputBox = ({ onSend, onFileUpload }) => {
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);

  const handleSend = () => {
    if (inputText.trim() || file) {
      onSend(inputText, file);
      setInputText('');
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="input-box d-flex flex-column mt-3">
      <div className="d-flex">
        <input
          type="text"
          className="form-control flex-grow-1"
          placeholder="Tapez votre message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-primary ms-2" onClick={handleSend}>
          Envoyer
        </button>
      </div>
      <input
        type="file"
        className="form-control mt-2"
        onChange={handleFileChange}
        accept="image/*, .pdf, .doc, .docx"
      />
    </div>
  );
};

export default InputBox;