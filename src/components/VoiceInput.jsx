import React, { useState } from 'react';
import { Button, Tooltip, message } from 'antd';
import { AudioOutlined, AudioFilled } from '@ant-design/icons';

const VoiceInput = ({ onVoiceInput, isMobile }) => {
  const [isListening, setIsListening] = useState(false);

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      message.warning('Voice input is not supported in your browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      message.loading('Listening... Speak now', 0);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      onVoiceInput(voiceText);
      message.success(`Added: "${voiceText}"`);
      setIsListening(false);
    };

    recognition.onerror = () => {
      message.error('Error occurred');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Tooltip title={!isMobile ? "Voice Input (Ctrl + V)" : ""}>
      <Button
        type={isListening ? 'primary' : 'default'}
        icon={isListening ? <AudioFilled /> : <AudioOutlined />}
        onClick={startVoiceInput}
        style={{ 
          marginBottom: 16,
          width: isMobile ? '100%' : 'auto',
          height: isMobile ? 44 : 40,
          background: isListening ? '#ff4d4f' : undefined,
          borderColor: isListening ? '#ff4d4f' : undefined
        }}
        danger={isListening}
        size={isMobile ? 'large' : 'middle'}
        block={isMobile}
      >
        {isListening ? 'Listening...' : 'Voice Input'}
      </Button>
    </Tooltip>
  );
};

export default VoiceInput;