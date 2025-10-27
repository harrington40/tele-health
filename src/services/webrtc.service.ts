import { VideoSession, VideoParticipant, Message } from '../types';

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  maxBandwidth: number;
  enableDataChannel: boolean;
  enableRecording: boolean;
  adaptiveQuality: boolean;
}

export interface ConnectionQuality {
  level: 'excellent' | 'good' | 'fair' | 'poor';
  bitrate: number;
  packetLoss: number;
  latency: number;
  jitter: number;
}

export interface SmartAlgorithmConfig {
  qualityThreshold: number;
  bandwidthLimit: number;
  adaptiveBitrate: boolean;
  connectionRecovery: boolean;
  participantLimit: number;
}

class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStreams: Map<string, MediaStream> = new Map();
  private dataChannels: Map<string, RTCDataChannel> = new Map();
  private config: WebRTCConfig;
  private smartConfig: SmartAlgorithmConfig;
  private connectionQuality: Map<string, ConnectionQuality> = new Map();
  private qualityMonitorIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(config?: Partial<WebRTCConfig>, smartConfig?: Partial<SmartAlgorithmConfig>) {
    this.config = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add TURN servers for production
        { urls: 'turn:turn.example.com:3478', username: 'user', credential: 'pass' }
      ],
      maxBandwidth: 1000, // kbps
      enableDataChannel: true,
      enableRecording: true,
      adaptiveQuality: true,
      ...config
    };

    this.smartConfig = {
      qualityThreshold: 0.7,
      bandwidthLimit: 500,
      adaptiveBitrate: true,
      connectionRecovery: true,
      participantLimit: 10,
      ...smartConfig
    };
  }

  // Smart algorithm: Initialize WebRTC connection with quality monitoring
  async initializeConnection(sessionId: string, participantId: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({
      iceServers: this.config.iceServers,
      iceTransportPolicy: 'all',
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require'
    });

    this.peerConnections.set(`${sessionId}-${participantId}`, pc);

    // Smart algorithm: Setup quality monitoring
    this.setupQualityMonitoring(sessionId, participantId, pc);

    // Smart algorithm: Setup connection recovery
    if (this.smartConfig.connectionRecovery) {
      this.setupConnectionRecovery(sessionId, participantId, pc);
    }

    // Setup data channel for chat if enabled
    if (this.config.enableDataChannel) {
      this.setupDataChannel(sessionId, participantId, pc);
    }

    return pc;
  }

  // Smart algorithm: Get optimized media constraints based on device capabilities and network
  async getSmartMediaConstraints(videoQuality: 'low' | 'medium' | 'high' = 'medium'): Promise<MediaStreamConstraints> {
    const constraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000,
        channelCount: 2
      },
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 30 }
      }
    };

    // Smart algorithm: Adjust video quality based on network and device capabilities
    const connectionQuality = await this.detectNetworkQuality();
    const deviceCapabilities = await this.detectDeviceCapabilities();

    if (videoQuality === 'low' || connectionQuality === 'poor' || !deviceCapabilities.highQualityVideo) {
      constraints.video = {
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 15, max: 15 }
      };
    } else if (videoQuality === 'high' && connectionQuality === 'excellent' && deviceCapabilities.highQualityVideo) {
      constraints.video = {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30, max: 60 }
      };
    }

    return constraints;
  }

  // Smart algorithm: Detect network quality
  private async detectNetworkQuality(): Promise<'excellent' | 'good' | 'fair' | 'poor'> {
    try {
      const connection = (navigator as any).connection ||
                        (navigator as any).mozConnection ||
                        (navigator as any).webkitConnection;

      if (connection) {
        const downlink = connection.downlink || 1;
        const effectiveType = connection.effectiveType || '4g';

        if (downlink >= 10 || effectiveType === '4g') return 'excellent';
        if (downlink >= 5 || effectiveType === '3g') return 'good';
        if (downlink >= 2) return 'fair';
        return 'poor';
      }
    } catch (error) {
      // Network quality detection failed
    }

    return 'good'; // Default fallback
  }

  // Smart algorithm: Detect device capabilities
  private async detectDeviceCapabilities(): Promise<{
    highQualityVideo: boolean;
    multipleCameras: boolean;
    screenShare: boolean;
  }> {
    const capabilities = {
      highQualityVideo: false,
      multipleCameras: false,
      screenShare: false
    };

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      capabilities.multipleCameras = videoDevices.length > 1;
      capabilities.screenShare = !!(navigator.mediaDevices as any).getDisplayMedia;

      // Check for high-quality video support
      if (videoDevices.length > 0) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1920, height: 1080 }
        });
        capabilities.highQualityVideo = stream.getVideoTracks().some(track => {
          const settings = track.getSettings();
          return (
            typeof settings.width === 'number' &&
            typeof settings.height === 'number' &&
            settings.width >= 1280 &&
            settings.height >= 720
          );
        });
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      // Device capability detection failed
    }

    return capabilities;
  }

  // Smart algorithm: Setup quality monitoring with adaptive bitrate
  private setupQualityMonitoring(sessionId: string, participantId: string, pc: RTCPeerConnection) {
    const key = `${sessionId}-${participantId}`;

    const monitorQuality = async () => {
      try {
        const stats = await pc.getStats();
        let bitrate = 0;
        let packetLoss = 0;
        let latency = 0;
        let jitter = 0;

        stats.forEach((report: any) => {
          if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
            bitrate = report.bytesReceived ? (report.bytesReceived * 8) / (report.timestamp - report.lastTimestamp || 1) : 0;
            packetLoss = report.packetsLost / (report.packetsReceived + report.packetsLost) || 0;
            jitter = report.jitter || 0;
          }
          if (report.type === 'candidate-pair' && report.state === 'succeeded') {
            latency = report.currentRoundTripTime * 1000 || 0;
          }
        });

        const quality: ConnectionQuality = {
          level: this.calculateQualityLevel(bitrate, packetLoss, latency),
          bitrate,
          packetLoss,
          latency,
          jitter
        };

        this.connectionQuality.set(key, quality);

        // Smart algorithm: Adaptive quality adjustment
        if (this.smartConfig.adaptiveBitrate) {
          await this.adjustQuality(sessionId, participantId, quality);
        }
      } catch (error) {
        // Quality monitoring failed
      }
    };

    const interval = setInterval(monitorQuality, 2000);
    this.qualityMonitorIntervals.set(key, interval);
  }

  // Smart algorithm: Calculate connection quality level
  private calculateQualityLevel(bitrate: number, packetLoss: number, latency: number): 'excellent' | 'good' | 'fair' | 'poor' {
    const qualityScore = (
      (bitrate / this.config.maxBandwidth) * 0.4 +
      (1 - packetLoss) * 0.4 +
      (latency < 100 ? 1 : latency < 200 ? 0.7 : latency < 500 ? 0.4 : 0.1) * 0.2
    );

    if (qualityScore >= 0.8) return 'excellent';
    if (qualityScore >= 0.6) return 'good';
    if (qualityScore >= 0.4) return 'fair';
    return 'poor';
  }

  // Smart algorithm: Adaptive quality adjustment
  private async adjustQuality(sessionId: string, participantId: string, quality: ConnectionQuality) {
    const key = `${sessionId}-${participantId}`;
    const pc = this.peerConnections.get(key);
    if (!pc) return;

    try {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (!sender) return;

      const parameters = sender.getParameters();
      if (!parameters.encodings) return;

      // Adjust bitrate based on quality
      let targetBitrate = this.config.maxBandwidth * 1000; // Convert to bps

      if (quality.level === 'poor') {
        targetBitrate *= 0.3;
      } else if (quality.level === 'fair') {
        targetBitrate *= 0.6;
      } else if (quality.level === 'good') {
        targetBitrate *= 0.8;
      }

      parameters.encodings[0].maxBitrate = targetBitrate;
      await sender.setParameters(parameters);
    } catch (error) {
      // Quality adjustment failed
    }
  }

  // Smart algorithm: Setup connection recovery
  private setupConnectionRecovery(sessionId: string, participantId: string, pc: RTCPeerConnection) {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      // Connection state changed

      if (state === 'failed' || state === 'disconnected') {
        if (reconnectAttempts < maxReconnectAttempts) {
          // Attempting reconnection
          setTimeout(() => {
            this.attemptReconnection(sessionId, participantId);
            reconnectAttempts++;
          }, 2000 * (reconnectAttempts + 1)); // Exponential backoff
        }
      } else if (state === 'connected') {
        reconnectAttempts = 0; // Reset on successful connection
      }
    };
  }

  // Smart algorithm: Attempt reconnection with fallback strategies
  private async attemptReconnection(sessionId: string, participantId: string) {
    try {
      const pc = this.peerConnections.get(`${sessionId}-${participantId}`);
      if (!pc) return;

      // Try ICE restart first
      const offer = await pc.createOffer({ iceRestart: true });
      await pc.setLocalDescription(offer);

      // In a real implementation, this would be sent to the signaling server
      // and forwarded to the remote peer
      // ICE restart initiated for reconnection
    } catch (error) {
      // Reconnection attempt failed
    }
  }

  // Setup data channel for real-time chat
  private setupDataChannel(sessionId: string, participantId: string, pc: RTCPeerConnection) {
    const key = `${sessionId}-${participantId}`;

    try {
      const dataChannel = pc.createDataChannel('chat', {
        ordered: true,
        maxPacketLifeTime: 3000,
      });

      dataChannel.onopen = () => {
        // Data channel opened
      };

      dataChannel.onmessage = (event) => {
        try {
          const message: Message = JSON.parse(event.data);
          this.handleIncomingMessage(sessionId, participantId, message);
        } catch (error) {
          // Failed to parse incoming message
        }
      };

      dataChannel.onclose = () => {
        // Data channel closed
      };

      this.dataChannels.set(key, dataChannel);
    } catch (error) {
      // Failed to create data channel
    }
  }

  // Handle incoming chat messages
  private handleIncomingMessage(sessionId: string, participantId: string, message: Message) {
    // Emit event for UI to handle
    const event = new CustomEvent('webrtc-message', {
      detail: { sessionId, participantId, message }
    });
    window.dispatchEvent(event);
  }

  // Send chat message via data channel
  async sendMessage(sessionId: string, participantId: string, message: Message): Promise<boolean> {
    const key = `${sessionId}-${participantId}`;
    const dataChannel = this.dataChannels.get(key);

    if (dataChannel && dataChannel.readyState === 'open') {
      try {
        dataChannel.send(JSON.stringify(message));
        return true;
      } catch (error) {
        // Failed to send message
        return false;
      }
    }

    return false;
  }

  // Get local media stream with smart constraints
  async getLocalStream(sessionId: string, constraints?: MediaStreamConstraints): Promise<MediaStream> {
    const smartConstraints = constraints || await this.getSmartMediaConstraints();
    const stream = await navigator.mediaDevices.getUserMedia(smartConstraints);
    this.localStreams.set(sessionId, stream);
    return stream;
  }

  // Add stream to peer connection
  async addStreamToConnection(sessionId: string, participantId: string, stream: MediaStream) {
    const pc = this.peerConnections.get(`${sessionId}-${participantId}`);
    if (!pc) throw new Error('Peer connection not found');

    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });
  }

  // Create and send offer
  async createOffer(sessionId: string, participantId: string): Promise<RTCSessionDescriptionInit> {
    const pc = this.peerConnections.get(`${sessionId}-${participantId}`);
    if (!pc) throw new Error('Peer connection not found');

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }

  // Handle incoming offer
  async handleOffer(sessionId: string, participantId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    const pc = this.peerConnections.get(`${sessionId}-${participantId}`);
    if (!pc) throw new Error('Peer connection not found');

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  // Handle incoming answer
  async handleAnswer(sessionId: string, participantId: string, answer: RTCSessionDescriptionInit) {
    const pc = this.peerConnections.get(`${sessionId}-${participantId}`);
    if (!pc) throw new Error('Peer connection not found');

    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  }

  // Add ICE candidate
  async addIceCandidate(sessionId: string, participantId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peerConnections.get(`${sessionId}-${participantId}`);
    if (!pc) throw new Error('Peer connection not found');

    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }

  // Get connection quality for a session
  getConnectionQuality(sessionId: string, participantId: string): ConnectionQuality | undefined {
    return this.connectionQuality.get(`${sessionId}-${participantId}`);
  }

  // Get all connection qualities for a session
  getAllConnectionQualities(sessionId: string): ConnectionQuality[] {
    const qualities: ConnectionQuality[] = [];
    this.connectionQuality.forEach((quality, key) => {
      if (key.startsWith(`${sessionId}-`)) {
        qualities.push(quality);
      }
    });
    return qualities;
  }

  // Smart algorithm: Optimize session based on participant count and quality
  async optimizeSession(sessionId: string, participants: VideoParticipant[]) {
    const qualities = this.getAllConnectionQualities(sessionId);
    const avgQuality = qualities.reduce((sum, q) => sum + (q.level === 'excellent' ? 4 : q.level === 'good' ? 3 : q.level === 'fair' ? 2 : 1), 0) / qualities.length;

    // If average quality is poor and we have many participants, suggest optimizations
    if (avgQuality < 2.5 && participants.length > 3) {
      // Reduce video quality for non-active speakers
      // Enable adaptive bitrate more aggressively
      // Suggest turning off video for some participants
      // Optimizing session for better performance
    }
  }

  // Cleanup resources
  cleanup(sessionId: string, participantId?: string) {
    const key = participantId ? `${sessionId}-${participantId}` : null;

    if (key) {
      // Cleanup specific connection
      const pc = this.peerConnections.get(key);
      if (pc) {
        pc.close();
        this.peerConnections.delete(key);
      }

      const stream = this.localStreams.get(sessionId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        this.localStreams.delete(sessionId);
      }

      const dataChannel = this.dataChannels.get(key);
      if (dataChannel) {
        dataChannel.close();
        this.dataChannels.delete(key);
      }

      const interval = this.qualityMonitorIntervals.get(key);
      if (interval) {
        clearInterval(interval);
        this.qualityMonitorIntervals.delete(key);
      }

      this.connectionQuality.delete(key);
    } else {
      // Cleanup all connections for session
      this.peerConnections.forEach((pc, connKey) => {
        if (connKey.startsWith(`${sessionId}-`)) {
          pc.close();
          this.peerConnections.delete(connKey);
        }
      });

      this.localStreams.delete(sessionId);

      this.dataChannels.forEach((dc, dcKey) => {
        if (dcKey.startsWith(`${sessionId}-`)) {
          dc.close();
          this.dataChannels.delete(dcKey);
        }
      });

      this.qualityMonitorIntervals.forEach((interval, intKey) => {
        if (intKey.startsWith(`${sessionId}-`)) {
          clearInterval(interval);
          this.qualityMonitorIntervals.delete(intKey);
        }
      });

      // Clear connection qualities
      this.connectionQuality.forEach((_, qualKey) => {
        if (qualKey.startsWith(`${sessionId}-`)) {
          this.connectionQuality.delete(qualKey);
        }
      });
    }
  }
}

// Export singleton instance
export const webRTCService = new WebRTCService();

// Export types
