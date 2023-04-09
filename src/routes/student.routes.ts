import {
	getStudents,
	newStudent,
} from '@controller/student/student.controller';
import express from 'express';

const router = express.Router();

router.post('/new-student', newStudent);
router.get('/get-students/:id', getStudents);

export default router;
