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
exports.saveExamStudent = exports.getExamAssignedKey = exports.getAllExamAssigned = exports.assignExam = void 0;
const exam_assigned_model_1 = __importDefault(require("../../models/exam.assigned.model"));
const student_model_1 = __importDefault(require("../../models/student.model"));
const exam_model_1 = __importDefault(require("../../models/exam.model"));
const mongodb_1 = require("mongodb");
const user_model_1 = __importDefault(require("../../models/user.model"));
const exam_answered_model_1 = __importDefault(require("../../models/exam.answered.model"));
const assignExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const examAssign = new exam_assigned_model_1.default(req.body);
        if (examAssign.studentId === undefined) {
            res.json({
                status: 404,
                msg: 'No existe ese estudiante',
            });
        }
        else if (examAssign.examId === undefined) {
            res.json({
                status: 404,
                msg: 'No existe el examen',
            });
        }
        const student = yield student_model_1.default.findOne({
            _id: req.body.studentId,
        });
        const examenesAsignados = yield student_model_1.default.aggregate([
            {
                $lookup: {
                    from: 'examassigneds',
                    localField: 'examsAssignedId',
                    foreignField: '_id',
                    as: 'examenesAsig',
                },
            },
            {
                $match: {
                    _id: student._id,
                },
            },
        ]);
        const existExam = examenesAsignados[0].examenesAsig.filter((exam) => exam.examId.toString() === req.body.examId);
        if (existExam.length > 0) {
            return res.json({
                status: 500,
                msg: 'Ese examen ya esta asignado al estudiante',
            });
        }
        student.examsAssignedId.push(examAssign._id);
        yield student_model_1.default.findByIdAndUpdate({
            _id: student._id,
        }, student);
        yield examAssign.save();
        return res.json({
            status: 200,
            msg: 'Examen asignado',
        });
    }
    catch (error) {
        return error;
    }
});
exports.assignExam = assignExam;
const getAllExamAssigned = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estudianteExamenesAsignados = yield student_model_1.default.aggregate([
            {
                $lookup: {
                    from: 'examassigneds',
                    localField: 'examsAssignedId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'exams',
                                localField: 'examId',
                                foreignField: '_id',
                                as: 'examen',
                            },
                        },
                        { $unwind: '$examen' },
                    ],
                    as: 'examenesAsig',
                },
            },
            { $unwind: '$examenesAsig' },
            {
                $match: {
                    userId: new mongodb_1.ObjectId(req.params.id),
                },
            },
        ]);
        return res.json({
            status: 200,
            estudianteExamenesAsignados,
            msg: 'Se obtuvieron todos los examenes asignados.',
        });
    }
    catch (error) {
        return error;
    }
});
exports.getAllExamAssigned = getAllExamAssigned;
const getExamAssignedKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const key = req.params.key;
        const examAssigned = yield exam_assigned_model_1.default.findOne({
            clave: key,
        });
        if (!examAssigned) {
            return res.json({
                status: 404,
                msg: 'Clave invalida',
            });
        }
        if (examAssigned.status) {
            return res.json({
                status: 500,
                msg: 'Clave invalida',
            });
        }
        const studentId = new mongodb_1.ObjectId(examAssigned.studentId);
        const student = yield student_model_1.default.findById({
            _id: studentId,
        }).select({
            name: 1,
            timeZone: 1,
        });
        const user = yield user_model_1.default.findById(examAssigned.userId).select({
            name: 1,
            firstName: 1,
            email: 1,
        });
        const exam = yield exam_model_1.default.findById(examAssigned.examId).select({
            name: 1,
            questions: 1,
        });
        const questionsArr = [];
        exam.questions.map((exam) => {
            let obj = {};
            obj.question = exam.question;
            obj.points = exam.points;
            const answersArr = [];
            answersArr.push(exam.answerCorrect);
            exam.answersError.map((ans) => answersArr.push(ans));
            obj.answers = answersArr.sort(() => Math.random() - 0.5);
            questionsArr.push(obj);
        });
        const forStudent = {
            _id: student._id,
            name: student.name,
            timeZone: student.timeZone,
            user: {
                email: user.email,
                firstName: user.firstName,
                nameUser: user.name,
            },
            exam: {
                nameExam: exam.name,
                clave: examAssigned.clave,
                dateAssigned: examAssigned.dateAssigned,
                dateLimit: examAssigned.dateLimit,
                idAssigned: examAssigned._id,
                questions: questionsArr.sort(() => Math.random() - 0.5),
            },
        };
        return res.json({
            status: 200,
            msg: 'Key Valida',
            forStudent,
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            msg: 'Error get key',
        });
    }
});
exports.getExamAssignedKey = getExamAssignedKey;
const saveExamStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answeredExamStudent = req.body.exam;
        const idExamAssigned = new mongodb_1.ObjectId(req.params.id);
        const examId = yield exam_assigned_model_1.default.findById({
            _id: idExamAssigned,
        }).select({
            examId: 1,
            studentId: 1,
        });
        const exam = yield exam_model_1.default.findById({
            _id: examId.examId,
        }).select({
            questions: 1,
            userId: 1,
        });
        let points = 0;
        exam.questions.forEach((qu) => {
            answeredExamStudent.forEach((an) => {
                if (qu.question === an.question) {
                    if (qu.answerCorrect === an.answer) {
                        points += qu.points;
                    }
                }
            });
        });
        yield exam_assigned_model_1.default.findByIdAndUpdate({ _id: idExamAssigned }, { status: true });
        const examAnsweredData = {
            score: points,
            studentAnswers: answeredExamStudent,
            userId: exam.userId,
            studentId: examId.studentId,
            examId: examId.examId,
        };
        const examAnswered = yield new exam_answered_model_1.default(examAnsweredData);
        examAnswered.save();
        const student = yield student_model_1.default.findById({
            _id: examId.studentId,
        });
        student.examsAnsweredId.push(examAnswered._id);
        const studentIdsExamAssigned = student.examsAssignedId.filter((idAssig) => idAssig.toString() !==
            idExamAssigned.toString());
        student.examsAssignedId = studentIdsExamAssigned;
        yield student_model_1.default.findByIdAndUpdate({ _id: student._id }, student);
        return res.json({
            status: 200,
            msg: `Examen enviado, obtuviste ${points} puntos`,
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            msg: 'Error guardar',
        });
    }
});
exports.saveExamStudent = saveExamStudent;
