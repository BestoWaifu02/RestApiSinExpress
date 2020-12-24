const http = require("http");
// Se importa la funcion del objeto exportado
const { bodyParser } = require("./lib/bodyparser");
let database = [];

//Manejador de peticiones mientras usan el metodo GET
function getTaskHandler(req, res) {
  //Cabeceras
  res.writeHead(200, { "Content-Type": "application/json" });
  //Respuesta, se manda un let que simula ser la base de datos
  res.write(JSON.stringify(database));
  res.end();
}

//Manejador de peticiones mientras usan el metodo POST
async function createTaskHandler(req, res) {
  try {
    await bodyParser(req);
    //Agregamod el dato enviado a la BD
    database.push(req.body);
    console.log(req.body);
    //Cabeceras
    res.writeHead(200, { "Content-Type": "application/json" });
    //Respuesta del servidor manda un msj de que se recibio la solicitud
    res.write(JSON.stringify(database));
    res.end();
  } catch (error) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Datos Invalidos");
    res.end();
  }
}

//Manejador de peticiones mientras usan el metodo PUT
async function updateTaskHandler(req, res) {
  try {
    //Recibimos la url mandada en el req para separarle el ID
    let { url } = req;
    console.log(url);
    //Dividimos el url con split y guardamos el indice 1
    let idQuery = url.split("?")[1]; //esto se guarda (id=1)
    let idKey = idQuery.split("=")[0]; //esto se guarda (id)
    let idValue = idQuery.split("=")[1]; //esto se guarda (1)

    if (idKey === "id") {
      await bodyParser(req);
      //asginando la posicion a actualizar
      database[idValue - 1] = req.body;

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(database));
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("invalid request Query");
      res.end();
    }
  } catch (error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("invalid Body Data was provided", error.message);
    res.end();
  }
}

//Manejador de peticiones mientras usan el metodo DELETE
async function deleteTaskHandler(req, res) {
  const { url } = req;
  let idQuery = url.split("?")[1]; //esto se guarda (id=1)
  let idKey = idQuery.split("=")[0]; //esto se guarda (id)
  let idValue = idQuery.split("=")[1]; //esto se guarda (1)

  if (idKey === "id") {
    //Asignamos el indice a eliminar segun el id Value
    database.splice(idValue - 1, 1);

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("DELETE Successfully");
    res.end();
  } else {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.write("Invalid Query");
    res.end();
  }
}
//Manejador de peticiones (req lo que oude el usuario y res lo que le respondo)
// al final retorna el objeto server
const server = http.createServer((req, res) => {
  //Extraccion de la url y el metodo
  const { url, method } = req;

  //loger (registro de lo que va llegando)
  console.log(`URL: ${url} - method ${method}`);

  switch (method) {
    case "GET":
      if (url === "/") {
        //Cabeceras
        res.writeHead(200, { "Content-Type": "application/json" });
        //Respuesta, se manda un objeto JSON convertido en string
        res.write(JSON.stringify({ message: "Hello World!!!" }));
        res.end();
      }
      if (url === "/tasks") {
        //Llamamos la funcion de GET
        getTaskHandler(req, res);
      }
      break;
    case "POST":
      if (url === "/tasks") {
        createTaskHandler(req, res);
      }
      break;
    case "PUT":
      updateTaskHandler(req, res);
      break;
    case "DELETE":
      deleteTaskHandler(req, res);
      break;
    default:
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.write("404 NOT FOUND");
      res.end();
  }
});

//El objeto server recibe como parametro el puerto
server.listen(process.env.PORT || 3000);
console.log("server on port ");
