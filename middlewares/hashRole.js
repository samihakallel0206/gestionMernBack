const hashRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                errors:[{message:'Not authorized..'}]
            })
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                errors:[{message:'Access denied!!'}]
           })
       }
    next()
    }
}

module.exports = hashRole