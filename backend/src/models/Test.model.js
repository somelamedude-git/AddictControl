const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
	alcoholic_id:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Alcohol"
	},

	logical_reasoning_score:{
		type: Number,
		default: 0
	},

	attempted: {
		type: Boolean,
		default: false
	},

	voice_score:{
		type: Number,
		default: 0
	},
	
	overall_score:{
		type: Number,
		default: 0
	}
}, {timestamps: true});

const Test = mongoose.model('Test', testSchema);

module.exports = {
	Test
}
