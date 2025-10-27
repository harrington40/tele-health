// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var protos_consultation_pb = require('../protos/consultation_pb.js');

function serialize_consultation_CreateConsultationRequest(arg) {
  if (!(arg instanceof protos_consultation_pb.CreateConsultationRequest)) {
    throw new Error('Expected argument of type consultation.CreateConsultationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_CreateConsultationRequest(buffer_arg) {
  return protos_consultation_pb.CreateConsultationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_CreateConsultationResponse(arg) {
  if (!(arg instanceof protos_consultation_pb.CreateConsultationResponse)) {
    throw new Error('Expected argument of type consultation.CreateConsultationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_CreateConsultationResponse(buffer_arg) {
  return protos_consultation_pb.CreateConsultationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_EndConsultationRequest(arg) {
  if (!(arg instanceof protos_consultation_pb.EndConsultationRequest)) {
    throw new Error('Expected argument of type consultation.EndConsultationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_EndConsultationRequest(buffer_arg) {
  return protos_consultation_pb.EndConsultationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_EndConsultationResponse(arg) {
  if (!(arg instanceof protos_consultation_pb.EndConsultationResponse)) {
    throw new Error('Expected argument of type consultation.EndConsultationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_EndConsultationResponse(buffer_arg) {
  return protos_consultation_pb.EndConsultationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_GetConsultationHistoryRequest(arg) {
  if (!(arg instanceof protos_consultation_pb.GetConsultationHistoryRequest)) {
    throw new Error('Expected argument of type consultation.GetConsultationHistoryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_GetConsultationHistoryRequest(buffer_arg) {
  return protos_consultation_pb.GetConsultationHistoryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_GetConsultationHistoryResponse(arg) {
  if (!(arg instanceof protos_consultation_pb.GetConsultationHistoryResponse)) {
    throw new Error('Expected argument of type consultation.GetConsultationHistoryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_GetConsultationHistoryResponse(buffer_arg) {
  return protos_consultation_pb.GetConsultationHistoryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_GetMessagesRequest(arg) {
  if (!(arg instanceof protos_consultation_pb.GetMessagesRequest)) {
    throw new Error('Expected argument of type consultation.GetMessagesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_GetMessagesRequest(buffer_arg) {
  return protos_consultation_pb.GetMessagesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_JoinConsultationRequest(arg) {
  if (!(arg instanceof protos_consultation_pb.JoinConsultationRequest)) {
    throw new Error('Expected argument of type consultation.JoinConsultationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_JoinConsultationRequest(buffer_arg) {
  return protos_consultation_pb.JoinConsultationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_JoinConsultationResponse(arg) {
  if (!(arg instanceof protos_consultation_pb.JoinConsultationResponse)) {
    throw new Error('Expected argument of type consultation.JoinConsultationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_JoinConsultationResponse(buffer_arg) {
  return protos_consultation_pb.JoinConsultationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_MessageResponse(arg) {
  if (!(arg instanceof protos_consultation_pb.MessageResponse)) {
    throw new Error('Expected argument of type consultation.MessageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_MessageResponse(buffer_arg) {
  return protos_consultation_pb.MessageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_SendMessageRequest(arg) {
  if (!(arg instanceof protos_consultation_pb.SendMessageRequest)) {
    throw new Error('Expected argument of type consultation.SendMessageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_SendMessageRequest(buffer_arg) {
  return protos_consultation_pb.SendMessageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_consultation_SendMessageResponse(arg) {
  if (!(arg instanceof protos_consultation_pb.SendMessageResponse)) {
    throw new Error('Expected argument of type consultation.SendMessageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_consultation_SendMessageResponse(buffer_arg) {
  return protos_consultation_pb.SendMessageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ConsultationServiceService = exports.ConsultationServiceService = {
  createConsultation: {
    path: '/consultation.ConsultationService/CreateConsultation',
    requestStream: false,
    responseStream: false,
    requestType: protos_consultation_pb.CreateConsultationRequest,
    responseType: protos_consultation_pb.CreateConsultationResponse,
    requestSerialize: serialize_consultation_CreateConsultationRequest,
    requestDeserialize: deserialize_consultation_CreateConsultationRequest,
    responseSerialize: serialize_consultation_CreateConsultationResponse,
    responseDeserialize: deserialize_consultation_CreateConsultationResponse,
  },
  joinConsultation: {
    path: '/consultation.ConsultationService/JoinConsultation',
    requestStream: false,
    responseStream: false,
    requestType: protos_consultation_pb.JoinConsultationRequest,
    responseType: protos_consultation_pb.JoinConsultationResponse,
    requestSerialize: serialize_consultation_JoinConsultationRequest,
    requestDeserialize: deserialize_consultation_JoinConsultationRequest,
    responseSerialize: serialize_consultation_JoinConsultationResponse,
    responseDeserialize: deserialize_consultation_JoinConsultationResponse,
  },
  endConsultation: {
    path: '/consultation.ConsultationService/EndConsultation',
    requestStream: false,
    responseStream: false,
    requestType: protos_consultation_pb.EndConsultationRequest,
    responseType: protos_consultation_pb.EndConsultationResponse,
    requestSerialize: serialize_consultation_EndConsultationRequest,
    requestDeserialize: deserialize_consultation_EndConsultationRequest,
    responseSerialize: serialize_consultation_EndConsultationResponse,
    responseDeserialize: deserialize_consultation_EndConsultationResponse,
  },
  getConsultationHistory: {
    path: '/consultation.ConsultationService/GetConsultationHistory',
    requestStream: false,
    responseStream: false,
    requestType: protos_consultation_pb.GetConsultationHistoryRequest,
    responseType: protos_consultation_pb.GetConsultationHistoryResponse,
    requestSerialize: serialize_consultation_GetConsultationHistoryRequest,
    requestDeserialize: deserialize_consultation_GetConsultationHistoryRequest,
    responseSerialize: serialize_consultation_GetConsultationHistoryResponse,
    responseDeserialize: deserialize_consultation_GetConsultationHistoryResponse,
  },
  sendMessage: {
    path: '/consultation.ConsultationService/SendMessage',
    requestStream: false,
    responseStream: false,
    requestType: protos_consultation_pb.SendMessageRequest,
    responseType: protos_consultation_pb.SendMessageResponse,
    requestSerialize: serialize_consultation_SendMessageRequest,
    requestDeserialize: deserialize_consultation_SendMessageRequest,
    responseSerialize: serialize_consultation_SendMessageResponse,
    responseDeserialize: deserialize_consultation_SendMessageResponse,
  },
  getMessages: {
    path: '/consultation.ConsultationService/GetMessages',
    requestStream: false,
    responseStream: true,
    requestType: protos_consultation_pb.GetMessagesRequest,
    responseType: protos_consultation_pb.MessageResponse,
    requestSerialize: serialize_consultation_GetMessagesRequest,
    requestDeserialize: deserialize_consultation_GetMessagesRequest,
    responseSerialize: serialize_consultation_MessageResponse,
    responseDeserialize: deserialize_consultation_MessageResponse,
  },
};

exports.ConsultationServiceClient = grpc.makeGenericClientConstructor(ConsultationServiceService, 'ConsultationService');
