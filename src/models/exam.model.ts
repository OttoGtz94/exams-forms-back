import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExamSchema = new Schema({
	name: {
		type: String,
		trim: true,
	},
	questions: [
		{
			question: String,
			answerCorrect: String,
			answersError: [String],
			points: Number,
		},
	],
	date: {
		type: Date,
		default: new Date(),
	},
	userId: Schema.Types.ObjectId,
});

export default mongoose.models.Exam ||
	mongoose.model('Exams', ExamSchema);
