const { BAZA_MOVIES = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const { JWT_KEY = 'dev-secret' } = process.env;

module.exports = { BAZA_MOVIES, JWT_KEY };
