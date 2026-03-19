# 1. Base image
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy all files
COPY . .

# 6. Expose backend port
EXPOSE 5000

# 7. Start server
CMD ["npm", "start"]