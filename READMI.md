#Server Nodejs Socketio + Client React Mapbox
### Instalación


	instalar node

[Instalar node](https://nodejs.org/es/ "Instalar node")

Primero que nada tener en cuenta que en una carpeta se encuentra el cliente y en otra el server

- mapas-socket-server **Carpeta con el servidor nodejs socketio**
- mapas-app **Carpeta del cliente con react y mapbox **

instalar nodemon

	npm i -g nodemon

###Instalación server
Instalar dependencias

	npm install

Ejecutar servidor con nodemon

	npm run x

Ejecutar server modo producción

	npm start

El servidor estara escuchando en el puerto `8080`

En el archivo **.env** se podra modificar el puerto

	PORT=8080

###Instalación cliente
instalar dependencias

	npm install

Configurar token de mapbox en la ruta `/mapas-app/src/hooks/useMapbox.js` linea 5

	mapboxgl.accessToken = 'TokenMapbox';

Ejecutar cliente react

	npm start

Crear build React

	npm run build

Espero funcione todo a la perfección