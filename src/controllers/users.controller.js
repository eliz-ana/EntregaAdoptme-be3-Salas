import { usersService } from "../services/index.js"
import {err} from "../utils/httpError.js";
import logger from "../config/logger.js";

const getAllUsers = async(req,res)=>{
    logger.info('users:list', { requestId: req.id });
    const users = await usersService.getAll();
    res.json({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    logger.info('users:get', { requestId: req.id, userId });
    const user = await usersService.getUserById(userId);
    if(!user) throw err.notFound("User not found");
    res.json({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    logger.info('users:update requested', { requestId: req.id, userId });
    const user = await usersService.getUserById(userId);
    if(!user){
        logger.warn('users:update not found', { requestId: req.id, userId });
        throw err.notFound("User not found");
    } 
    const result = await usersService.update(userId,updateBody);
    logger.info('users:update ok', { requestId: req.id, userId });
    res.json({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    logger.info('users:delete requested', { requestId: req.id, userId });
    const user = await usersService.getUserById(userId);
    if(!user) {
        logger.warn('users:delete not found', { requestId: req.id, userId });
        throw err.notFound("User not found");
    }
    await usersService.delete(userId);
    logger.info('users:delete ok', { requestId: req.id, userId });
    res.json({status:"success",message:"User deleted"})
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}