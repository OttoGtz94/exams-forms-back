import { newStudent } from '@controller/student/student.controller';
import express from 'express';

const router = express.Router();

router.post('/new-student', newStudent);

export default router;
