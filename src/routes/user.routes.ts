import express from 'express';
import {
	getInfoGral,
	hasToken,
	login,
	newUser,
} from '@controller/user.controller';

const router = express.Router();

router.post('/new-user', newUser);
router.post('/login', login);
router.post('/count', getInfoGral);
router.post('/verify-token', hasToken);

export default router;
