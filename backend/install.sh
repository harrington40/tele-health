#!/bin/bash

echo "🚀 TeleHealth Backend Installation Script"
echo "========================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js
install_nodejs() {
    echo "📦 Installing Node.js..."
    if command_exists node; then
        echo "✅ Node.js already installed: $(node --version)"
    else
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
        echo "✅ Node.js installed: $(node --version)"
    fi
}

# Function to install RethinkDB
install_rethinkdb() {
    echo "🗄️ Installing RethinkDB..."
    if command_exists rethinkdb; then
        echo "✅ RethinkDB already installed"
    else
        source /etc/lsb-release
        echo "deb https://download.rethinkdb.com/repository/ubuntu-$DISTRIB_CODENAME $DISTRIB_CODENAME main" | sudo tee /etc/apt/sources.list.d/rethinkdb.list
        wget -qO- https://download.rethinkdb.com/repository/raw/pubkey.gpg | sudo apt-key add -
        sudo apt-get update
        sudo apt-get install -y rethinkdb
        echo "✅ RethinkDB installed"
    fi
}

# Function to install Mosquitto
install_mosquitto() {
    echo "📡 Installing Mosquitto MQTT Broker..."
    if command_exists mosquitto; then
        echo "✅ Mosquitto already installed"
    else
        sudo apt-get update
        sudo apt-get install -y mosquitto mosquitto-clients
        echo "✅ Mosquitto installed"
    fi
}

# Function to install PM2
install_pm2() {
    echo "⚙️ Installing PM2..."
    if command_exists pm2; then
        echo "✅ PM2 already installed"
    else
        npm install -g pm2
        echo "✅ PM2 installed"
    fi
}

# Function to setup services
setup_services() {
    echo "🔧 Setting up services..."
    
    # Start and enable RethinkDB
    sudo systemctl start rethinkdb
    sudo systemctl enable rethinkdb
    echo "✅ RethinkDB service started"
    
    # Start and enable Mosquitto
    sudo systemctl start mosquitto
    sudo systemctl enable mosquitto
    echo "✅ Mosquitto service started"
}

# Function to setup backend
setup_backend() {
    echo "🛠️ Setting up backend..."
    
    # Copy environment file
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "✅ Environment file created (.env)"
        echo "⚠️ Please edit .env with your configuration"
    fi
    
    # Install dependencies
    echo "📦 Installing npm dependencies..."
    npm install
    echo "✅ Dependencies installed"
    
    # Generate proto files (will be available after npm install)
    echo "🔨 Generating Protocol Buffer files..."
    npm run proto:generate
    echo "✅ Proto files generated"
    
    # Build project
    echo "🏗️ Building project..."
    npm run build
    echo "✅ Project built"
}

# Main installation process
main() {
    echo "Starting installation process..."
    echo ""
    
    # Update package lists
    echo "🔄 Updating package lists..."
    sudo apt-get update
    
    # Install components
    install_nodejs
    install_rethinkdb
    install_mosquitto
    install_pm2
    
    # Setup services
    setup_services
    
    # Setup backend
    setup_backend
    
    echo ""
    echo "🎉 Installation completed!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your configuration"
    echo "2. Run 'npm run dev' for development"
    echo "3. Run 'npm run start:services' for production"
    echo ""
    echo "Useful commands:"
    echo "- Check RethinkDB: http://localhost:8080"
    echo "- View logs: npm run logs"
    echo "- Stop services: npm run stop:services"
    echo ""
    echo "Services running on:"
    echo "- API Gateway: http://localhost:3001"
    echo "- RethinkDB Admin: http://localhost:8080"
    echo "- MQTT Broker: mqtt://localhost:1883"
}

# Run main function
main