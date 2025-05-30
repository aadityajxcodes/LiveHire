import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import EvaluationDialog from '../components/EvaluationDialog';

// Demo code snippets
const demoSnippets = {
  javascript: {
    'Hello World': {
      code: '// Simple hello world\nconsole.log("Hello, World!");',
      output: 'Hello, World!'
    },
    'Calculate Sum': {
      code: '// Calculate sum of numbers\nfunction sum(a, b) {\n  return a + b;\n}\n\nconsole.log(sum(5, 3));',
      output: '8'
    },
    'Array Operations': {
      code: '// Array operations\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);',
      output: '[2, 4, 6, 8, 10]'
    }
  },
  python: {
    'Hello World': {
      code: '# Simple hello world\nprint("Hello, World!")',
      output: 'Hello, World!'
    },
    'Calculate Sum': {
      code: '# Calculate sum of numbers\ndef sum(a, b):\n    return a + b\n\nprint(sum(5, 3))',
      output: '8'
    },
    'List Operations': {
      code: '# List operations\nnumbers = [1, 2, 3, 4, 5]\ndoubled = [n * 2 for n in numbers]\nprint(doubled)',
      output: '[2, 4, 6, 8, 10]'
    }
  },
  java: {
    'Hello World': {
      code: '// Simple hello world\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
      output: 'Hello, World!'
    },
    'Calculate Sum': {
      code: '// Calculate sum of numbers\npublic class Main {\n    public static int sum(int a, int b) {\n        return a + b;\n    }\n    \n    public static void main(String[] args) {\n        System.out.println(sum(5, 3));\n    }\n}',
      output: '8'
    },
    'Array Operations': {
      code: '// Array operations\npublic class Main {\n    public static void main(String[] args) {\n        int[] numbers = {1, 2, 3, 4, 5};\n        int[] doubled = new int[numbers.length];\n        \n        for(int i = 0; i < numbers.length; i++) {\n            doubled[i] = numbers[i] * 2;\n        }\n        \n        System.out.print("[");\n        for(int i = 0; i < doubled.length; i++) {\n            System.out.print(doubled[i]);\n            if(i < doubled.length - 1) System.out.print(", ");\n        }\n        System.out.println("]");\n    }\n}',
      output: '[2, 4, 6, 8, 10]'
    }
  }
};

const LiveInterview = () => {
  const navigate = useNavigate();
  // State for video/audio
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [error, setError] = useState(null);
  
  // State for code editor
  const [code, setCode] = useState(demoSnippets.javascript['Hello World'].code);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  
  // State for evaluation dialog
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  
  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize local video stream
  useEffect(() => {
    startLocalStream();
  }, []);

  // Update code when language changes
  useEffect(() => {
    setCode(demoSnippets[language]['Hello World'].code);
    setOutput('');
  }, [language]);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraEnabled,
        audio: micEnabled
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Failed to access camera/microphone. Please check permissions.');
      console.error('Media error:', err);
    }
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !micEnabled;
      });
    }
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    const stream = localVideoRef.current?.srcObject;
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !cameraEnabled;
      });
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
    setOutput('');
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const executeCode = () => {
    // Check if the code matches any demo snippet
    const snippets = demoSnippets[language];
    const matchingSnippet = Object.values(snippets).find(
      snippet => snippet.code.replace(/\s+/g, '') === code.replace(/\s+/g, '')
    );

    if (matchingSnippet) {
      setOutput(matchingSnippet.output);
    } else {
      setOutput('Error: This is a demo interface. Please use one of the following example codes:\n\n' +
        Object.keys(snippets).map(name => `${name}:\n${snippets[name].code}\n`).join('\n'));
    }
  };

  const handleEvaluationSubmit = (evaluationData) => {
    console.log('Evaluation submitted:', evaluationData);
    setEvaluationOpen(false);
    
    // Get user role from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Redirect based on user role
        if (user.role === 'company') {
          navigate('/company-dashboard');
        } else if (user.role === 'interviewer') {
          navigate('/interviewer-dashboard');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {/* Video Grid */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Interview Session
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setEvaluationOpen(true)}
                  >
                    End Interview
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEvaluationOpen(true)}
                    sx={{
                      bgcolor: '#0057b7',
                      '&:hover': {
                        bgcolor: '#004494'
                      }
                    }}
                  >
                    Evaluate Candidate
                  </Button>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <Typography variant="subtitle2" align="center">
                    You
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#f0f0f0'
                    }}
                  />
                  <Typography variant="subtitle2" align="center">
                    Remote Participant
                  </Typography>
                </Grid>
              </Grid>
              <Box mt={2} display="flex" justifyContent="center" gap={1}>
                <IconButton onClick={toggleMic}>
                  {micEnabled ? <MicIcon /> : <MicOffIcon color="error" />}
                </IconButton>
                <IconButton onClick={toggleCamera}>
                  {cameraEnabled ? <VideocamIcon /> : <VideocamOffIcon color="error" />}
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Code Editor Grid */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2}>
              <Box display="flex" alignItems="center" mb={2}>
                <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    onChange={handleLanguageChange}
                    label="Language"
                  >
                    <MenuItem value="javascript">JavaScript</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="java">Java</MenuItem>
                  </Select>
                </FormControl>
                <Box ml="auto">
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    onClick={executeCode}
                  >
                    Run
                  </Button>
                </Box>
              </Box>
              <Editor
                height="400px"
                language={language}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true
                }}
              />
              {output && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Output:</Typography>
                  <Paper variant="outlined">
                    <Box p={1}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {output}
                      </pre>
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Evaluation Dialog */}
      <EvaluationDialog
        open={evaluationOpen}
        onClose={() => setEvaluationOpen(false)}
        onSubmit={handleEvaluationSubmit}
      />
    </Box>
  );
};

export default LiveInterview;