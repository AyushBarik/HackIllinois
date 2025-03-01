#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check requirements
if ! command_exists node; then
    echo "Error: Node.js is required but not installed"
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is required but not installed"
    exit 1
fi

# Install dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install --silent

echo "Installing backend dependencies..."
cd ../backend && npm install --silent

echo "Installing blockchain dependencies..."
cd ../blockchain/solana-contract && npm install --silent

# Start the applications
echo "Starting backend server..."
cd ../../backend
PORT=3001 node index.js &
BACKEND_PID=$!

echo "Starting frontend..."
cd ../frontend
GENERATE_SOURCEMAP=false CI=true BROWSER=none npm start --silent &
FRONTEND_PID=$!

echo "Waiting for services to start..."
sleep 5

# Check if services are running
nc -z localhost 3000 2>/dev/null
if [ $? -eq 0 ]; then
    echo "Frontend is running at http://localhost:3000"
else
    echo "Error: Frontend failed to start"
fi

nc -z localhost 3001 2>/dev/null
if [ $? -eq 0 ]; then
    echo "Backend is running at http://localhost:3001"
else
    echo "Error: Backend failed to start"
fi

# Handle script termination
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep script running and show logs
echo "Showing logs (Ctrl+C to stop):"
tail -f backend/nohup.out frontend/nohup.out 2>/dev/null &

# Keep script running
wait
