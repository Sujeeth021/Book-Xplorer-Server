const whitelist = [
  'https://ateeqrana.live', 
  'http://127.0.0.1:5500', 
  'http://localhost:8082', 
  'http://localhost:3000',
  'https://stellar-centaur-000321.netlify.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin, like mobile apps or curl requests
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

export default corsOptions;
