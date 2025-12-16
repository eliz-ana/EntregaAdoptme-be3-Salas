import { expect } from 'chai';
import supertest from 'supertest';



const requester = supertest('http://localhost:8080');

describe('Pets API - endpoints públicos', () => {
  // debe responder 200 y un array
  it('GET /api/pets debe responder 200 y un array', async () => {
    const res = await requester.get('/api/pets');

    expect(res.status).to.equal(200);

    // el body es un objeto con status y payload
    expect(res.body).to.have.property('status');
    expect(res.body).to.have.property('payload');

    // acá sí validamos que el payload sea un array
    expect(res.body.payload).to.be.an('array');

    
  });

});

describe('GET /api/pets/:pid', () => {

    it('debe devolver 400 si el id tiene formato inválido', async () => {
      
      const res = await requester.get('/api/pets/123');

      expect(res.status).to.equal(400); 
    });

    it('debe devolver 404 si el id tiene formato válido pero no existe', async () => {
    
      const fakeId = 'ffffffffffffffffffffffff';

      const res = await requester.get(`/api/pets/${fakeId}`);

      expect(res.status).to.equal(404); 
     
    });
  });

 describe('POST /api/pets', () => {

    it('debe devolver 201 al crear una nueva mascota', async () => {
      const newPet = {
      name: 'TestingPet',
      specie: 'dog',
      birthDate: '2020-01-01',
      adopted: false
    };

    const res = await requester.post('/api/pets').send(newPet);

    // 1. status esperado
    expect(res.status).to.equal(201);

    // 2. estructura esperada
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.be.an('object');

    // 3. contenido mínimo
    expect(res.body.payload).to.have.property('_id');
    expect(res.body.payload).to.have.property('name').equal('TestingPet');
    expect(res.body.payload).to.have.property('specie').equal('dog');
    expect(res.body.payload).to.have.property('birthDate');
  
    });

  it('debe devolver 400 cuando faltan campos obligatorios', async () => {
    const incompletePet = {
      // falta name
      specie: 'cat'
    };

    const res = await requester.post('/api/pets').send(incompletePet);

    expect(res.status).to.equal(400);
  });
    
  });
