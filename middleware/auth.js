import jwt from "jsonwebtoken";

export default function auth(req, res, next){
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({message: "Missing/Invalid token"});
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: payload.id, email: payload.email};
        next();
    } catch (err) {
        return res.status(401).json({message: "invalid token"});
    }
}