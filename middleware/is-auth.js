module.exports = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.status(401).redirect('/login');
	}
	name = req.session.user.name || 'user';
	
	next();
}