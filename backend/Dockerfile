# Set the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the Next.js application for production
RUN npm run build

# Copy the SSL/TLS certificate and private key into the container
COPY /etc/letsencrypt/live/yourdomain.com/fullchain.pem /app/cert.pem
COPY /etc/letsencrypt/live/yourdomain.com/privkey.pem /app/key.pem

# Set the environment variable to run the Next.js application in production mode
ENV NODE_ENV production
ENV PORT 443

# Expose the port that the application will run on
EXPOSE 443

# Start the application
CMD ["npm", "start", "--https", "--cert", "cert.pem", "--key", "key.pem"]
