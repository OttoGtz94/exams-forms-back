import { generateJWT } from '@helpers/index';
import UserModel from '@model/user.model';
import { AxiosResponse, AxiosError } from 'axios';
import ExamModel from '@model/exam.model';
import { ObjectId } from 'mongodb';
import StudenModel from '@model/student.model';
import ExamAssignedModel from '@model/exam.assigned.model';
import examAnsweredModel from '@model/exam.answered.model';
import jwt from 'jsonwebtoken';

export const newUser = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const existsEmail = await UserModel.findOne({
			email: req.body.email,
		});
		if (existsEmail) {
			return res.json({
				status: 500,
				msg: 'El correo electronico ya existe',
			});
		}

		const user = new UserModel(req.body);
		await user.save();
		return res.json({
			status: 200,
			msg: `${user.name} fue registrado/a`,
		});
	} catch (error) {
		return error as AxiosError;
	}
};

export const login = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	const { email, password } = req.body;
	try {
		const existsEmail: any = await UserModel.findOne({
			email: email,
		});
		if (!existsEmail) {
			return res.json({
				status: 404,
				msg: 'Usuario y/o contraseña incorrectos',
			});
		}

		const successLogin = await existsEmail.checkPassword(
			password,
		);
		if (!successLogin) {
			return res.json({
				status: 400,
				msg: 'Usuario y/o contraseña incorrectos',
			});
		}

		return res.json({
			status: 200,
			msg: 'Usuario autenticado',
			token: generateJWT(existsEmail),
		});
	} catch (error) {
		return res.json({
			status: 500,
			msg: 'Hubo un error',
		}) as AxiosError;
	}
};

export const getInfoGral = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	try {
		const userId = new ObjectId(req.body._id);
		const countExams = await ExamModel.count({
			userId: new ObjectId(userId),
		});

		const countStudents = await StudenModel.count({
			userId: new ObjectId(userId),
		});

		const countExamsAssigned =
			await ExamAssignedModel.count({
				userId: new ObjectId(userId),
			});

		const countExamsAnswered =
			await examAnsweredModel.count({
				userId: new ObjectId(userId),
			});

		return res.json({
			status: 200,
			info: {
				countExams,
				countExamsAssigned,
				countStudents,
				countExamsAnswered,
			},
		});
	} catch (error) {
		return error as AxiosError;
	}
};

export const hasToken = async (
	req: any,
	res: any,
): Promise<AxiosResponse | AxiosError> => {
	const { token } = req.body;
	const dataJWT = jwt.decode(token);
	if (dataJWT !== null) {
		const userInfo = {
			email: 'genesis@mail.com',
			exp: 1683435133,
			firstName: 'Rivadeneira',
			iat: 1680843133,
			id: '642e7b42f9395cf8fd8ec6a2',
			name: 'Genesis',
		};
		return res.json({
			status: 200,
			userInfo,
			msg: 'Autenticación Correcta',
		});
	} else {
		return res.json({
			status: 400,
			msg: 'No existe el token',
		});
	}
};
