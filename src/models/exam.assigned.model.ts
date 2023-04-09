import mongoose from 'mongoose';
import { generateKey } from '@helpers/index';
const { Schema } = mongoose;

const ExamAssignedSchema = new Schema({
	dateAssigned: {
		type: Date,
		default: new Date(),
	},
	dateLimit: {
		type: Date,
	},
	userId: Schema.Types.ObjectId,
	studentId: Schema.Types.ObjectId,
	examId: Schema.Types.ObjectId,
	clave: {
		type: String,
	},
});

export default mongoose.models.ExamAssigned ||
	mongoose.model('ExamAssigned', ExamAssignedSchema);
