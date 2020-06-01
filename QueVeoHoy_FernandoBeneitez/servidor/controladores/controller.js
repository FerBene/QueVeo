let con = require('../lib/conexionbd');

buscarPelis = (req,res) => {

  let filtros=[];

  let anio = req.query.anio;
  if (anio) {
    let queryVarcharAnio = "anio = "+anio; 
    filtros.push(queryVarcharAnio);
  }

  let titulo = req.query.titulo;
  if (titulo) {
    let queryVarcharTitulo = "titulo like '%" +titulo+ "%'"; 
    filtros.push(queryVarcharTitulo);
  }
  
  let genero = req.query.genero;
  if (genero) {
    let queryVarcharGenero = "genero_id = "+genero; 
    filtros.push(queryVarcharGenero);
  }
  
  let sql = 'from pelicula where 1=1';
  for(let i=0; i<filtros.length; i++ ) {
    sql += ' and '+filtros[i];
  }
  
  let sql1 = sql+ ' order by '+req.query.columna_orden;
  let inicialPagI = 52*(req.query.pagina-1);
  sql1 = sql1+ ' limit '+inicialPagI+','+req.query.cantidad;
  sql1 = 'select * '+sql1;

  let totalResults = 0;
  let sqlQuant = 'select count(id) as total ' +sql; 

  con.query(sqlQuant, (err, result, fields) => {
    totalResults = result[0].total;
  });

  con.query(sql1, (error,resultado,fields)=>{
    if(error){
      console.log('Hubo un error en la consulta', error.message);
      return res.status(500).send('Hubo 1 error en la consulta');
    }
    let response = { 
      'peliculas':resultado,
      'total': totalResults
    };
    res.send(JSON.stringify(response));
  });
}

buscarGeneros = (req,res) => {
  let sql = 'select * from genero';
  con.query(sql, (error,resultado,fields)=>{
    if(error){
      console.log('Hubo un error en la consulta', error.message);
      return res.status(500).send('Hubo 1 error en la consulta');
    } 
    let response = { 
      generos : resultado 
    };
    res.send(JSON.stringify(response));
  });
}

obtenerPeli = (req, res) => {
  let id = req.params.id;

  let sql = "select P.poster, P.titulo, P.anio, P.trama, P.fecha_lanzamiento, P.director, P.duracion, P.puntuacion, " +
            "G.nombre as genero, A.nombre as Actores  " +
            "from pelicula as P " +
            "left join genero as G on P.genero_id = G.id " +
            "left join actor_pelicula as AP on P.id = AP.pelicula_id " +
            "left join actor as A on AP.actor_id = A.id " +
            "where P.id = " + id;
  con.query(sql, (error, resultado, fields) => {
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      }
      if (resultado.length == 0) {
          console.log("No se encontro ningún nombre con ese id");
          return res.status(404).send("No se encontro ningún nombre con ese id");
      } else {
        let arrayPelicula = {
          poster: resultado[0].poster,
          titulo: resultado[0].titulo,                     
          anio: resultado[0].anio,
          trama: resultado[0].trama,
          fecha_lanzamiento: resultado[0].fecha_lanzamiento,
          director: resultado[0].director,
          duracion: resultado[0].duracion,
          puntuacion: resultado[0].puntuacion};
        let response = {
          'pelicula': arrayPelicula,
          'actores': resultado.map(function(s) {return {nombre: s.Actores};}),
          'genero': resultado[0].genero
        };
        res.send(JSON.stringify(response));
      }
  });
}

recomendacion = (req, res) => {
    let anio_inicio = req.query.anio_inicio;
    let anio_fin = req.query.anio_fin;
    let puntuacion = req.query.puntuacion;
    let genero = req.query.genero;
    let sql = "select P.id, P.poster, P.trama, P.titulo, G.nombre " +
      "from pelicula as P " +
      "left join genero as G on P.genero_id = G.id ";
    let sqlWhere = "";

    //agregar palabra where si se informa algun filtro
    if ((anio_inicio) || (anio_fin) || (puntuacion) || (genero)) {
      sqlWhere = " where ";

      if (anio_inicio) {
        sqlWhere = sqlWhere + " P.anio >= " + anio_inicio + " and";
      }
      
      if (anio_fin) { 
        sqlWhere = sqlWhere + " P.anio <= " + anio_fin + " and";
      }
      
      if (puntuacion) {
        sqlWhere = sqlWhere + " P.puntuacion = " + puntuacion + " and";
      }
      
      if (genero) {
        sqlWhere = sqlWhere + " G.nombre = '" + genero + "' and";
      }

      //se elimina "and" excedente 
      sqlWhere = sqlWhere.substr(0, sqlWhere.length - 3)
    }

    sql = sql + sqlWhere;
    con.query(sql, (error, resultado, fields) => {
      if (error) {
        return res.status(404).send("Hubo un error en la consulta");
      }
      let response = {
        'peliculas': resultado
      };
      res.send(JSON.stringify(response));
    });
}

module.exports = {
  buscarPelis : buscarPelis,
  buscarGeneros : buscarGeneros,
  obtenerPeli: obtenerPeli,
  recomendacion: recomendacion
};
