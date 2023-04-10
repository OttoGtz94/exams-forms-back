import { QuestionForStudentInterface } from './exam.interface';
export interface ResForStudentInterface {
	_id: string;
	name: string;
	timeZone: string;
	user: {
		email: string;
		firstName: string;
		nameUser: string;
	};
	exam: {
		nameExam: string;
		clave: string;
		dateAssigned: string;
		dateLimit: string;
		idAssigned: string;
		questions: QuestionForStudentInterface[];
	};
}
