"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editExam = exports.getExams = exports.newExam = void 0;
const exam_model_1 = __importDefault(require("../../models/exam.model"));
const mongodb_1 = require("mongodb");
const newExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exam = new exam_model_1.default(req.body);
        yield exam.save();
        return res.json({
            status: 200,
            msg: 'Examen creado',
        });
    }
    catch (error) {
        return error;
    }
});
exports.newExam = newExam;
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = new mongodb_1.ObjectId(req.params.id);
        const exams = yield exam_model_1.default.find({
            userId: _id,
        });
        return res.json({
            status: 200,
            exams,
            msg: 'Examenes obtenidos satisfactoriamente.',
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            msg: 'Error Get Exams',
        });
    }
});
exports.getExams = getExams;
const editExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = new mongodb_1.ObjectId(req.params.id);
        yield exam_model_1.default.findByIdAndUpdate(id, req.body);
        return res.json({
            status: 200,
            msg: 'Examen editado.',
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            msg: 'Error edit exam',
        });
    }
});
exports.editExam = editExam;
