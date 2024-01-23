const swaggerAutogen = require('swagger-autogen')()
const fs= require('fs')
const outputFile = './swagger_output.json'

// change your route folder here to auto generate api docs.
const routeFolder = "./Server.js";
// const endpointsFiles = fs.readdirSync(routeFolder, { withFileTypes: true })
// .filter(item => !item.isDirectory())
// .map(item => routeFolder+"/"+item.name)

console.log("Generating docs from above files..", routeFolder)
swaggerAutogen(outputFile, [routeFolder])