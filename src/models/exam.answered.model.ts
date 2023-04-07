import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExamAnsweredSchema = new Schema({
	score: {
		type: Number,
		required: true,
	},
	qualified: {
		type: Boolean,
	},
	date: {
		type: Date,
		required: true,
	},
	userId: Schema.Types.ObjectId,
	studentId: Schema.Types.ObjectId,
	examId: Schema.Types.ObjectId,
});

export default mongoose.models.ExamAnswered ||
	mongoose.model('ExamAnswered', ExamAnsweredSchema);
