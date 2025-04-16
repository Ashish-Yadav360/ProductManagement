import express from 'express'
import auth from '../Middleware/Auth.js';
import authorization from '../Middleware/Aurhorization.js';
import { adminLogin,addProduct,addWarehouse,manageOrder,getLowStockNotifications,getUserList,updateUserStatus } from '../Controllers/admin.controller.js';
const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', auth, authorization(['admin']),getUserList);
router.patch('/user/:id/status', auth, authorization(['admin']), updateUserStatus);
router.post('/warehouse', auth, authorization(['admin']), addWarehouse);
router.post('/product', auth, authorization(['admin']), addProduct);
router.patch('/order/:id', auth, authorization(['admin']), manageOrder);
router.get('/notifications', auth, authorization(['admin']), getLowStockNotifications);

export default router;