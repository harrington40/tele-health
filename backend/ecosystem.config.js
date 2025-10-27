module.exports = {
  apps: [
    {
      name: 'telehealth-api-gateway',
      script: 'dist/gateway/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'telehealth-auth-service',
      script: 'dist/services/auth/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        GRPC_PORT: 50051
      },
      env_production: {
        NODE_ENV: 'production',
        GRPC_PORT: 50051
      }
    },
    {
      name: 'telehealth-patient-service',
      script: 'dist/services/patient/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        GRPC_PORT: 50052
      },
      env_production: {
        NODE_ENV: 'production',
        GRPC_PORT: 50052
      }
    },
    {
      name: 'telehealth-consultation-service',
      script: 'dist/services/consultation/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        GRPC_PORT: 50053
      },
      env_production: {
        NODE_ENV: 'production',
        GRPC_PORT: 50053
      }
    },
    {
      name: 'telehealth-notification-service',
      script: 'dist/services/notification/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        GRPC_PORT: 50054
      },
      env_production: {
        NODE_ENV: 'production',
        GRPC_PORT: 50054
      }
    }
  ]
};