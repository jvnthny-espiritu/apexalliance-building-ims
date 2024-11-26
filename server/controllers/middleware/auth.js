const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
	const authHeader = req.header('Authorization');
	if (authHeader && authHeader.startsWith('Bearer ')) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					console.log('JWT Verification Error: Token has expired');
					return res.status(401).json({ message: 'Token has expired. Please log in again.' });
				}
				return res.sendStatus(403);
			}
			req.user = user;
			next();
		});
	} else {
		res.sendStatus(401);
	}
};

const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.sendStatus(403);
		}
		next();
	};
};

module.exports = { authenticateJWT, authorizeRoles };