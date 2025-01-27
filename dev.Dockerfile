# Use stable Node.js image
FROM node:latest

# Install bash and git tools
RUN apt-get update && apt-get install -y \
    bash \
    bash-completion \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json
# to optimize Docker cache when installing dependencies
COPY package*.json ./

# Debug: 
RUN ls -la

# Install dependencies
RUN npm install

# Copy all project into the container
COPY . .

# Expose default port for Next.js (3000)
EXPOSE 3000

# Command to start Next.js development server
CMD ["npm", "run", "dev"]