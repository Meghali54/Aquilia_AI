// Backend Configuration
export const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'aquila-marine-research-platform-secret-key-2025',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  // Database Configuration (Mock for now, easily replaceable)
  database: {
    type: process.env.DB_TYPE || 'mock',
    url: process.env.DATABASE_URL || '',
  },
  
  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedDataTypes: ['text/csv', 'application/json', 'text/plain'],
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  
  // AI Service Configuration
  ai: {
    speciesModelEndpoint: process.env.SPECIES_MODEL_URL || 'mock',
    dnaAnalysisEndpoint: process.env.DNA_ANALYSIS_URL || 'mock',
    otolithAnalysisEndpoint: process.env.OTOLITH_ANALYSIS_URL || 'mock',
    processingTimeout: parseInt(process.env.AI_TIMEOUT || '30000', 10), // 30 seconds
  },
  
  // External APIs
  external: {
    marineDbUrl: process.env.MARINE_DB_URL || 'https://api.marinespecies.org',
    geneticDbUrl: process.env.GENETIC_DB_URL || 'https://api.ncbi.nlm.nih.gov',
    weatherApiKey: process.env.WEATHER_API_KEY || '',
  },
  
  // Security Configuration
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/aquila.log',
  },
};