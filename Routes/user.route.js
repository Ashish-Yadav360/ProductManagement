import express from 'express'
import { userSignup,userLogin,productUser,addOrder } from '../Controllers/user.controller.js';
import auth from '../Middleware/Auth.js';
import authorization from '../Middleware/Aurhorization.js';
const route = express.Router();

route.post('/signup',userSignup);
route.post('/login',userLogin);
route.get('/products/aggregate/:userId',auth,authorization(['user']),productUser);
route.post('/createOrder',auth,authorization(['user']),addOrder);

export default route;