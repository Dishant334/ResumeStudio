import jwt from 'jsonwebtoken'

const protect=(req,res,next)=>{
  try{
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')){
      return res.status(401).json({message:"Authentication failed(does not contain authorization or Bearer"})
    }
    const token=req.headers.authorization.split(' ')[1]
    const secret_key=process.env.JWT_SECRET
    const decoded=jwt.verify(token,secret_key)
    if(!decoded) return res.status(401).json({message:"Token is not correct"})
    req.userId=decoded.userId
    next()
  }catch(err){
    return res.status(401).json({message:"Authentication failed"})
  }
}
export default protect