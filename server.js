const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const logger = require('./src/services/logger');
const WhatsAppService = require('./src/services/whatsapp');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const whatsappService = new WhatsAppService(io);
whatsappService.initialize();

app.get('/qr', (req, res) => {
  const latestQR = whatsappService.getLatestQR();
  if (latestQR) {
    qrcode.toDataURL(latestQR, (err, url) => {
      if (err) {
        res.status(500).json({ error: 'Failed to generate QR code' });
      } else {
        res.json({ qr: url });
      }
    });
  } else {
    res.status(404).json({ error: 'No QR code available' });
  }
});

app.get('/status', (req, res) => {
  res.json({ 
    status: 'Server is running',
    authenticated: whatsappService.isAuthenticated()
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.log(`Server started on port ${PORT}`);
});