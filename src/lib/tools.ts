export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  path: string;
  tags?: string[];
  isNew?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'developer',
    name: 'Developer Tools',
    description: 'Tools for developers and programmers',
    icon: 'Code2',
  },
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Text manipulation and formatting',
    icon: 'FileText',
  },
  {
    id: 'converter',
    name: 'Converters',
    description: 'Convert between different formats',
    icon: 'RefreshCw',
  },
  {
    id: 'math',
    name: 'Math',
    description: 'Calculations and math utilities',
    icon: 'Calculator',
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Image manipulation and processing',
    icon: 'Image',
  },
  {
    id: 'color',
    name: 'Color Tools',
    description: 'Color manipulation and conversion',
    icon: 'Palette',
  },
  {
    id: 'generator',
    name: 'Generators',
    description: 'Generate various content',
    icon: 'Sparkles',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security and encryption tools',
    icon: 'ShieldCheck',
  },
];

export const tools: Tool[] = [
  // Developer Tools
  {
    id: 'aes-encryption',
    name: 'AES Encryption',
    description: 'Encrypt and decrypt text with AES',
    category: 'security',
    icon: 'Lock',
    path: '/tools/aes-encryption',
    tags: ['aes', 'encryption', 'decryption', 'security'],
    isNew: true,
  },
  {
    id: 'bcrypt',
    name: 'Bcrypt Hash/Verify',
    description: 'Hash and verify passwords with Bcrypt',
    category: 'security',
    icon: 'ShieldCheck',
    path: '/tools/bcrypt',
    tags: ['bcrypt', 'password', 'hash', 'security'],
    isNew: true,
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    category: 'developer',
    icon: 'Regex',
    path: '/tools/regex-tester',
    tags: ['regex', 'test', 'debug', 'developer'],
    isNew: true,
  },
  {
    id: 'ascii-text-drawer',
    name: 'ASCII Text Drawer',
    description: 'Generate ASCII art banners and text',
    category: 'generator',
    icon: 'Layout',
    path: '/tools/ascii-text-drawer',
    tags: ['ascii', 'art', 'banner', 'generate'],
    isNew: true,
  },
  {
    id: 'hash-text',
    name: 'Hash Text',
    description: 'Generate MD5, SHA1, SHA256 hashes',
    category: 'security',
    icon: 'Fingerprint',
    path: '/tools/hash-text',
    tags: ['hash', 'md5', 'sha256', 'security'],
    isNew: true,
  },
  {
    id: 'crontab-generator',
    name: 'Crontab Generator',
    description: 'Create and understand cron expressions',
    category: 'developer',
    icon: 'Clock',
    path: '/tools/crontab-generator',
    tags: ['cron', 'crontab', 'schedule', 'linux'],
    isNew: true,
  },
  {
    id: 'docker-compose-converter',
    name: 'Docker Run to Compose',
    description: 'Convert docker run to docker-compose.yml',
    category: 'developer',
    icon: 'Box',
    path: '/tools/docker-compose-converter',
    tags: ['docker', 'compose', 'devops', 'convert'],
    isNew: true,
  },
  {
    id: 'list-converter',
    name: 'List Converter',
    description: 'Sort, deduplicate, and clean up text lists',
    category: 'text',
    icon: 'ListOrdered',
    path: '/tools/list-converter',
    tags: ['list', 'sort', 'unique', 'clean'],
    isNew: true,
  },
  {
    id: 'slugify',
    name: 'Slugify String',
    description: 'Convert text to URL-friendly slugs',
    category: 'text',
    icon: 'Link2',
    path: '/tools/slugify',
    tags: ['slug', 'url', 'seo', 'convert'],
    isNew: true,
  },
  {
    id: 'subnet-calculator',
    name: 'Subnet Calculator',
    description: 'Calculate IPv4 subnets and CIDR masks',
    category: 'developer',
    icon: 'Network',
    path: '/tools/subnet-calculator',
    tags: ['ip', 'subnet', 'network', 'cidr'],
    isNew: true,
  },
  {
    id: 'user-agent-parser',
    name: 'User Agent Parser',
    description: 'Decode browser user agent strings',
    category: 'developer',
    icon: 'Search',
    path: '/tools/user-agent-parser',
    tags: ['ua', 'useragent', 'browser', 'device'],
    isNew: true,
  },
  {
    id: 'sql-prettify',
    name: 'SQL Prettify',
    description: 'Format and beautify your SQL queries',
    category: 'developer',
    icon: 'Database',
    path: '/tools/sql-prettify',
    tags: ['sql', 'format', 'beautify', 'db'],
    isNew: true,
  },
  {
    id: 'chmod-calculator',
    name: 'Chmod Calculator',
    description: 'Calculate Linux file permissions',
    category: 'developer',
    icon: 'Shield',
    path: '/tools/chmod-calculator',
    tags: ['chmod', 'linux', 'permission', 'security'],
    isNew: true,
  },
  {
    id: 'json-yaml',
    name: 'JSON ↔ YAML',
    description: 'Convert data between JSON and YAML formats',
    category: 'developer',
    icon: 'Braces',
    path: '/tools/json-yaml',
    tags: ['json', 'yaml', 'convert'],
    isNew: true,
  },
  {
    id: 'jwt-parser',
    name: 'JWT Parser',
    description: 'Decode and analyze JSON Web Tokens',
    category: 'developer',
    icon: 'Fingerprint',
    path: '/tools/jwt-parser',
    tags: ['jwt', 'json', 'token', 'decode'],
    isNew: true,
  },
  {
    id: 'html-entities',
    name: 'HTML Entities',
    description: 'Encode and decode HTML entities',
    category: 'developer',
    icon: 'Code',
    path: '/tools/html-entities',
    tags: ['html', 'entities', 'encode', 'decode'],
    isNew: true,
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum',
    description: 'Generate placeholder text for designs',
    category: 'generator',
    icon: 'FileText',
    path: '/tools/lorem-ipsum',
    tags: ['lorem', 'ipsum', 'text', 'generate'],
    isNew: true,
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and beautify JSON data',
    category: 'developer',
    icon: 'Braces',
    path: '/tools/json-formatter',
    tags: ['json', 'format', 'beautify'],
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    category: 'developer',
    icon: 'Lock',
    path: '/tools/base64-encoder',
    tags: ['base64', 'encode', 'decode'],
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL strings',
    category: 'developer',
    icon: 'Link',
    path: '/tools/url-encoder',
    tags: ['url', 'encode', 'decode'],
  },
  
  // Text Tools
  {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, and lines',
    category: 'text',
    icon: 'Hash',
    path: '/tools/word-counter',
    tags: ['text', 'count', 'words'],
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between different cases',
    category: 'text',
    icon: 'Type',
    path: '/tools/case-converter',
    tags: ['text', 'case', 'convert'],
  },
  {
    id: 'text-diff',
    name: 'Text Diff',
    description: 'Compare two texts and find differences',
    category: 'text',
    icon: 'Diff',
    path: '/tools/text-diff',
    tags: ['text', 'diff', 'compare'],
  },
  
  // Converters
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert Unix timestamps to readable dates',
    category: 'converter',
    icon: 'Clock',
    path: '/tools/timestamp-converter',
    tags: ['timestamp', 'date', 'convert'],
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units',
    category: 'converter',
    icon: 'Ruler',
    path: '/tools/unit-converter',
    tags: ['unit', 'convert', 'measurement'],
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between color formats',
    category: 'color',
    icon: 'Palette',
    path: '/tools/color-converter',
    tags: ['color', 'convert', 'hex', 'rgb'],
  },
  
  // Math
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Simple and scientific calculator',
    category: 'math',
    icon: 'Calculator',
    path: '/tools/calculator',
    tags: ['math', 'calculator', 'calculate'],
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Calculate percentages easily',
    category: 'math',
    icon: 'Percent',
    path: '/tools/percentage-calculator',
    tags: ['math', 'percentage', 'calculate'],
  },
  
  // Generators
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure random passwords',
    category: 'security',
    icon: 'Key',
    path: '/tools/password-generator',
    tags: ['password', 'generate', 'security'],
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs',
    category: 'generator',
    icon: 'Fingerprint',
    path: '/tools/uuid-generator',
    tags: ['uuid', 'generate', 'random'],
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text',
    category: 'generator',
    icon: 'QrCode',
    path: '/tools/qr-generator',
    tags: ['qr', 'generate', 'code'],
    isNew: true,
  },
  {
    id: 'image-resize',
    name: 'Image Resize',
    description: 'Resize images in your browser',
    category: 'image',
    icon: 'Maximize',
    path: '/tools/image-resize',
    tags: ['image', 'resize', 'edit'],
    isNew: true,
  },
];

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(tool => tool.category === categoryId);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(
    tool =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
