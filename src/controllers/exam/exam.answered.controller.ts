import { AxiosResponse, AxiosError } from 'axios';
import StudenModel from '@model/student.model';
import { ObjectId } from 'mongodb';
import ExamAnsweredModel from '@model/exam.answered.model';

export const getExamsAnswereds = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const idUser = new ObjectId(req.params.id);
		const studentExamAnswered =
			await StudenModel.aggregate([
				{
					$lookup: {
						from: 'examanswereds',
						localField: 'examsAnsweredId',
						foreignField: '_id',
						pipeline: [
							{
								$lookup: {
									from: 'exams',
									localField: 'examId',
									foreignField: '_id',
									pipeline: [
										{
											$project: {
												name: 1,
												questions: 1,
											},
										},
									],
									as: 'exam',
								},
							},
							{
								$project: {
									score: 1,
									reviewed: 1,
									date: 1,
									studentAnswers: 1,
									exam: 1,
								},
							},
							{ $unwind: '$exam' },
						],
						as: 'examAnswereds',
					},
				},
				{ $unwind: '$examAnswereds' },
				{
					$match: {
						userId: idUser,
					},
				},
				{
					$project: {
						name: 1,
						age: 1,
						timeZone: 1,
						examAnswereds: 1,
					},
				},
			]);

		return res.json({
			status: 200,
			studentExamAnswered,
			msg: 'Examen Obtenido',
		});
	} catch (error) {
		return res.json({
			status: 500,
			msg: 'Error get exams answereds',
		});
	}
};

export const markExam = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const id = new ObjectId(req.body.id);
		await ExamAnsweredModel.findByIdAndUpdate(
			{ _id: id },
			{ reviewed: true },
		);
		return res.json({
			status: 200,
			msg: 'Examen calificado',
		});
	} catch (error) {
		return res.json({
			status: 500,
			msg: 'Error al calificar',
		});
	}
};
