const { exec } = require('child_process');
const logger = require('../services/logger');
const { isValidCommand, getCommandDescription, listAllCommands } = require('../utils/commands');

const AUTHORIZED_NUMBERS = [
  // Add your WhatsApp numbers here in format: '1234567890@c.us'
];

class CommandHandler {
  async handle(message) {
    if (!this.isAuthorized(message.from)) {
      await message.reply('Unauthorized access.');
      logger.log(`Unauthorized access attempt from ${message.from}`);
      return;
    }

    const messageText = message.body.trim();
    logger.log(`Received command: ${messageText} from ${message.from}`);

    const handlers = {
      '!help': () => this.handleHelp(message),
      '!list': () => this.handleList(message),
      '!desc': () => this.handleDescription(message),
      '!cmd': () => this.handleCommand(message)
    };

    const command = Object.keys(handlers).find(cmd => messageText.startsWith(cmd));
    if (command) {
      await handlers[command]();
    }
  }

  isAuthorized(number) {
    return AUTHORIZED_NUMBERS.includes(number);
  }

  async handleHelp(message) {
    await message.reply(
      'Available commands:\n\n' +
      '!cmd <command> - Execute a command\n' +
      '!list - Show all available commands\n' +
      '!desc <command> - Show command description\n\n' +
      'Example: !cmd uptime'
    );
  }

  async handleList(message) {
    await message.reply('Available Ubuntu commands:\n\n' + listAllCommands());
  }

  async handleDescription(message) {
    const command = message.body.slice(6);
    const description = getCommandDescription(command);
    await message.reply(`${command}: ${description}`);
  }

  async handleCommand(message) {
    const command = message.body.slice(5).trim();
    
    if (!isValidCommand(command)) {
      await message.reply('⚠️ Invalid or unauthorized command. Use !list to see available commands.');
      logger.log(`Invalid command attempt: ${command}`);
      return;
    }
    
    logger.log(`Executing command: ${command}`);
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        logger.error(`Command error: ${error.message}`);
        await message.reply(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        logger.log(`Command stderr: ${stderr}`);
        await message.reply(`stderr: ${stderr}`);
        return;
      }
      logger.log(`Command executed successfully: ${command}`);
      await message.reply(`Command: ${command}\nOutput:\n${stdout}`);
    });
  }
}

module.exports = new CommandHandler();