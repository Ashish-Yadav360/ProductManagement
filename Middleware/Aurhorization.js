
const authorization = ([...allowedroles])=>{
   return (req,res,next)=>{
       console.log(req.user);
      if(!allowedroles.includes(req.user.role)){
        return res.status(401).json({"err":'Insufficeint privalage'});
      }
      next();
   }
}

export default authorization;