import express from 'express';
import { Login, SignUp, Protect, Logout } from '../controllers/authController';
import { getUser } from '../controllers/userController';


const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', Login);
router.post("/logout", Protect,Logout);
router.get('/users/:id', Protect, getUser);




export default router;
