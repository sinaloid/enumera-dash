import React, { useEffect, useRef } from 'react';

const MathText = ({ text }) => {
  const mathJaxRef = useRef(null);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise([mathJaxRef.current]);
    }
  }, [text]);

  return <div ref={mathJaxRef}>{text}</div>;
};

export default MathText;