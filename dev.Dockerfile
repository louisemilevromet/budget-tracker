# Use stable Node.js image
FROM node:latest

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json
# to optimize Docker cache when installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project into the container
COPY . .

# Expose default port for Next.js (3000)
EXPOSE 3000

# Command to start Next.js development server
CMD ["npm", "run", "dev"]
