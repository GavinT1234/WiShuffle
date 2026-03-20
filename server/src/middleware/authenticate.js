import { verifyJWT } from '../services/authService.js'

const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticate(req, res, next) {
    const err = new Error('Not authenticated. Please provide a valid token.');
    err.status = 401;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(err);
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = await verifyJWT(token);
        next();
    } catch (error) {
        return next(err);
    }
    
}