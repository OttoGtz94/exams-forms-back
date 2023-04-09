import {
	assignExam,
	getAllExamAssigned,
} from '@controller/exam/exam.assigned.controller';
import {
	editExam,
	getExams,
	newExam,
} from '@controller/exam/exam.controller';
import express from 'express';

const router = express.Router();

router.post('/new-exam', newExam);
router.post('/assign-exam', assignExam);
router.get('/get-exams-assigned/:id', getAllExamAssigned);
router.get('/get-exams/:id', getExams);
router.put('/update-exam/:id', editExam);

export default router;
