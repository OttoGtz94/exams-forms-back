import { AxiosResponse, AxiosError } from 'axios';
import ExamModel from '@model/exam.model';
import { ObjectId } from 'mongodb';

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

export const getExams = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const _id = new ObjectId(req.params.id);
		const exams = await ExamModel.find({
			userId: _id,
		});
		return res.json({
			status: 200,
			exams,
			msg: 'Examenes obtenidos satisfactoriamente.',
		});
	} catch (error) {
		return res.json({
			status: 500,
			msg: 'Error Get Exams',
		});
	}
};

export const editExam = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const id = new ObjectId(req.params.id);
		await ExamModel.findByIdAndUpdate(id, req.body);
		return res.json({
			status: 200,
			msg: 'Examen editado.',
		});
	} catch (error) {
		return res.json({
			status: 500,
			msg: 'Error edit exam',
		});
	}
};
