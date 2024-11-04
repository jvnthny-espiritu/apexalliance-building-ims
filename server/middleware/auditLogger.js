const AuditLog = require('../models/AuditLog');

const messageGenerator = (req, user) => {
    const username = user ? user.username : 'Unknown user';
    switch (req.method) {
        case 'POST':
            return `${username} added a new ${req.body.type}`;
        case 'PUT':
            return `${username} updated ${req.body.type}`;
        case 'DELETE':
            return `${username} deleted ${req.body.type}`;
        default:
            return `${username} performed an action`;
    }
};

const auditLogger = (action) => {
    return async (req, res, next) => {
        const userId = req.user ? req.user._id : null;
        const details = `${req.method} ${req.originalUrl} - ${JSON.stringify(req.body)}`;
        const message = messageGenerator(req, req.user);

        const log = new AuditLog({
            userId,
            action,
            details,
            message
        });
        console.log('Log Success:', log);

        await log.save();
        next();
    };
};

module.exports = auditLogger;