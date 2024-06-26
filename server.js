const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pgSession = require('connect-pg-simple')(session);
const pg = require('pg');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const manager = require('./index.js');

const app = express();

const PORT = process.env.PORT || 8000;
const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(session({
    store: new pgSession({
      pool: pool, 
      tableName: 'session',
    }),
    secret: "iopjkl1234",
    resave: false,
    saveUninitialized: false,
    cookie:{
      maxAge: 24*60*60*1000,
      httpOnly: true,
      // domain:".onrender.com",
      sameSite: 'none',
      secure: true
    }
  }));

const secretKey = "iopjkl1234";

app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

passport.use(new LocalStrategy(
    async (user_name, password, done) => {
            const result = await pool.query("SELECT * FROM USER_DETAILS WHERE user_name = $1", [user_name]);
            if (result.rows.length === 0) {
                return done(false, { message: "No Valid Username" });
            }

            const valid = await bcrypt.compare(password, result.rows[0].password);
            if (!valid) {
                return done(null, false, { message: "Incorrect Password" });
            }
            
            return done(null, result.rows[0]);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});
  
passport.deserializeUser(async function(id, done) {
    try {
      const result = await pool.query("SELECT * FROM USER_DETAILS WHERE user_id = $1", [id]);
      
      if (result.rows.length === 0) {
        return done(null, false);
      }
      
      const user = result.rows[0];
      return done(null, user);
    } catch (error) {
      return done(error);
    }
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
}   

app.post('/login', async (req, res, next) => {
    passport.authenticate('local', { failureRedirect: '/login' }, async (err, user, info) => {
      if (err) {
        return next(err);
      }
      console.log(user);
      if (!user) {
          res.status(404).json({ message: "Incorrect Password" });
      }

      req.login(user, (loginErr) => {
          if (loginErr) {
              return next(loginErr);
          }
          if (req.isAuthenticated()) {
            const token = jwt.sign({id: req.user.user_id, username: req.user.user_name}, secretKey, {expiresIn: '24h'});
            return res.json({user: req.user , token: token, message:"Authentication done"});
          } else {
              return res.status(200).json({ message: "Authentication failed" });
          }
      })
  })(req, res, next);
});

app.get('/bot/:message', authenticateToken, async (req, res, next) => {
    try {
        const response = await manager.process('en', req.params.message);
        if (response.answer) {
            res.status(200).json({ message: response.answer });
        } else {
            res.status(400).json({ message: 'irrevelant' });
        }
    } catch (error) {
        next(error);
    }
});

app.post('/signup', async (req, res, next)=>{
    try{
        const { user_id, user_name, gmail, phone_number, password } = req.body;
        if (!user_id || !user_name || !gmail || !phone_number || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const r = await pool.query("SELECT FROM USER_DETAILS WHERE user_name = $1", [user_name]);
        if(r.rowCount>0){
            res.status(201).json({message: "User name already exists"});
        }
        const hashed = await bcrypt.hash(password, 10);
        const result = await pool.query("INSERT INTO USER_DETAILS VALUES($1, $2, $3, $4, $5)", [user_id, user_name, gmail, phone_number, hashed]);
        if(result.rowCount===1){
            req.login(newUser.rows[0], function(err) {
                if (err) {
                  return next(err);
                }
                const token = jwt.sign({id: req.user.user_id, username: req.user.user_name}, secretKey, {expiresIn: '24h'});
                return res.status(200).json({ message: 'Registration successful', user: req.user, token:token});
              });
        }else{
            res.status(404).json({message:"Please check your inputs"});
        }
    }catch (e){
        next(e);
    }
});

app.post('/deposit', authenticateToken, async (req, res, next)=>{
    try{
        const {type, date, user_id, amount} = req.body;
        const result = await pool.query("UPDATE USER_DETAILS SET amount_avail = $1 WHERE User_id = $2", [amount,user_id]);
        if(result.rowCount===1){
            const tr = await pool.query("INSERT INTO TRANSACTIONS VALUES ($2, $2, $3, $1, $2, $4)", [date, user_id, amount, type]);
            res.status(200).json({message: "amount added"});
        }else{
            res.status(400).json({message: "Error in depositing"});
        }
    }catch(e){
        next(e);
    }
});

app.get('/checkbalance/:id', authenticateToken, async(req, res, next)=>{
    try{
        const {id} = req.params;
        const result = await pool.query("SELECT amount_avail FROM USER_DETAILS WHERE user_id = $1", [id]);
        if(result.rowCount===1){
            res.status(200).json(result.rows[0]);
        }else{
            res.status(400).json({message: "Not Found"});
        }
    }catch(e){
        next(e);
    }
});

app.post('/transfer', authenticateToken, async(req, res, next)=>{
    try{
        const {date, type, f, t, amount} = req.body;
        const result = await pool.query("SELECT amount_avail FROM USER_DETAILS WHERE user_id = $1", [f]);
        if(result.rows[0].amount_avail < amount){
            res.status(200).json({message: "Insufficient balance"});
        }else{
            const rslt = await pool.query("SELECT amount_avail FROM USER_DETAILS WHERE user_id = $1", [t]);
            let amt = rslt.rows[0].amount_avail;
            let frmamt = result.rows[0].amount_avail;
            frmamt = frmamt - amount;
            amt = amt + amount;
            const frmreslt = await pool.query("UPDATE USER_DETAILS SET amount_avail = $2 WHERE user_id = $1", [f, frmamt]);
            const reslt = await pool.query("UPDATE USER_DETAILS SET amount_avail = $2 WHERE user_id = $1", [t, amt]);
            if(reslt.rowCount === 1 && frmreslt.rowCount === 1){
                const tr = await pool.query("INSERT INTO TRANSACTIONS VALUES ($2, $3, $4, $1, $2, $5)", [date, f, t, amount, type]);
                res.status(200).json({message: "Transaction Successful!"});
            }else{
                res.status(500).json({message: "Transaction failed"});
            }
        }
    }catch(e){
        next(e);
    }
});

app.post('/withdraw', authenticateToken, async(req, res, next)=>{
    try{
        const {type, date, user_id, amount} = req.body;
        const result = await pool.query("SELECT amount_avail FROM USER_DETAILS WHERE user_id = $1", [user_id]);
        if(result.rowCount===1){
            if(result.rows[0].amount_avail<amount){
                res.status(500).json({message: "Insufficient Balance"});
            }else{
                let amt = result.rows[0].amount_avail;
                amt = amt - amount;
                const rslt = await pool.query("UPDATE USER_DETAILS SET amount_avail = $2 WHERE user_id = $1", [user_id, amt]);
                if(rslt.rowCount===1){
                    const tr = await pool.query("INSERT INTO TRANSACTIONS VALUES ($2, $2, $3, $1, $2, $4)", [date, user_id, amount, type]);
                    res.status(200).json({message: "Transaction Successful"});
                }else{
                    res.status(400).json({message: "Transaction failed"});
                }
            }
        }
    }catch(e){
        next(e);
    }
});

app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).json({message:"logged Out"});
    });
});
  
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});