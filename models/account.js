const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
	title: {
		type: String,
		required: true 
	},
	in_outcome: {
		type: String,
		required: true 
	},
	price: {
		type: Number,
		required: true 
	},
	detail: {
		type: String 
	}, 
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true 
	},
	time: {
		type: String,
		required: true 
	}
});

module.exports = mongoose.model('Account', accountSchema);