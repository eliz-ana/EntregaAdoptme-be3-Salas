//config extra para railways
const baseUrl =
  process.env.BASE_URL || `http://localhost:${process.env.PORT || 8080}`;


export const info ={
    definition: {

        openapi: '3.0.0',
        info: {
            title: 'API de Gestión de Usuarios y Mascotas',
            version: '1.0.0',
            description: 'API REST'},
        servers: [
            {
                url: baseUrl
            }
        ],
        
   },
   apis : ["./src/docs/*.yaml" ]
}