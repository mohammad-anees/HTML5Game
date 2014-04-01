
exports.index = function(req,res){

	res.render('index', { title: 'FatMan' });
};


exports.game = function(req,res){

	res.render('Game', { title: 'FatMan'});
};