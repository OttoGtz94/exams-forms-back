import {
	assignExam,
	getAllExamAssigned,
} from '@controller/exam/exam.assigned.controller';
import {
	getExams,
	newExam,
} from '@controller/exam/exam.controller';
import express from 'express';

const router = express.Router();

router.post('/new-exam', newExam);
router.post('/assign-exam', assignExam);
router.get('/get-exams-assigned/:id', getAllExamAssigned);
router.get('/get-exams/:id', getExams);

export default router;
