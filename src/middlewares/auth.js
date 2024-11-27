const authAdmin = (req, res, next) => {
    const token = 'xyz';
    const isAdminAuthorized = token === 'xyz';
    if (!isAdminAuthorized) {
        res.status(401).send("Admin not authorized");
    }
    next();

};
const userAuth = (req, res, next) => {
    const token = 'xyz';
    const isUserAuthorized = token === 'xyz';
    if (!isUserAuthorized) {
        res.status(401).send("User not logged in");
    }
    next();

};

module.exports = { authAdmin, userAuth };