"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
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
exports.default = mongoose_1.default.models.ExamAnswered ||
    mongoose_1.default.model('ExamAnswered', ExamAnsweredSchema);
