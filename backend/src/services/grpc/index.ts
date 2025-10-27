import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { config } from '../../config';
import { AuthService } from '../auth/auth.service';
import { ConsultationService } from '../consultation/consultation.service';

const PROTO_PATH_AUTH = __dirname + '/../../protos/auth.proto';
const PROTO_PATH_CONSULTATION = __dirname + '/../../protos/consultation.proto';

const packageDefinitionAuth = protoLoader.loadSync(PROTO_PATH_AUTH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const packageDefinitionConsultation = protoLoader.loadSync(PROTO_PATH_CONSULTATION, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const authProto = grpc.loadPackageDefinition(packageDefinitionAuth) as any;
const consultationProto = grpc.loadPackageDefinition(packageDefinitionConsultation) as any;

export async function startGRPCServers(): Promise<void> {
  // Auth Service Server
  const authServer = new grpc.Server();
  authServer.addService(authProto.auth.AuthService.service, {
    Register: AuthService.register,
    Login: AuthService.login,
    ValidateToken: AuthService.validateToken,
    RefreshToken: AuthService.refreshToken,
    Logout: AuthService.logout,
  });

  // Consultation Service Server
  const consultationServer = new grpc.Server();
  consultationServer.addService(consultationProto.consultation.ConsultationService.service, {
    CreateConsultation: ConsultationService.createConsultation,
    JoinConsultation: ConsultationService.joinConsultation,
    EndConsultation: ConsultationService.endConsultation,
    GetConsultationHistory: ConsultationService.getConsultationHistory,
    SendMessage: ConsultationService.sendMessage,
    GetMessages: ConsultationService.getMessages,
  });

  // Start servers
  await Promise.all([
    new Promise<void>((resolve, reject) => {
      authServer.bindAsync(
        `0.0.0.0:${config.grpc.authPort}`,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            reject(error);
          } else {
            authServer.start();
            console.log(`🔐 Auth gRPC server running on port ${port}`);
            resolve();
          }
        }
      );
    }),
    new Promise<void>((resolve, reject) => {
      consultationServer.bindAsync(
        `0.0.0.0:${config.grpc.consultationPort}`,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
          if (error) {
            reject(error);
          } else {
            consultationServer.start();
            console.log(`💬 Consultation gRPC server running on port ${port}`);
            resolve();
          }
        }
      );
    }),
  ]);
}