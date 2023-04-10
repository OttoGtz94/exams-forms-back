"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
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
    status: {
        type: Boolean,
        default: false,
    },
});
exports.default = mongoose_1.default.models.ExamAssigned ||
    mongoose_1.default.model('ExamAssigned', ExamAssignedSchema);
