const path = require('path');

const whatsappConfig = {
  authStrategy: {
    dataPath: path.join(__dirname, '../../.wwebjs_auth'),
    clientId: 'whatsapp-bot'
  },
  puppeteerOpts: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
    headless: true
  },
  restartOnAuthFail: true
};

module.exports = whatsappConfig;