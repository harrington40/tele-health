import mqtt from 'mqtt';
import { config } from '../config';

class MQTTClient {
  private client: mqtt.MqttClient | null = null;
  private messageHandlers: Map<string, Function[]> = new Map();

  async connect(): Promise<void> {
    try {
      const options: mqtt.IClientOptions = {
        clientId: config.mqtt.clientId,
        clean: true,
        connectTimeout: 4000,
        username: config.mqtt.username,
        password: config.mqtt.password,
        reconnectPeriod: 1000,
      };

      this.client = mqtt.connect(config.mqtt.brokerUrl, options);

      return new Promise((resolve, reject) => {
        if (!this.client) return reject(new Error('Failed to create MQTT client'));

        this.client.on('connect', () => {
          console.log('✅ Connected to MQTT broker');
          this.subscribeToTopics();
          resolve();
        });

        this.client.on('error', (error) => {
          console.error('❌ MQTT connection error:', error);
          reject(error);
        });

        this.client.on('message', (topic, message) => {
          this.handleMessage(topic, message);
        });

        this.client.on('disconnect', () => {
          console.log('🔌 Disconnected from MQTT broker');
        });

        this.client.on('reconnect', () => {
          console.log('🔄 Reconnecting to MQTT broker');
        });
      });
    } catch (error) {
      console.error('❌ Failed to connect to MQTT broker:', error);
      throw error;
    }
  }

  private subscribeToTopics(): void {
    if (!this.client) return;

    // Subscribe to telehealth topics
    const topics = [
      'telehealth/consultations/+',
      'telehealth/messages/+',
      'telehealth/notifications/+'
    ];

    topics.forEach(topic => {
      this.client!.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`📡 Subscribed to ${topic}`);
        }
      });
    });
  }

  private handleMessage(topic: string, message: Buffer): void {
    const handlers = this.messageHandlers.get(topic) || [];
    handlers.forEach(handler => {
      try {
        handler(topic, message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  publish(topic: string, message: string | Buffer): void {
    if (!this.client) {
      console.error('MQTT client not connected');
      return;
    }

    this.client.publish(topic, message, { qos: 1 }, (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
      }
    });
  }

  subscribe(topic: string, handler: Function): void {
    if (!this.messageHandlers.has(topic)) {
      this.messageHandlers.set(topic, []);
    }
    this.messageHandlers.get(topic)!.push(handler);

    if (this.client) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        }
      });
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }
}

const mqttClient = new MQTTClient();

export async function startMQTTClient(): Promise<void> {
  await mqttClient.connect();
}

export { mqttClient };
export default mqttClient;