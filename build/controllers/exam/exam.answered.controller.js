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
exports.markExam = exports.getExamsAnswereds = void 0;
const student_model_1 = __importDefault(require("../../models/student.model"));
const mongodb_1 = require("mongodb");
const exam_answered_model_1 = __importDefault(require("../../models/exam.answered.model"));
const getExamsAnswereds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = new mongodb_1.ObjectId(req.params.id);
        const studentExamAnswered = yield student_model_1.default.aggregate([
            {
                $lookup: {
                    from: 'examanswereds',
                    localField: 'examsAnsweredId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'exams',
                                localField: 'examId',
                                foreignField: '_id',
                                pipeline: [
                                    {
                                        $project: {
                                            name: 1,
                                            questions: 1,
                                        },
                                    },
                                ],
                                as: 'exam',
                            },
                        },
                        {
                            $project: {
                                score: 1,
                                reviewed: 1,
                                date: 1,
                                studentAnswers: 1,
                                exam: 1,
                            },
                        },
                        { $unwind: '$exam' },
                    ],
                    as: 'examAnswereds',
                },
            },
            { $unwind: '$examAnswereds' },
            {
                $match: {
                    userId: idUser,
                },
            },
            {
                $project: {
                    name: 1,
                    age: 1,
                    timeZone: 1,
                    examAnswereds: 1,
                },
            },
        ]);
        return res.json({
            status: 200,
            studentExamAnswered,
            msg: 'Examen Obtenido',
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            msg: 'Error get exams answereds',
        });
    }
});
exports.getExamsAnswereds = getExamsAnswereds;
const markExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = new mongodb_1.ObjectId(req.body.id);
        yield exam_answered_model_1.default.findByIdAndUpdate({ _id: id }, { reviewed: true });
        return res.json({
            status: 200,
            msg: 'Examen calificado',
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            msg: 'Error al calificar',
        });
    }
});
exports.markExam = markExam;
