import React from "react";
import ReactDOM  from "react-dom";
import LinkedInPopup from "./LinkedInPopup";

interface ModalProps {
    onInsert: (text: string) => void;
    onClose: () => void;
    style: React.CSSProperties;
    overlayStyle: React.CSSProperties;
  }
  
const Modal: React.FC<ModalProps> = ({ onInsert, onClose, style, overlayStyle }) => {
    const [generatedText, setGeneratedText] = useState('Thank you');

    const handleGenerate = () => {
        setGeneratedText('Thank you');
    };

    const handleInsert = (text : string) => {
        console.log(generatedText);
        onInsert(generatedText);
        handleClose();
    };

    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
      setIsVisible(false);
      onClose();
    };
  
    if (!isVisible) return null;

    return (
        <div style={{ ...overlayStyle, pointerEvents: 'auto' }}>
          <div style={{ ...style, pointerEvents: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <LinkedInPopup onInsert={onInsert} onClose={handleClose} />
          </div>
        </div>
      );
};

  export default Modal;

 