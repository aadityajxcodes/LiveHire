import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const WebRTCContext = createContext(null);

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};

export const WebRTCProvider = ({ children }) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const peerConnection = useRef(null);
  const socket = useRef(null);

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const initializeWebRTC = async (roomId) => {
    try {
      // Initialize socket connection
      socket.current = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5
      });

      // Initialize peer connection
      peerConnection.current = new RTCPeerConnection(configuration);

      // Handle connection state changes
      peerConnection.current.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.current.connectionState);
        setIsConnected(peerConnection.current.connectionState === 'connected');
      };

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit('ice-candidate', {
            candidate: event.candidate,
            roomId
          });
        }
      };

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        console.log('Received remote track:', event.track.kind);
        setRemoteStream(event.streams[0]);
      };

      // Join room
      socket.current.emit('join-room', {
        roomId,
        userId: user._id,
        userRole: user.role
      });

      // Start local stream immediately
      const stream = await startLocalStream();
      if (stream) {
        stream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, stream);
        });
      }

      // Socket event handlers
      socket.current.on('user-connected', ({ userId, userRole }) => {
        setParticipants(prev => [...prev, { userId, userRole }]);
      });

      socket.current.on('user-disconnected', (userId) => {
        setParticipants(prev => prev.filter(p => p.userId !== userId));
      });

      socket.current.on('room-users', (users) => {
        setParticipants(users);
      });

      socket.current.on('offer', async ({ offer, offererId }) => {
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.current.emit('answer', { answer, targetUserId: offererId, roomId });
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      });

      socket.current.on('answer', async ({ answer }) => {
        try {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
          console.error('Error handling answer:', error);
        }
      });

      socket.current.on('ice-candidate', async ({ candidate }) => {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error handling ICE candidate:', error);
        }
      });

      socket.current.on('chat-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      setIsConnected(true);
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      throw error;
    }
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Failed to access camera and microphone. Please ensure they are connected and permissions are granted.');
      throw error;
    }
  };

  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  };

  const sendMessage = (message) => {
    if (socket.current) {
      socket.current.emit('chat-message', {
        message,
        sender: user.name
      });
    }
  };

  const cleanup = () => {
    stopLocalStream();
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }
    setIsConnected(false);
    setParticipants([]);
    setMessages([]);
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  const value = {
    localStream,
    remoteStream,
    isConnected,
    participants,
    messages,
    initializeWebRTC,
    startLocalStream,
    stopLocalStream,
    sendMessage,
    cleanup
  };

  return (
    <WebRTCContext.Provider value={value}>
      {children}
    </WebRTCContext.Provider>
  );
};