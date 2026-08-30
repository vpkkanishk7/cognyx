# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Install system dependencies, Node.js (18.x), and npm
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy Python requirements and install
COPY ml_service/requirements.txt ./ml_service/
RUN pip install --no-cache-dir -r ml_service/requirements.txt

# Copy the rest of the application
COPY . .

# Expose Render's standard web port
EXPOSE 3000

# Run the concurrent start script
CMD ["npm", "run", "start:render"]
