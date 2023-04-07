import StudenModel from '@model/student.model';
import { AxiosResponse, AxiosError } from 'axios';

export const newStudent = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const existsStudent = await StudenModel.findOne({
			rfc: req.body.rfc,
			userId: req.body.userId,
		});
		if (existsStudent) {
			return res.json({
				status: 500,
				msg: 'El alumno ya esta registrado',
			});
		}

		const student = new StudenModel(req.body);
		await student.save();
		return res.json({
			msg: `${student.name} fue registrado/a`,
		});
	} catch (error) {
		return error as AxiosError;
	}
};
