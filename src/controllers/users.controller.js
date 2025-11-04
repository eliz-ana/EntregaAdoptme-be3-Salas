import { usersService } from "../services/index.js"
import {err} from "../utils/httpError.js";

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.json({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) throw err.notFound("User not found");
    res.json({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) throw err.notFound("User not found");
    const result = await usersService.update(userId,updateBody);
    res.json({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) throw err.notFound("User not found");
    await usersService.delete(userId);
    res.json({status:"success",message:"User deleted"})
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}