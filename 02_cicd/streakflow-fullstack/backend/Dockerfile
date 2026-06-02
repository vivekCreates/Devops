FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

# Convert .env from Windows (CRLF) to Unix (LF) line endings
RUN if [ -f .env ]; then sed -i 's/\r$//' .env; fi

RUN npm run build

# Disable dotenvx auto-injection from Node 22
ENV DOTENV_KEY=""
ENV NODE_OPTIONS=""

EXPOSE 3000

CMD ["node", "dist/index.js"]