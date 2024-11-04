const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const whatsappConfig = require('../config/whatsapp');
const logger = require('./logger');
const commandHandler = require('../handlers/commandHandler');

class WhatsAppService {
  constructor(io) {
    this.io = io;
    this.latestQR = null;
    this.client = new Client({
      authStrategy: new LocalAuth(whatsappConfig.authStrategy),
      puppeteer: whatsappConfig.puppeteerOpts,
      restartOnAuthFail: whatsappConfig.restartOnAuthFail
    });
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('qr', (qr) => this.handleQR(qr));
    this.client.on('ready', () => this.handleReady());
    this.client.on('authenticated', () => this.handleAuthenticated());
    this.client.on('auth_failure', (err) => this.handleAuthFailure(err));
    this.client.on('disconnected', (reason) => this.handleDisconnected(reason));
    this.client.on('message', (message) => this.handleMessage(message));
  }

  handleQR(qr) {
    logger.log('New QR code generated');
    this.latestQR = qr;
    qrcode.toDataURL(qr, (err, url) => {
      this.io.emit('qr', url);
    });
  }

  handleReady() {
    logger.log('WhatsApp bot is ready');
    this.io.emit('ready', 'WhatsApp is ready!');
  }

  handleAuthenticated() {
    logger.log('WhatsApp authenticated');
  }

  handleAuthFailure(err) {
    logger.error(`Auth failure: ${err}`);
  }

  handleDisconnected(reason) {
    logger.log(`WhatsApp disconnected: ${reason}`);
    this.io.emit('disconnected', 'WhatsApp disconnected. Reconnecting...');
    this.client.initialize();
  }

  async handleMessage(message) {
    await commandHandler.handle(message);
  }

  initialize() {
    return this.client.initialize().catch(err => {
      logger.error(`Initialization error: ${err}`);
    });
  }

  getLatestQR() {
    return this.latestQR;
  }

  isAuthenticated() {
    return this.client.authState?.isAuthenticated || false;
  }
}

module.exports = WhatsAppService;