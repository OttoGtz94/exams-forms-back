import ExamAssignedModel from '@model/exam.assigned.model';
import { AxiosResponse, AxiosError } from 'axios';
import StudentModel from '@model/student.model';
import ExamModel from '@model/exam.model';
import { ObjectId } from 'mongodb';
import UserModel from '@model/user.model';
import { QuestionForStudentInterface } from '../../interfaces/exam.interface';
import { ResForStudentInterface } from '../../interfaces/student.interface';
import ExamAnsweredModel from '@model/exam.answered.model';

export const assignExam = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const examAssign = new ExamAssignedModel(req.body);
		if (examAssign.studentId === undefined) {
			res.json({
				status: 404,
				msg: 'No existe ese estudiante',
			});
		} else if (examAssign.examId === undefined) {
			res.json({
				status: 404,
				msg: 'No existe el examen',
			});
		}
		const student = await StudentModel.findOne({
			_id: req.body.studentId,
		});

		const examenesAsignados =
			await StudentModel.aggregate([
				{
					$lookup: {
						from: 'examassigneds',
						localField: 'examsAssignedId',
						foreignField: '_id',
						as: 'examenesAsig',
					},
				},
				{
					$match: {
						_id: student._id,
					},
				},
			]);
		const existExam =
			examenesAsignados[0].examenesAsig.filter(
				(exam: any) =>
					exam.examId.toString() === req.body.examId,
			);

		if (existExam.length > 0) {
			return res.json({
				status: 500,
				msg: 'Ese examen ya esta asignado al estudiante',
			});
		}

		student.examsAssignedId.push(examAssign._id);
		await StudentModel.findByIdAndUpdate(
			{
				_id: student._id,
			},
			student,
		);

		await examAssign.save();

		return res.json({
			status: 200,
			msg: 'Examen asignado',
		});
	} catch (error) {
		return error as AxiosError;
	}
};

export const getAllExamAssigned = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const estudianteExamenesAsignados =
			await StudentModel.aggregate([
				{
					$lookup: {
						from: 'examassigneds',
						localField: 'examsAssignedId',
						foreignField: '_id',
						pipeline: [
							{
								$lookup: {
									from: 'exams',
									localField: 'examId',
									foreignField: '_id',
									as: 'examen',
								},
							},
							{ $unwind: '$examen' },
						],
						as: 'examenesAsig',
					},
				},
				{ $unwind: '$examenesAsig' },
				{
					$match: {
						userId: new ObjectId(req.params.id),
					},
				},
			]);

		return res.json({
			status: 200,
			estudianteExamenesAsignados,
			//examenesAsignados,
			msg: 'Se obtuvieron todos los examenes asignados.',
		});
	} catch (error) {
		return error as AxiosError;
	}
};

export const getExamAssignedKey = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const key = req.params.key;
		const examAssigned = await ExamAssignedModel.findOne({
			clave: key,
		});
		if (!examAssigned) {
			return res.json({
				status: 404,
				msg: 'Clave invalida',
			});
		}
		if (examAssigned.status) {
			return res.json({
				status: 500,
				msg: 'Clave invalida',
			});
		}
		const studentId = new ObjectId(
			examAssigned.studentId,
		);
		const student = await StudentModel.findById({
			_id: studentId,
		}).select({
			name: 1,
			timeZone: 1,
		});

		const user = await UserModel.findById(
			examAssigned.userId,
		).select({
			name: 1,
			firstName: 1,
			email: 1,
		});

		const exam = await ExamModel.findById(
			examAssigned.examId,
		).select({
			name: 1,
			questions: 1,
		});

		const questionsArr: QuestionForStudentInterface[] =
			[];
		exam.questions.map((exam: any) => {
			let obj: QuestionForStudentInterface =
				{} as QuestionForStudentInterface;
			obj.question = exam.question;
			obj.points = exam.points;
			const answersArr: string[] = [];
			answersArr.push(exam.answerCorrect);
			exam.answersError.map((ans: string) =>
				answersArr.push(ans),
			);
			obj.answers = answersArr.sort(
				() => Math.random() - 0.5,
			);
			questionsArr.push(obj);
		});
		const forStudent: ResForStudentInterface = {
			_id: student._id,
			name: student.name,
			timeZone: student.timeZone,
			user: {
				email: user.email,
				firstName: user.firstName,
				nameUser: user.name,
			},
			exam: {
				nameExam: exam.name,
				clave: examAssigned.clave,
				dateAssigned: examAssigned.dateAssigned,
				dateLimit: examAssigned.dateLimit,
				idAssigned: examAssigned._id,
				questions: questionsArr.sort(
					() => Math.random() - 0.5,
				),
			},
		};
		return res.json({
			status: 200,
			msg: 'Key Valida',
			forStudent,
		});
	} catch (error) {
		return res.json({
			status: 500,
			msg: 'Error get key',
		});
	}
};

export const saveExamStudent = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const answeredExamStudent = req.body.exam;
		const idExamAssigned = new ObjectId(req.params.id);
		const examId = await ExamAssignedModel.findById({
			_id: idExamAssigned,
		}).select({
			examId: 1,
			studentId: 1,
		});

		const exam = await ExamModel.findById({
			_id: examId.examId,
		}).select({
			questions: 1,
			userId: 1,
		});
		let points: number = 0;
		exam.questions.forEach((qu: any) => {
			answeredExamStudent.forEach((an: any) => {
				if (qu.question === an.question) {
					if (qu.answerCorrect === an.answer) {
						points += qu.points;
					}
				}
			});
		});

		await ExamAssignedModel.findByIdAndUpdate(
			{ _id: idExamAssigned },
			{ status: true },
		);

		const examAnsweredData = {
			score: points,
			studentAnswers: answeredExamStudent,
			userId: exam.userId,
			studentId: examId.studentId,
			examId: examId.examId,
		};

		const examAnswered = await new ExamAnsweredModel(
			examAnsweredData,
		);
		examAnswered.save();

		const student = await StudentModel.findById({
			_id: examId.studentId,
		});
		student.examsAnsweredId.push(examAnswered._id);
		const studentIdsExamAssigned =
			student.examsAssignedId.filter(
				(idAssig: any) =>
					idAssig.toString() !==
					idExamAssigned.toString(),
			);
		student.examsAssignedId = studentIdsExamAssigned;

		await StudentModel.findByIdAndUpdate(
			{ _id: student._id },
			student,
		);

		return res.json({
			status: 200,
			msg: `Examen enviado, obtuviste ${points} puntos`,
		});
	} catch (error) {
		return res.json({
			status: 500,
			msg: 'Error guardar',
		});
	}
};
