
import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');


const USER_CREDENTIALS = {
  email: 'jayson.pollich34@gmail.com',     // user común
  password: 'coder123',                
};

const ADMIN_CREDENTIALS = {
  email: 'jennie_spencer@hotmail.com',   // admin
  password: 'coder123',
};

function getCookieFrom(res) {
  const rawCookie = res.headers['set-cookie']?.[0];
  // devolvemos sólo "coderCookie=xxxxx"
  return rawCookie?.split(';')[0];
}

describe('Adoptions API', () => {
  let userCookie;
  let adminCookie;
  let adoptablePetId; 

  // 🔧 Antes de todos los tests: loguear user, admin 
  before(async () => {
    // login user
    const userLoginRes = await requester
      .post('/api/sessions/login')
      .send(USER_CREDENTIALS);

    userCookie = getCookieFrom(userLoginRes);

    // login admin
    const adminLoginRes = await requester
      .post('/api/sessions/login')
      .send(ADMIN_CREDENTIALS);

    adminCookie = getCookieFrom(adminLoginRes);

    // crear pet

    const newPetData = {
      name: 'Pet para adopción',
      specie: 'dog',
      birthDate: '2020-01-01',
      image: '',
      adopted: false,
      
    };

    const createPetRes = await requester
      .post('/api/pets')
      .send(newPetData);

    const createdPet = createPetRes.body.payload;
    adoptablePetId = createdPet.petId  || createdPet.id || createdPet._id;

    

    if (!adoptablePetId) {
      console.log('Pet creada para test:', createdPet);
      throw new Error('No pude obtener el id de la pet creada para el test');
    }

   
  });

 
  it('debe devolver 401 si intenta adoptar sin estar logueado', async () => {
    const res = await requester.post(`/api/adoptions/${adoptablePetId}`);

    expect(res.status).to.equal(401);
  });

 
  it('debe devolver 403 si un admin intenta adoptar', async () => {
    const res = await requester
      .post(`/api/adoptions/${adoptablePetId}`)
      .set('Cookie', adminCookie);

    expect(res.status).to.equal(403);
  });


  it('debe crear una adopción (201) cuando un user adopta una pet disponible', async () => {
    const res = await requester
      .post(`/api/adoptions/${adoptablePetId}`)
      .set('Cookie', userCookie);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.be.an('object');
    expect(res.body.payload).to.have.property('owner');
    expect(res.body.payload).to.have.property('pet');
  });


  it('debe devolver 400 si la pet ya está adoptada', async () => {
    const res = await requester
      .post(`/api/adoptions/${adoptablePetId}`)
      .set('Cookie', userCookie);

    expect(res.status).to.equal(400); // "Pet is already adopted"
  });
});
