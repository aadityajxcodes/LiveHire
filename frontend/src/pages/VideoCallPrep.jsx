import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
} from '@mui/material';

const VideoCallPrep = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  // Refs
  const videoRef = useRef(null);
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [audioInputDevices, setAudioInputDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [networkStatus, setNetworkStatus] = useState('checking');
  const [interview, setInterview] = useState(null);

  // Fetch interview details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        // Check for demo account
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.email === 'demo@company.com' || user.email === 'demo@interviewer.com') {
          // Use mock data for demo accounts
          const mockInterview = {
            _id: interviewId,
            status: 'accepted',
            position: 'Senior Frontend Developer',
            candidate: { name: 'John Doe' },
            interviewer: { name: 'Alex Smith' },
            company: { companyName: 'TechCorp Solutions' },
            date: new Date().toISOString(),
            time: '2:00 PM',
            duration: 60,
            codingLanguage: 'javascript'
          };
          setInterview(mockInterview);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/api/interviews/${interviewId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInterview(response.data);
      } catch (err) {
        console.error('Error fetching interview:', err);
        // Fallback to mock data if API call fails
        const mockInterview = {
          _id: interviewId,
          status: 'accepted',
          position: 'Senior Frontend Developer',
          candidate: { name: 'John Doe' },
          interviewer: { name: 'Alex Smith' },
          company: { companyName: 'TechCorp Solutions' },
          date: new Date().toISOString(),
          time: '2:00 PM',
          duration: 60,
          codingLanguage: 'javascript'
        };
        setInterview(mockInterview);
        setError('Could not connect to server. Using demo interview data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  // Initialize media devices
  useEffect(() => {
    const initializeDevices = async () => {
      try {
        // Get list of media devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        const videos = devices.filter(device => device.kind === 'videoinput');
        
        setAudioInputDevices(audioInputs);
        setVideoDevices(videos);
        
        if (audioInputs.length > 0) setSelectedAudioInput(audioInputs[0].deviceId);
        if (videos.length > 0) setSelectedVideo(videos[0].deviceId);
        
        // Initial media stream
        await startMediaStream(
          audioInputs.length > 0 ? audioInputs[0].deviceId : null,
          videos.length > 0 ? videos[0].deviceId : null
        );
        
        // Check network speed
        await checkNetworkSpeed();
        
        setLoading(false);
      } catch (err) {
        console.error("Error initializing devices:", err);
        // Proceed with fallback UI even if device access fails
        setError('Failed to access media devices. You can proceed without camera/microphone, but some features will be limited.');
        setLoading(false);
      }
    };

    initializeDevices();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start media stream with selected devices
  const startMediaStream = async (audioDeviceId, videoDeviceId) => {
    try {
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      // Get new stream with selected devices
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true
      });
      
      setStream(newStream);
      
      // Set video element source
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      
      return newStream;
    } catch (err) {
      console.error('Error starting media stream:', err);
      setError('Failed to access selected devices. Please try different ones.');
      return null;
    }
  };

  // Check network speed
  const checkNetworkSpeed = async () => {
    try {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const { downlink, effectiveType } = connection;
        
        if (downlink < 1 || effectiveType === '2g') {
          setNetworkStatus('poor');
        } else if (downlink < 5 || effectiveType === '3g') {
          setNetworkStatus('moderate');
        } else {
          setNetworkStatus('good');
        }
      } else {
        // Fallback method - measure time to download a small resource
        const startTime = Date.now();
        
        await fetch('https://www.google.com/favicon.ico');
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (duration > 200) {
          setNetworkStatus('poor');
        } else if (duration > 100) {
          setNetworkStatus('moderate');
        } else {
          setNetworkStatus('good');
        }
      }
    } catch (err) {
      console.error('Error checking network:', err);
      setNetworkStatus('unknown');
    }
  };

  // Handle audio input change
  const handleAudioInputChange = async (event) => {
    const deviceId = event.target.value;
    setSelectedAudioInput(deviceId);
    await startMediaStream(deviceId, selectedVideo);
  };

  // Handle video input change
  const handleVideoInputChange = async (event) => {
    const deviceId = event.target.value;
    setSelectedVideo(deviceId);
    await startMediaStream(selectedAudioInput, deviceId);
  };

  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  // Join interview without devices if needed
  const joinInterviewAnyway = () => {
    // Stop any current stream before navigating
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    navigate(`/interview/${interviewId}/live`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Setting up your devices...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1000px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Prepare for Your Interview
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
          <Button 
            color="primary" 
            size="small" 
            sx={{ ml: 2 }}
            onClick={joinInterviewAnyway}
          >
            Continue Anyway
          </Button>
        </Alert>
      )}
      
      {interview && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">
            Interview Details
          </Typography>
          <Typography>
            Position: {interview.position}
          </Typography>
          <Typography>
            Date: {new Date(interview.scheduledTime).toLocaleString()}
          </Typography>
          {interview.company && (
            <Typography>
              Company: {interview.company.name}
            </Typography>
          )}
        </Paper>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Camera Preview
            </Typography>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ 
                  width: '100%',
                  borderRadius: '8px',
                  backgroundColor: '#f0f0f0'
                }}
              />
              
              {!videoEnabled && (
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '8px'
                  }}
                >
                  <Typography>
                    Camera Off
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button 
                variant={audioEnabled ? "contained" : "outlined"} 
                color={audioEnabled ? "primary" : "error"}
                onClick={toggleAudio}
                fullWidth
              >
                {audioEnabled ? "Mute" : "Unmute"}
              </Button>
              <Button 
                variant={videoEnabled ? "contained" : "outlined"}
                color={videoEnabled ? "primary" : "error"}
                onClick={toggleVideo}
                fullWidth
              >
                {videoEnabled ? "Turn Off Camera" : "Turn On Camera"}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Device Settings
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Camera</InputLabel>
              <Select
                value={selectedVideo}
                label="Camera"
                onChange={handleVideoInputChange}
              >
                {videoDevices.map(device => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                  </MenuItem>
                ))}
                {videoDevices.length === 0 && (
                  <MenuItem value="">
                    No cameras available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Microphone</InputLabel>
              <Select
                value={selectedAudioInput}
                label="Microphone"
                onChange={handleAudioInputChange}
              >
                {audioInputDevices.map(device => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${audioInputDevices.indexOf(device) + 1}`}
                  </MenuItem>
                ))}
                {audioInputDevices.length === 0 && (
                  <MenuItem value="">
                    No microphones available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Network Status
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity={
                  networkStatus === 'good' ? 'success' : 
                  networkStatus === 'moderate' ? 'warning' : 
                  networkStatus === 'poor' ? 'error' : 'info'
                }
              >
                {networkStatus === 'good' && 'Your network connection is good'}
                {networkStatus === 'moderate' && 'Your network connection is moderate. You may experience some delays.'}
                {networkStatus === 'poor' && 'Your network connection is poor. You may experience issues with video quality.'}
                {networkStatus === 'unknown' && 'Unable to determine network quality.'}
                {networkStatus === 'checking' && 'Checking network quality...'}
              </Alert>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={joinInterviewAnyway}
              disabled={!stream}
            >
              Join Interview
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoCallPrep; 