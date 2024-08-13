const jwt = require('jsonwebtoken');

const verifyjwt = (req,res,next)=>{
    const authheader = req.headers.authorization || req.headers.Authorization;
    if(!authheader?.startsWith('Bearer ')) return res.sendStatus(401);
    console.log(authheader); // bearer token
    const token = authheader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decoded)=>{
            if(err) res.sendStatus(403) // invalid token
            req.user = decoded.Userinfo.username;
            req.role = decoded.Userinfo.role;
          next();
        }
        )
}
module.exports = verifyjwt;