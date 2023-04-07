import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;

const StudenSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	age: {
		type: Number,
		required: true,
	},
	city: {
		type: String,
		required: true,
		trim: true,
	},
	timeZone: {
		type: String,
		required: true,
		trim: true,
	},
	rfc: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: new Date(),
	},
	userId: Schema.Types.ObjectId,
	examsAssignedId: [Schema.Types.ObjectId],
	examsAnsweredId: [Schema.Types.ObjectId],
});

export default mongoose.models.Student ||
	mongoose.model('Students', StudenSchema);
