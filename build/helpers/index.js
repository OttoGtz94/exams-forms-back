"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (user) => {
    const JWT = process.env.JWT || '';
    return jsonwebtoken_1.default.sign({
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        email: user.email,
        studentsId: user.studentsId,
    }, JWT, {
        expiresIn: '30d',
    });
};
exports.generateJWT = generateJWT;
const generateKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let chars = '';
    for (let i = 0; i < 4; i++) {
        chars += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const num = (Math.random() * 1000)
        .toString()
        .split('.')[1]
        .slice(0, 3);
    const mes = new Date().getMonth();
    const hora = new Date().getHours();
    const minutes = new Date().getMinutes();
    const key = `${chars}-${num}-${mes}${hora}${minutes}`;
    return key;
};
exports.generateKey = generateKey;
