import React from 'react';
import MathText from './MathText';

const Message = ({ text, isUser }) => {
  // Fonction pour rendre le texte avec des formules mathématiques et du texte en gras
  const renderText = (text) => {
    return text.split('\n').map((line, lineIndex) => (
      <React.Fragment key={lineIndex}>
        {line.split(/(\\\[.*?\\\]|\*\*.*?\*\*)/gs).map((part, partIndex) => {
          if (part.startsWith('\\[') && part.endsWith('\\]')) {
            // Formule mathématique centrée
            return <MathText key={partIndex} text={part} />;
          } else if (part.startsWith('**') && part.endsWith('**')) {
            // Texte en gras
            return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
          } else {
            // Texte normal
            return <span key={partIndex}>{part}</span>;
          }
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`message ${isUser ? 'user' : 'bot'} mb-2`}>
      <div className={`p-2 rounded ${isUser ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '70%', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
        {renderText(text)}
      </div>
    </div>
  );
};

export default Message;