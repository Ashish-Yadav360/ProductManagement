import express from 'express'
import connectMongoDb from './DB/Connection.js';
import dotenv from 'dotenv'
import userRoute from './Routes/user.route.js'
import adminRoute from './Routes/admin.route.js'
const app = express();
dotenv.config();
app.use(express.json());
app.use('/api/user',userRoute);
app.use('/api/admin',adminRoute);
app.listen(5000,()=>{
    connectMongoDb();
  console.log('Server is listening at port 5000');
})