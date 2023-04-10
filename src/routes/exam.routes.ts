import {
	assignExam,
	getAllExamAssigned,
	getExamAssignedKey,
} from '@controller/exam/exam.assigned.controller';
import {
	editExam,
	getExams,
	newExam,
} from '@controller/exam/exam.controller';
import express from 'express';
import { markExam } from '../controllers/exam/exam.assigned.controller';

const router = express.Router();

router.post('/new-exam', newExam);
router.post('/assign-exam', assignExam);
router.get('/get-exams-assigned/:id', getAllExamAssigned);
router.get('/get-exams/:id', getExams);
router.put('/update-exam/:id', editExam);
router.get('/get-exam-key/:key', getExamAssignedKey);
router.post('/mark-exam/:id', markExam);

export default router;
