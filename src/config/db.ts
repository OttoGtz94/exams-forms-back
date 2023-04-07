import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_DEV || '');
		console.log('Conexión exitosa');
	} catch (error) {
		console.log(error);
	}
};

export default connectDB;
