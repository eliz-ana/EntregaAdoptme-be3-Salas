
import mongoose from "mongoose";
import GenericRepository from "./GenericRepository.js";
import {err} from "../utils/httpError.js";

export default class UserRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    
    getUserByEmail = (email) =>{
        return this.getBy({email});
    }
    getUserById = (id) =>{
        if (!mongoose.isValidObjectId(id))throw err.badRequest('Invalid id');
        return this.getBy({_id:id})
    }
    
}