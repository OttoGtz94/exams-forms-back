"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
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
    curp: {
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
exports.default = mongoose_1.default.models.Student ||
    mongoose_1.default.model('Students', StudenSchema);
