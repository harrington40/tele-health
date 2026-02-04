module.exports = {
  apps: [
    {
      name: 'telehealth-api',
      script: 'backend/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        RETHINKDB_HOST: '207.180.247.153',
        RETHINKDB_PORT: '28015',
        RETHINKDB_DB: 'telehealth_db_db',
        RETHINKDB_AUTH_KEY: 'Cosinesine900**',
        CORS_ALLOWED_ORIGINS: 'http://localhost:3000,http://tel.transtechologies.com,https://tel.transtechologies.com'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        RETHINKDB_HOST: '207.180.247.153',
        RETHINKDB_PORT: '28015',
        RETHINKDB_DB: 'telehealth_db_db',
        RETHINKDB_AUTH_KEY: 'Cosinesine900**',
        CORS_ALLOWED_ORIGINS: 'http://localhost:3000,http://tel.transtechologies.com,https://tel.transtechologies.com'
      }
    }
  ]
};
