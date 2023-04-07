import { AxiosResponse, AxiosError } from 'axios';
import ExamModel from '@model/exam.model';

export const newExam = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const exam = new ExamModel(req.body);
		await exam.save();

		return res.json({
			status: 200,
			msg: 'Examen creado',
		});
	} catch (error) {
		return error as AxiosError;
	}
};
