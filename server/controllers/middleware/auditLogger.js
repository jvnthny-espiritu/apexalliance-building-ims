const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

const messageGenerator = (req, user, type) => {
    console.log('Request body:', req.body);
    const username = user?.fullname ? `${user.fullname.firstName} ${user.fullname.lastName}` : 'Unknown user';
    switch (req.method) {
        case 'POST':
            return `${username} added a new ${type}.`;
        case 'PUT':
            return `${username} updated ${type}.`;
        case 'DELETE':
            return `${username} deleted ${type}.`;
        default:
            return `${username} performed an action`;
    }
};

const auditLogger = (action) => {
    return async (req, res, next) => {
        const userId = req.user ? req.user.id : null;
        const user = await User.findById(userId);
        const details = `${req.method} ${req.originalUrl} - ${JSON.stringify(req.body)}`;

        const urlParts = req.originalUrl.split('/');
        console.log('URL parts:', urlParts);
        let type = urlParts[2] || 'item';
        type = type.replace(/s$/, ''); 

        const message = messageGenerator(req, user, type);

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