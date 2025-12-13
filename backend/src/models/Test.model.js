const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
	alcoholic_id:{
		type: mongoose.Types.ObjectId,
		ref: "Alcohol"
	},

	logical_reasoning_score:{
		type: Number,
		default: 0
	},

	voice_score:{
		type: Number,
		default: 0
	}
}, {timestamps: true});

const Test = mongoose.model('Test', testSchema);

