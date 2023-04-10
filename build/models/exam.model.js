"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
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
exports.default = mongoose_1.default.models.Exam ||
    mongoose_1.default.model('Exams', ExamSchema);
