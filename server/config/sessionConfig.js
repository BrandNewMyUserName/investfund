export default {
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, 
      httpOnly: true, 
      secure: false, 
    }
  };
  