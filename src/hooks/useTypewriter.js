import { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 50, delay = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let timeoutId;
    let i = 0;

    const startTyping = () => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        timeoutId = setTimeout(startTyping, speed);
      } else {
        setComplete(true);
      }
    };

    const initialDelay = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialDelay);
    };
  }, [text, speed, delay]);

  return { displayedText, complete };
};

export default useTypewriter;
