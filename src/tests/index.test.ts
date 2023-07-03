import request from 'supertest';

const data = {
  username: 'Test User 100',
  age: 90,
  hobbies: ['swimming'],
};

const updatedData = {
  username: 'Test 1',
  age: 90,
  hobbies: ['swimming'],
};

const testUuid = '9b5e8f7a-530b-4406-8e1d-6fb35e3f6004';

describe('testing crud-api (1st scenario)', () => {
  let id: string;

  test('first response should be empty array', async () => {
    const response = await request('http://localhost:8080').get('/api/users');
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.text)).toEqual({ data: [] });
  });
  test('should create new user', async () => {
    const response = await request('http://localhost:8080')
      .post('/api/users')
      .send(data);
    expect(response.statusCode).toEqual(201);
    id = JSON.parse(response.text).data.id;
  });
  test('should update user by id', async () => {
    const response = await request('http://localhost:8080')
      .put(`/api/users/${id}`)
      .send(updatedData);
    expect(response.statusCode).toEqual(200);
  });
  test('should delete user by id', async () => {
    const response = await request('http://localhost:8080').delete(
      `/api/users/${id}`
    );
    expect(response.statusCode).toEqual(204);
  });
  test('unable to get user by id', async () => {
    const response = await request('http://localhost:8080').get(
      `/api/users/${id}`
    );
    expect(response.statusCode).toEqual(404);
  });
});

describe('testing crud-api (2nd scenario)', () => {
  let id: string;

  test('if wrong url, 404 not found should respond', async () => {
    const response = await request('http://localhost:8080').get('/users');
    expect(response.statusCode).toEqual(404);
  });

  test('if wrong id format uuid error should be responded', async () => {
    const response = await request('http://localhost:8080').get(
      '/api/users/sdfgsdf'
    );
    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response.text)).toEqual(
      'Provided id is not a valid uuid'
    );
  });

  test('if wrong id userNot Found should be responded', async () => {
    const response = await request('http://localhost:8080').get(
      `/api/users/${testUuid}`
    );
    expect(response.statusCode).toEqual(404);
    expect(JSON.parse(response.text)).toEqual('User is not found');
  });

  test('should create new user', async () => {
    const response = await request('http://localhost:8080')
      .post('/api/users')
      .send(data);
    expect(response.statusCode).toEqual(201);
    id = JSON.parse(response.text).data.id;
  });

  test('should find user by id', async () => {
    const response = await request('http://localhost:8080').get(
      `/api/users/${id}`
    );
    const { age } = JSON.parse(response.text).data;
    expect(response.statusCode).toEqual(200);
    expect(age).toEqual(90);
  });
  test('should delete user by id', async () => {
    const response = await request('http://localhost:8080').delete(
      `/api/users/${id}`
    );
    expect(response.statusCode).toEqual(204);
  });
  test('no users should be in db', async () => {
    const response = await request('http://localhost:8080').get('/api/users');
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.text)).toEqual({ data: [] });
  });
});

describe('testing crud-api (3d scenario)', () => {
  test('Create 3 users', async () => {
    await Promise.all(
      [...Array(3).keys()].map(async () => {
        return await request('http://localhost:8080')
          .post('/api/users')
          .send(data);
      })
    );
  });
  test('3 users should be created', async () => {
    const response = await request('http://localhost:8080').get('/api/users');
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.text).data.length).toEqual(3);
  });
  test('delete user by id', async () => {
    const response = await request('http://localhost:8080').get('/api/users');
    const userId = JSON.parse(response.text).data[0].id;
    const delResponse = await request('http://localhost:8080').delete(
      `/api/users/${userId}`
    );
    expect(delResponse.statusCode).toEqual(204);
  });
  test('2 users should be in db', async () => {
    const response = await request('http://localhost:8080').get('/api/users');
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.text).data.length).toEqual(2);
  });
});
