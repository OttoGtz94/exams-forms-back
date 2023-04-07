import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema } = mongoose;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	firstName: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	date: {
		type: Date,
		default: new Date(),
	},
	studentsId: [Schema.Types.ObjectId],
});

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.checkPassword = async function (
	password: string,
) {
	return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User ||
	mongoose.model('Users', UserSchema);
