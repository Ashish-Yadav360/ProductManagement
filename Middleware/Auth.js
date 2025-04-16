import jwt from 'jsonwebtoken'

const auth = (req,res,next)=>{
        try {
        const token = req.header('Authorization')?.split(' ')[1];
        if(!token){
            res.status(401).json({error:'Authentication Failed'});
        }
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err) return res.status(500).json({error:err});
            req.user=user;
            next();
        })
            
        } catch (error) {
            console.log(error);
    }
}

export default auth;
