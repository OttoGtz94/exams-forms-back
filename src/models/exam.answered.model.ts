import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExamAnsweredSchema = new Schema({
	score: {
		type: Number,
		required: true,
	},
	reviewed: {
		type: Boolean,
		default: false,
	},
	date: {
		type: Date,
		default: new Date(),
	},
	studentAnswers: [
		{
			question: String,
			answer: String,
		},
	],
	userId: Schema.Types.ObjectId,
	studentId: Schema.Types.ObjectId,
	examId: Schema.Types.ObjectId,
});

export default mongoose.models.ExamAnswered ||
	mongoose.model('ExamAnswered', ExamAnsweredSchema);
