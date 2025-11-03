#!/bin/bash

echo "🔧 Installing dependencies on remote server..."
npm install --production

echo "🗄️ Starting RethinkDB connection test..."
node -e "
const r = require('./services/rethinkdb');
r.table('doctors').count().then(count => {
  console.log('✅ Connected to RethinkDB. Doctors count:', count);
  process.exit(0);
}).catch(err => {
  console.error('❌ RethinkDB connection failed:', err.message);
  process.exit(1);
});
"

if [ $? -eq 0 ]; then
    echo "🚀 Starting gRPC services..."
    nohup node grpc/doctorServer.js > doctor.log 2>&1 &
    echo $! > doctor.pid

    nohup node grpc/bookingServer.js > booking.log 2>&1 &
    echo $! > booking.pid 2>/dev/null || echo "booking server not available"

    nohup node grpc/userServer.js > user.log 2>&1 &
    echo $! > user.pid 2>/dev/null || echo "user server not available"

    nohup node grpc/fileServer.js > file.log 2>&1 &
    echo $! > file.pid 2>/dev/null || echo "file server not available"

    echo "✅ gRPC services deployed and running!"
    echo "📊 Check logs: doctor.log, booking.log, user.log, file.log"
else
    echo "❌ Deployment failed - RethinkDB connection issue"
    exit 1
fi
