import {
	assignExam,
	getAllExamAssigned,
} from '@controller/exam/exam.assigned.controller';
import { newExam } from '@controller/exam/exam.controller';
import express from 'express';

const router = express.Router();

router.post('/new-exam', newExam);
router.post('/assign-exam', assignExam);
router.get('/get-all-exams-assigned', getAllExamAssigned);

export default router;
