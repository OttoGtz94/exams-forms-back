"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_controller_1 = require("../controllers/student/student.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/new-student', student_controller_1.newStudent);
router.get('/get-students/:id', student_controller_1.getStudents);
exports.default = router;
