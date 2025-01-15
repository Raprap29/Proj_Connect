FROM node:15

# Create Directory when can run the copy and run
WORKDIR /app

# Copy All Package
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]