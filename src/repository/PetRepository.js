import GenericRepository from "./GenericRepository.js";
import PetDTO from "../dto/Pet.dto.js";

export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

      getAll = async (params) => {
    const pets = await this.dao.get(params);
    return pets.map(p => PetDTO.getPetInputFrom(p));
   }

   getById = async (id) => {
    const pet = await this.getBy({ _id: id });
    return pet ? PetDTO.getPetInputFrom(pet) : null;
  }

}