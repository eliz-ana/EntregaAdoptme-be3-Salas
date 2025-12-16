
import supertest from 'supertest';
import { expect } from 'chai';


const requester = supertest('http://localhost:8080');

async function createTestUser() {
  const unique = Date.now();

  const newUser = {
    first_name: 'Test',
    last_name: 'User',
    email: `test${unique}@mail.com`,
    password: 'coder123'
  };

  const res = await requester.post('/api/sessions/register').send(newUser);

  expect(res.status).to.equal(201);
  expect(res.body).to.have.property('payload');

 const id = res.body.payload;
 expect(id).to.exist;

  return { id, newUser };
}





describe('Users API - endpoints públicos', () => {
  // debe responder 200 y un array
  it('GET /api/users debe responder 200 y un array', async () => {
    const res = await requester.get('/api/users');

    expect(res.status).to.equal(200);

    // el body es un objeto con status y payload
    expect(res.body).to.have.property('status');
    expect(res.body).to.have.property('payload');

    // acá sí validamos que el payload sea un array
    expect(res.body.payload).to.be.an('array');

    
  });

});

describe('GET /api/users/:pid', () => {

    it('debe devolver 400 si el id tiene formato inválido', async () => {
      
      const res = await requester.get('/api/users/123');

      expect(res.status).to.equal(400); 
    });

    it('debe devolver 404 si el id tiene formato válido pero no existe', async () => {
    
      const fakeId = 'ffffffffffffffffffffffff';

      const res = await requester.get(`/api/users/${fakeId}`);

      expect(res.status).to.equal(404); 
     
    });
  });

describe('PUT /api/users/:uid (update)', () => {
  it('debe devolver 200 si actualiza correctamente', async () => {
    const { id } = await createTestUser();

    const res = await requester
      .put(`/api/users/${id}`)
      .send({ first_name: 'UpdatedName' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('message', 'User updated');
  });
});

describe('DELETE /api/users/:uid (delete)', () => {
  it('debe devolver 200 si elimina correctamente', async () => {
    const { id } = await createTestUser();

    const res = await requester.delete(`/api/users/${id}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('message', 'User deleted');

    const check = await requester.get(`/api/users/${id}`);
    expect(check.status).to.equal(404);
  });
});
