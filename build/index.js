"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const exam_routes_1 = __importDefault(require("./routes/exam.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT || 3500;
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Error de cors'));
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/user', user_routes_1.default);
app.use('/exam', exam_routes_1.default);
app.use('/student', student_routes_1.default);
(0, db_1.default)();
app.listen(PORT, () => console.log('Servidor corriendo en el puerto:', PORT));
