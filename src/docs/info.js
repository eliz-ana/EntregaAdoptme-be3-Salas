

export const info ={
    definition: {

        openapi: '3.0.0',
        info: {
            title: 'API de Gestión de Usuarios y Mascotas',
            version: '1.0.0',
            description: 'API REST'},
        servers: [
            {
                url: 'http://localhost:8080',
            }
        ],
        
   },
   apis : ["./src/docs/*.yaml" ]
}