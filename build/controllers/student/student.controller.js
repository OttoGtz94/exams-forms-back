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
exports.getStudents = exports.newStudent = void 0;
const student_model_1 = __importDefault(require("../../models/student.model"));
const mongodb_1 = require("mongodb");
const newStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existsStudent = yield student_model_1.default.findOne({
            curp: req.body.curp,
            userId: req.body.userId,
        });
        if (existsStudent) {
            return res.json({
                status: 500,
                msg: 'El alumno ya esta registrado',
            });
        }
        const student = new student_model_1.default(req.body);
        yield student.save();
        return res.json({
            status: 200,
            msg: `${student.name} fue registrado/a`,
        });
    }
    catch (error) {
        return error;
    }
});
exports.newStudent = newStudent;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = new mongodb_1.ObjectId(req.params.id);
        const students = yield student_model_1.default.find({
            userId: _id,
        });
        return res.json({
            status: 200,
            students,
            msg: 'Estudiantes obtenidos satisfactoriamente.',
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            msg: 'Error Get Students',
        });
    }
});
exports.getStudents = getStudents;
