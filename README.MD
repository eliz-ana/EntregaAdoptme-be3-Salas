

# 🐾 Proyecto: Adoptme — Backend 3 · CoderHouse
💡 Descripción

Proyecto base provisto por Coderhouse para curso Backend 3.
El objetivo de esta entrega es implementar un router de mocks, módulos de generación de datos falsos y endpoints para generar e insertar datos de prueba en la base de datos MongoDB.

## Tech Stack
Node.js + Express
MongoDB + Mongoose
Faker.js
Bcrypt
Dotenv
Nodemon
Swagger (openAPI)
Mocha+Chai+Supertest
Docker (Dockerfile + Docker Hub image)

#### Arquitectura en capas: Controllers → Services → Repository → DAO → DB

### 📂 Estructura del proyecto (resumen)
```src/
 ├── app.js
 ├── server.js
 ├── config/
 ├── controllers/
 ├── dao/
 ├── dto/
 ├── middlewares/
 │    └── errorHandler.js
 ├── mocks/
 │    ├── users.mock.js
 │    └── pets.mock.js
 ├── repository/
 ├── routes/
 │    ├── mocks.router.js
 │    ├── users.router.js
 │    ├── pets.router.js
 │    └── ...
 ├── services/
 └── utils/
      ├── httpError.js
      └── catchAsync.js```

### Environment Variables

`PORT=8080`
`MONGO_URI=mongodb://localhost:27017/adoptme`
`NODE_ENV=development`

### 🚀 Instalación y ejecución

Instalar dependencias
```bash
npm install
```

Ejecutar el servidor en modo desarrollo

```bash
npm run dev
```

###  🧰 Rutas del módulo de mocks
_Generar pets falsos (sin insertar)

GET /api/mocks/mockingpets?count=5

2️⃣ Generar usuarios falsos (sin insertar)

GET /api/mocks/mockingusers?count=50

3️⃣ Insertar usuarios y mascotas en la base de datos


POST /api/mocks/generateData
Body JSON:
{
  "users": 10,
  "pets": 5
}


###  Documentacion Swagger (OpenAPI)

Con el servidor corriendo:

http://localhost:8080/api/docs


Desde Swagger podés:

Probar los endpoints

Ver modelos de request/response

Enviar datos al servidor desde la interfaz


##  Docker Support
Este proyecto incluye Dockerfile + imagen publicada en Docker Hub.

## Imagen Docker en Docker Hub

La imagen del proyecto está publicada en:

👉 https://hub.docker.com/r/ana840512/adoptme-app-coderhouse

## Descargar la imagen
docker pull ana840512/adoptme-app-coderhouse:latest

## Ejecutar el contenedor

Requiere un archivo .env.docker (incluido en el repo):

docker run -d ^
  --name adoptme-container ^
  --env-file .env.docker ^
  -p 8080:8080 ^
  ana840512/adoptme-app-coderhouse:latest


## Running Tests

To run tests, run the following command

```bash
  npm run test
```
