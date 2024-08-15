const jsonwebtoken = require("jsonwebtoken");

const validateAdmin = (req, res, next) => {
    const token = req.headers.token;
    if (token) {
        const decode = jsonwebtoken.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json('Token is inValid or Expired');
        }
        else {
            if (decode.email === process.env.ADMIN_EMAIL && decode.role === process.env.ADMIN_ROLE) {
                next();
            }
            else{
                return res.status(401).json('Unauthorized Access');
            }   
        }
    }
    else {
        return res.status(404).json('Token is not provided');
    }
}

module.exports = { validateAdmin }