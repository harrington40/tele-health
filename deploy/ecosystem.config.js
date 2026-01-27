module.exports = {
  apps: [
    {
      name: 'telehealth-api-bridge',
      script: 'api-bridge-full.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 8081
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8081
      }
    },
    {
      name: 'telehealth-grpc-server',
      script: 'grpc-comprehensive-server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};