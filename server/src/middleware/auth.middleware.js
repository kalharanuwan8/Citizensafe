import jwt from 'jsonwebtoken'

export const protect = (req, res, next) =>
{
    let token = req.headers.authorization?.split(" ")[1];
    if(!token)
        return res.status(401).json({error: "Not Authorized"});
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({error: "Token Failed"});
    }
}

export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: "Access denied, admin only." });
    }
}