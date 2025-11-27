
import mongoose from "mongoose";
import GenericRepository from "./GenericRepository.js";
import {err} from "../utils/httpError.js";
import UserDTO from "../dto/User.dto.js";

export default class UserRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    
    getAll = async (params) => {
        const users = await this.dao.get(params);
        return users.map(u => UserDTO.getUserTokenFrom(u));
    }

    getUserByEmail = async (email) =>{

        const user = await this.getBy({email});
        return user ? UserDTO.getUserTokenFrom(user) : null;
    }
    getUserById = async (id) => {
    if (!mongoose.isValidObjectId(id)) throw err.badRequest('Invalid id');
    const user = await this.getBy({ _id: id });
    return user ? UserDTO.getUserTokenFrom(user) : null;
  }

}