var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserModel = new Schema({
	email: {
		type: String,
		unique: true
	},
	password: {
		type: String
	}
})

// methods ======================
// generating a hash
UserModel.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserModel.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("User", UserModel)