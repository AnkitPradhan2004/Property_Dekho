// Environment variables validation
const validateEnv = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`- ${varName}`);
    });
    process.exit(1);
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      console.error('JWT_SECRET must be at least 32 characters long');
      process.exit(1);
    }
    // Check for weak patterns
    const weakPatterns = [/^(..)\1+$/, /^(.)\1+$/, /^123/, /^abc/, /password/i];
    if (weakPatterns.some(pattern => pattern.test(process.env.JWT_SECRET))) {
      console.error('JWT_SECRET appears to be weak. Use a cryptographically secure random string.');
      process.exit(1);
    }
  }

  console.log('Environment validation passed');
};

module.exports = { validateEnv };