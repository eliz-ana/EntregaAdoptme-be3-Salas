import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import {err} from "../utils/httpError.js";
import logger from "../config/logger.js";



const getAllPets = async(req,res)=>{
    logger.info('pets:list', { requestId: req.id });
    const pets = await petsService.getAll();
    res.send({status:"success",payload:pets})
}

const createPet = async(req,res)=> {
    const {name,specie,birthDate} = req.body;
    logger.info('pets:create requested', { requestId: req.id, name, specie });
    if(!name||!specie||!birthDate) throw err.badRequest('Incomplete values');
    const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
    const result = await petsService.create(pet);
    logger.info('pets:create ok', { requestId: req.id, name, specie });
    res.status(201).send({status:"success",payload:result})
}

const updatePet = async(req,res) =>{
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    const updated = await petsService.update(petId,petUpdateBody);
    logger.info('pets:update', { requestId: req.id, petId });
    if(!updated){
        logger.warn('pets:update not found', { requestId: req.id, petId });
        throw err.notFound('Pet not found');
    }
    res.status(200).send({status:"success",message:"pet updated"})
}

const deletePet = async(req,res)=> {
    const petId = req.params.pid;
    logger.info('pets:delete requested', { requestId: req.id, petId });
    const deleted = await petsService.delete(petId);
    if(!deleted) throw err.notFound('Pet not found');
    logger.info('pets:delete ok', { requestId: req.id, petId });
    res.json({status:"success",message:"pet deleted"});
}

const createPetWithImage = async(req,res) =>{
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) throw err.badRequest('Incomplete values');
    
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image:`${__dirname}/../public/img/${file.filename}`
    });
 
    const result = await petsService.create(pet);
    res.status(201).json({status:"success",payload:result})
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}