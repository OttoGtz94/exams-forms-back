import mongoose from 'mongoose';

export interface UserInterface {
	_id: mongoose.Schema.Types.ObjectId;
	name: string;
	firstName: string;
	email: string;
	password: string;
	date: Date;
	studentsId: any[];
}
