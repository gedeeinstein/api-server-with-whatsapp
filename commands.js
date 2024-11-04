const UBUNTU_COMMANDS = {
  // System Information
  'uname -a': 'Show system and kernel information',
  'lsb_release -a': 'Show Ubuntu version information',
  'uptime': 'Show system uptime',
  'free -h': 'Display memory usage',
  'df -h': 'Show disk space usage',
  'top -b -n 1': 'Show running processes (snapshot)',
  
  // System Resources
  'ps aux': 'List all running processes',
  'vmstat': 'Show virtual memory statistics',
  'iostat': 'Show CPU and I/O statistics',
  'who': 'Show who is logged in',
  
  // Network
  'ip a': 'Show network interfaces',
  'netstat -tulpn': 'Show network connections',
  'ss -tulpn': 'Show socket statistics',
  'ping -c 4 google.com': 'Test network connectivity',
  
  // File System
  'ls -la': 'List files with details',
  'pwd': 'Show current directory',
  'du -sh *': 'Show directory sizes',
  'find / -type f -size +100M': 'Find large files',
  
  // Services
  'systemctl status': 'Show status of all services',
  'service --status-all': 'List all services',
  
  // Package Management
  'apt list --installed': 'List installed packages',
  'dpkg -l': 'List installed packages (detailed)',
  
  // Logs
  'tail -n 50 /var/log/syslog': 'Show last 50 lines of syslog',
  'journalctl -n 50': 'Show last 50 system log entries',
  
  // Hardware
  'lscpu': 'Show CPU information',
  'lsblk': 'List block devices',
  'lsusb': 'List USB devices',
  'lspci': 'List PCI devices',
  
  // User Management
  'w': 'Show logged in users and activity',
  'last': 'Show last logged in users',
  'id': 'Show current user info'
};

const isValidCommand = (command) => {
  return Object.keys(UBUNTU_COMMANDS).includes(command.trim());
};

const getCommandDescription = (command) => {
  return UBUNTU_COMMANDS[command.trim()] || 'Unknown command';
};

const listAllCommands = () => {
  return Object.entries(UBUNTU_COMMANDS)
    .map(([cmd, desc]) => `${cmd}: ${desc}`)
    .join('\n');
};

module.exports = {
  UBUNTU_COMMANDS,
  isValidCommand,
  getCommandDescription,
  listAllCommands
};