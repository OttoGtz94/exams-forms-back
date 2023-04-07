import { UserInterface } from '@interfaces/user.interface';
import jwt from 'jsonwebtoken';

export const generateJWT = (user: UserInterface) => {
	const JWT = process.env.JWT || '';
	return jwt.sign(
		{
			id: user._id,
			name: user.name,
			firstName: user.firstName,
			email: user.email,
			studentsId: user.studentsId,
		},
		JWT,
		{
			expiresIn: '30d',
		},
	);
};

export const generateKey = (): string => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let chars = '';

	for (let i = 0; i < 4; i++) {
		chars += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}

	const num = (Math.random() * 1000)
		.toString()
		.split('.')[1]
		.slice(0, 3);

	const mes = new Date().getMonth();
	const hora = new Date().getHours();
	const minutes = new Date().getMinutes();
	const key = `${chars}-${num}-${mes}${hora}${minutes}`;
	return key;
};
