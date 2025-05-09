import { useState } from "react";
import ChatWindow from "./ChatWindow";
import InputBox from "./InputBox";
import "./ChatApp.css";
import Spinner from "./Spinner";


const ChatApp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSend = async (text, file) => {

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (text) {
      formData.append('text', text);
    }

    // Ajoute le message de l'utilisateur
    //setMessages([...messages, { text, isUser: true }]);
    setMessages([...messages, { text, file, isUser: true }]);
    setIsLoading(true);
    // Envoie la requête à l'API du chatbot
    try {
      /*const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });*/
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "deepseek-r1:1.5b", prompt: text, stream: false })
      });

      const data = await response.json();
      const cleanResponse = data.response.replace(/<think>.*?<\/think>/gs, "").trim();

      setMessages([...messages, { text, isUser: true }, { text: cleanResponse, isUser: false }]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
        // Désactive le spinner
        setIsLoading(false);
      }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Chatbot <span className="text-primary">WILOFO</span></h1>
      <div className="row justify-content-center">
        <div className="col-md-11">
          <ChatWindow messages={messages} />
          {isLoading && <Spinner />} {/* Affiche le spinner pendant le chargement */}
          <InputBox onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default ChatApp;