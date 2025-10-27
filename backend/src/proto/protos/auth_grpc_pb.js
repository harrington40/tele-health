// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var protos_auth_pb = require('../protos/auth_pb.js');

function serialize_auth_LoginRequest(arg) {
  if (!(arg instanceof protos_auth_pb.LoginRequest)) {
    throw new Error('Expected argument of type auth.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_LoginRequest(buffer_arg) {
  return protos_auth_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_LoginResponse(arg) {
  if (!(arg instanceof protos_auth_pb.LoginResponse)) {
    throw new Error('Expected argument of type auth.LoginResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_LoginResponse(buffer_arg) {
  return protos_auth_pb.LoginResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_LogoutRequest(arg) {
  if (!(arg instanceof protos_auth_pb.LogoutRequest)) {
    throw new Error('Expected argument of type auth.LogoutRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_LogoutRequest(buffer_arg) {
  return protos_auth_pb.LogoutRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_LogoutResponse(arg) {
  if (!(arg instanceof protos_auth_pb.LogoutResponse)) {
    throw new Error('Expected argument of type auth.LogoutResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_LogoutResponse(buffer_arg) {
  return protos_auth_pb.LogoutResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_RefreshTokenRequest(arg) {
  if (!(arg instanceof protos_auth_pb.RefreshTokenRequest)) {
    throw new Error('Expected argument of type auth.RefreshTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_RefreshTokenRequest(buffer_arg) {
  return protos_auth_pb.RefreshTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_RefreshTokenResponse(arg) {
  if (!(arg instanceof protos_auth_pb.RefreshTokenResponse)) {
    throw new Error('Expected argument of type auth.RefreshTokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_RefreshTokenResponse(buffer_arg) {
  return protos_auth_pb.RefreshTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_RegisterRequest(arg) {
  if (!(arg instanceof protos_auth_pb.RegisterRequest)) {
    throw new Error('Expected argument of type auth.RegisterRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_RegisterRequest(buffer_arg) {
  return protos_auth_pb.RegisterRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_RegisterResponse(arg) {
  if (!(arg instanceof protos_auth_pb.RegisterResponse)) {
    throw new Error('Expected argument of type auth.RegisterResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_RegisterResponse(buffer_arg) {
  return protos_auth_pb.RegisterResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_ValidateTokenRequest(arg) {
  if (!(arg instanceof protos_auth_pb.ValidateTokenRequest)) {
    throw new Error('Expected argument of type auth.ValidateTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_ValidateTokenRequest(buffer_arg) {
  return protos_auth_pb.ValidateTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_ValidateTokenResponse(arg) {
  if (!(arg instanceof protos_auth_pb.ValidateTokenResponse)) {
    throw new Error('Expected argument of type auth.ValidateTokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_ValidateTokenResponse(buffer_arg) {
  return protos_auth_pb.ValidateTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AuthServiceService = exports.AuthServiceService = {
  register: {
    path: '/auth.AuthService/Register',
    requestStream: false,
    responseStream: false,
    requestType: protos_auth_pb.RegisterRequest,
    responseType: protos_auth_pb.RegisterResponse,
    requestSerialize: serialize_auth_RegisterRequest,
    requestDeserialize: deserialize_auth_RegisterRequest,
    responseSerialize: serialize_auth_RegisterResponse,
    responseDeserialize: deserialize_auth_RegisterResponse,
  },
  login: {
    path: '/auth.AuthService/Login',
    requestStream: false,
    responseStream: false,
    requestType: protos_auth_pb.LoginRequest,
    responseType: protos_auth_pb.LoginResponse,
    requestSerialize: serialize_auth_LoginRequest,
    requestDeserialize: deserialize_auth_LoginRequest,
    responseSerialize: serialize_auth_LoginResponse,
    responseDeserialize: deserialize_auth_LoginResponse,
  },
  validateToken: {
    path: '/auth.AuthService/ValidateToken',
    requestStream: false,
    responseStream: false,
    requestType: protos_auth_pb.ValidateTokenRequest,
    responseType: protos_auth_pb.ValidateTokenResponse,
    requestSerialize: serialize_auth_ValidateTokenRequest,
    requestDeserialize: deserialize_auth_ValidateTokenRequest,
    responseSerialize: serialize_auth_ValidateTokenResponse,
    responseDeserialize: deserialize_auth_ValidateTokenResponse,
  },
  refreshToken: {
    path: '/auth.AuthService/RefreshToken',
    requestStream: false,
    responseStream: false,
    requestType: protos_auth_pb.RefreshTokenRequest,
    responseType: protos_auth_pb.RefreshTokenResponse,
    requestSerialize: serialize_auth_RefreshTokenRequest,
    requestDeserialize: deserialize_auth_RefreshTokenRequest,
    responseSerialize: serialize_auth_RefreshTokenResponse,
    responseDeserialize: deserialize_auth_RefreshTokenResponse,
  },
  logout: {
    path: '/auth.AuthService/Logout',
    requestStream: false,
    responseStream: false,
    requestType: protos_auth_pb.LogoutRequest,
    responseType: protos_auth_pb.LogoutResponse,
    requestSerialize: serialize_auth_LogoutRequest,
    requestDeserialize: deserialize_auth_LogoutRequest,
    responseSerialize: serialize_auth_LogoutResponse,
    responseDeserialize: deserialize_auth_LogoutResponse,
  },
};

exports.AuthServiceClient = grpc.makeGenericClientConstructor(AuthServiceService, 'AuthService');
