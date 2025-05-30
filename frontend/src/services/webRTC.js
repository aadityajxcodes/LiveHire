import io from 'socket.io-client';

class WebRTCService {
  constructor() {
    this.socket = null;
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.isInitiator = false;
    this.room = null;
  }

  async initialize(roomId, onRemoteStream, onParticipantJoined, onParticipantLeft) {
    this.room = roomId;
    this.socket = io('http://localhost:5001', {
      transports: ['websocket'],
      query: { room: roomId }
    });

    this.setupSocketListeners(onRemoteStream, onParticipantJoined, onParticipantLeft);
    await this.setupPeerConnection();
  }

  setupSocketListeners(onRemoteStream, onParticipantJoined, onParticipantLeft) {
    this.socket.on('created', () => {
      this.isInitiator = true;
    });

    this.socket.on('joined', () => {
      this.isInitiator = false;
    });

    this.socket.on('full', () => {
      console.error('Room is full');
    });

    this.socket.on('offer', async (description) => {
      if (!this.isInitiator) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(description));
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.socket.emit('answer', answer, this.room);
      }
    });

    this.socket.on('answer', async (description) => {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(description));
    });

    this.socket.on('candidate', async (candidate) => {
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error('Error adding ice candidate:', e);
      }
    });

    this.socket.on('user-joined', onParticipantJoined);
    this.socket.on('user-left', onParticipantLeft);
  }

  async setupPeerConnection() {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:numb.viagenie.ca',
          username: 'webrtc@live.com',
          credential: 'muazkh'
        }
      ]
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('candidate', event.candidate, this.room);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      if (this.onRemoteStream) {
        this.onRemoteStream(event.streams[0]);
      }
    };
  }

  async startLocalStream(videoEnabled = true, audioEnabled = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled
      });

      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });

      if (this.isInitiator) {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        this.socket.emit('offer', offer, this.room);
      }

      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  async toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  async startScreenShare() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = this.peerConnection.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );

      if (sender) {
        await sender.replaceTrack(videoTrack);
      }

      videoTrack.onended = async () => {
        const cameraTrack = this.localStream.getVideoTracks()[0];
        if (sender && cameraTrack) {
          await sender.replaceTrack(cameraTrack);
        }
      };

      return screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  }

  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new WebRTCService(); 