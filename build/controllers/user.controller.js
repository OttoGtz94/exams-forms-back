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
exports.hasToken = exports.getInfoGral = exports.login = exports.newUser = void 0;
const index_1 = require("../helpers/index");
const user_model_1 = __importDefault(require("../models/user.model"));
const exam_model_1 = __importDefault(require("../models/exam.model"));
const mongodb_1 = require("mongodb");
const student_model_1 = __importDefault(require("../models/student.model"));
const exam_assigned_model_1 = __importDefault(require("../models/exam.assigned.model"));
const exam_answered_model_1 = __importDefault(require("../models/exam.answered.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existsEmail = yield user_model_1.default.findOne({
            email: req.body.email,
        });
        if (existsEmail) {
            return res.json({
                status: 500,
                msg: 'El correo electronico ya existe',
            });
        }
        const user = new user_model_1.default(req.body);
        yield user.save();
        return res.json({
            status: 200,
            msg: `${user.name} fue registrado/a`,
        });
    }
    catch (error) {
        return res.json({ status: 500, error });
    }
});
exports.newUser = newUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const existsEmail = yield user_model_1.default.findOne({
            email: email,
        });
        if (!existsEmail) {
            return res.json({
                status: 404,
                msg: 'Usuario y/o contraseña incorrectos',
            });
        }
        const successLogin = yield existsEmail.checkPassword(password);
        if (!successLogin) {
            return res.json({
                status: 400,
                msg: 'Usuario y/o contraseña incorrectos',
            });
        }
        return res.json({
            status: 200,
            msg: 'Usuario autenticado',
            token: (0, index_1.generateJWT)(existsEmail),
        });
    }
    catch (error) {
        return res.json({
            status: 500,
            msg: 'Hubo un error',
        });
    }
});
exports.login = login;
const getInfoGral = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = new mongodb_1.ObjectId(req.body._id);
        const countExams = yield exam_model_1.default.count({
            userId: new mongodb_1.ObjectId(userId),
        });
        const countStudents = yield student_model_1.default.count({
            userId: new mongodb_1.ObjectId(userId),
        });
        const countExamsAssigned = yield exam_assigned_model_1.default.count({
            userId: new mongodb_1.ObjectId(userId),
        });
        const countExamsAnswered = yield exam_answered_model_1.default.count({
            userId: new mongodb_1.ObjectId(userId),
        });
        return res.json({
            status: 200,
            info: {
                countExams,
                countExamsAssigned,
                countStudents,
                countExamsAnswered,
            },
        });
    }
    catch (error) {
        return error;
    }
});
exports.getInfoGral = getInfoGral;
const hasToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    const dataJWT = jsonwebtoken_1.default.decode(token);
    if (dataJWT !== null) {
        const userInfo = {
            email: dataJWT.email,
            exp: dataJWT.exp,
            firstName: dataJWT.firstName,
            iat: dataJWT.iat,
            id: dataJWT.id,
            name: dataJWT.name,
        };
        return res.json({
            status: 200,
            userInfo,
            msg: 'Autenticación Correcta',
        });
    }
    else {
        return res.json({
            status: 400,
            msg: 'No existe el token',
        });
    }
});
exports.hasToken = hasToken;
