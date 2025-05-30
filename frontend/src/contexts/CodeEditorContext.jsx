import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebRTC } from './WebRTCContext';

const CodeEditorContext = createContext(null);

export const useCodeEditor = () => {
  const context = useContext(CodeEditorContext);
  if (!context) {
    throw new Error('useCodeEditor must be used within a CodeEditorProvider');
  }
  return context;
};

export const CodeEditorProvider = ({ children }) => {
  const { socket } = useWebRTC();
  const [lastSyncedCode, setLastSyncedCode] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);

  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript', extension: 'js' },
    { id: 'python', name: 'Python', extension: 'py' },
    { id: 'java', name: 'Java', extension: 'java' },
    { id: 'cpp', name: 'C++', extension: 'cpp' },
    { id: 'typescript', name: 'TypeScript', extension: 'ts' }
  ];

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket && socket.current && newCode !== lastSyncedCode) {
      socket.current.emit('code-change', { code: newCode, language });
      setLastSyncedCode(newCode);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (socket) {
      socket.emit('code-change', { code, language: newLanguage });
    }
  };

  const executeCode = async () => {
    try {
      setIsExecuting(true);
      setError(null);
      
      // Here we would integrate with a code execution service like Judge0
      // For now, we'll just simulate code execution
      const response = await fetch('http://localhost:5001/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setOutput(data.output);
      }
    } catch (err) {
      setError('Failed to execute code. Please try again.');
      console.error('Code execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${supportedLanguages.find(lang => lang.id === language)?.extension || 'txt'}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (socket && socket.current) {
      socket.current.on('code-update', ({ code: newCode, language: newLanguage }) => {
        if (newCode !== lastSyncedCode) {
          setCode(newCode);
          setLanguage(newLanguage);
          setLastSyncedCode(newCode);
        }
      });

      socket.current.on('connect', () => {
        console.log('Connected to code sync server');
      });

      socket.current.on('disconnect', () => {
        console.log('Disconnected from code sync server');
      });
    }

    return () => {
      if (socket && socket.current) {
        socket.current.off('code-update');
        socket.current.off('connect');
        socket.current.off('disconnect');
      }
    };
  }, [socket, lastSyncedCode]);

  const value = {
    code,
    language,
    theme,
    isExecuting,
    output,
    error,
    supportedLanguages,
    setCode: handleCodeChange,
    setLanguage: handleLanguageChange,
    setTheme,
    executeCode,
    saveCode
  };

  return (
    <CodeEditorContext.Provider value={value}>
      {children}
    </CodeEditorContext.Provider>
  );
};