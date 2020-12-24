//Para evitar usar un callback usamos una promesa

/* Explicacion
Cuando utilice body parser va a llegar la info la cual puede contener datos o no,en caso de contener datos se almacenan para despues ser convertidos a JSON y se almacenan en una propiedad body y asi podran acceder a lo que mando el cliente
*/

function bodyParser(request) {
  return new Promise((res, rej) => {
    let totalData = "";
    request
      //almacenamiento de datos recibidos
      .on("data", (chunk) => {
        totalData += chunk;
      })
      //Conversion de datos recibidos a JSON
      .on("end", () => {
        request.body = JSON.parse(totalData);
        res();
      })
      //Mensaje en caso de ERROR
      .on("error", (err) => {
        console.log(err);
        rej();
      });
  });
}

module.exports = { bodyParser };
