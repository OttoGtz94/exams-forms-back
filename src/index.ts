import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from '@routes/user.routes';
import examRoutes from '@routes/exam.routes';
import studentRoutes from '@routes/student.routes';
import cors from 'cors';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3500;
//habilitar cors
const whiteList = [
	'https://test-forms-ottogtz.netlify.app/',
];
const corsOptions = {
	origin: function (origin: any, callback: any) {
		if (whiteList.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Error de cors'));
		}
	},
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/user', userRoutes);
app.use('/exam', examRoutes);
app.use('/student', studentRoutes);

connectDB();

app.listen(PORT, () =>
	console.log('Servidor corriendo en el puerto:', PORT),
);
