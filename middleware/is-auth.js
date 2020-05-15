exports.customer=(req,res,next)=>{
	if(!req.session.isLoggedIn){
		return res.redirect('/login');
								}
		next();
		};


exports.admin=(req,res,next)=>{
if(!req.session.isLoggedIn){
return res.redirect('/login');
										}
if(req.session.user.role!=='admin'){
	return res.redirect('/shop');
}
next();
	}