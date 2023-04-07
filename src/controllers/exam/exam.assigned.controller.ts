import ExamAssignedModel from '@model/exam.assigned.model';
import { AxiosResponse, AxiosError } from 'axios';
import StudentModel from '@model/student.model';
import ExamModel from '@model/exam.model';
import { ObjectId } from 'mongodb';

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
				{
					$match: {
						userId: new ObjectId(req.body.userId),
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
