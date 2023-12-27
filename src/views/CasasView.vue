<template>
  <pre  v-if="datosEdicion.respuesta != ''">{{ datosEdicion.respuesta }}</pre>
  <div style="align-content: center;">
    <table border="1">
      <thead>
        <tr>
          <th>direccion</th>
          <th>codigo postal</th>
          <th>precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-if="datos.length > 0">
        <tr v-for="(row, rowIndex) in datos" :key="rowIndex">
          <td v-if="!estaEditando(rowIndex, 'direccion')"  @dblclick="comenzarEdicion(rowIndex, 'direccion', row.direccion)">{{ row.direccion }}</td>
          <td v-else><input v-model="valorTemporal"  name="direccion" @keyup.esc="cancelarEdicion()" @keyup.enter="guardarEdicion(row)"/></td>

          <td v-if="!estaEditando(rowIndex, 'codigo_postal')" @dblclick="comenzarEdicion(rowIndex, 'codigo_postal',row.codigo_postal )">{{ row.codigo_postal }}</td>
          <td v-else><input v-model="valorTemporal" name="codigo_postal" @keyup.esc="cancelarEdicion()" @keyup.enter="guardarEdicion(row)" /></td>

          <td v-if="!estaEditando(rowIndex, 'precio')" @dblclick="comenzarEdicion(rowIndex, 'precio',row.precio)">{{ row.precio }}</td>
          <td v-else><input v-model="valorTemporal" name="codigo_postal" @keyup.esc="cancelarEdicion()" @keyup.enter="guardarEdicion(row)" /></td>

          <td>
            <button @click.stop="eliminarRegistro(row.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4">No hay casas disponibles.</td>
        </tr>
      </tbody>
      <tfoot>
        <td><input v-model="registroSeleccionado.direccion" id="direccion" /></td>
        <td><input v-model="registroSeleccionado.codigo_postal"  type="number" id="codigo_postal" /></td>
        <td><input v-model="registroSeleccionado.precio" id="precio" /></td>
        <td>
          <button @click.stop="agregarRegistro()">+</button>
        </td>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  const api = 'http://127.0.0.1:8000/api/';
  const datos = ref([]);
  const registroSeleccionado = ref({});
  const datosEdicion = ref({row:null, campo:"", valor:null, estado:false, respuesta:null})
  const valorTemporal = ref('');

  /* ui */
  onMounted(async () => {
    await obtenerDatos()
  });

  function obtenerDatos() {
    fetch(  api + 'casas')
      .then(response =>  response.json() )
      .then(data => {
        datos.value = data;
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }

  const estaEditando = function (row,campo) {
    if(datosEdicion.value.estado && datosEdicion.value.row == row && datosEdicion.value.campo == campo) return true
    else return false  
  }


  const comenzarEdicion = (row, campo, valor) => {
    if(datosEdicion.value.estado)return
    valorTemporal.value = valor;
    datosEdicion.value.row = row
    datosEdicion.value.campo = campo 
    datosEdicion.value.estado = true;
  };


  const cancelarEdicion = () => {
    valorTemporal.value = ''
    datosEdicion.value.row = null
    datosEdicion.value.campo = null
    datosEdicion.value.estado = false;
  };

  const guardarEdicion = (registro) => {
    registro[datosEdicion.value.campo] = valorTemporal.value;



    datosEdicion.value.row = null
    datosEdicion.value.campo = null
    datosEdicion.value.estado = false;
    registroSeleccionado.value = { ...registro };


    actualizarRegistro(registroSeleccionado)
  };




  const enviarSolicitud = async (url, method, body) => {
  try {
    let requestBody = new URLSearchParams(body);
    console.log(`${method} : ${url}`);
    datosEdicion.value.respuesta = "";
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: requestBody,
    });
    return response.status;
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return response.status;
  }
};

const actualizarRegistro = async (registro) => {
  let url = "";
  let method = "";
  url =  api + 'casas/' + registro.value.id
  method = 'PUT'
  const respsol =  await  enviarSolicitud(url, method, registro.value);
  console.log ("cuando actualice recibi: " + respsol)
  await obtenerDatos()
  borrar();
};


const agregarRegistro = async () => {
  let url =  api + 'casas'
  let method = 'POST'
  
//
try {
    let requestBody = new URLSearchParams(registroSeleccionado.value);
    datosEdicion.value.respuesta = "";
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: requestBody,
    });

    switch (response.status) {
      case 200:
      case 201:
        datosEdicion.value.respuesta = "Registro agregado";      
        break;
      case 422: //errores
        const errores = await response.json()
        //console.log(errores.errors)
        let cadenaDeErrores = ''
        // Recorrer las claves del objeto errores
        for (const campo in errores.errors) {
          if (errores.errors.hasOwnProperty(campo)) {
            cadenaDeErrores += `${campo}: ${errores.errors[campo].join(', ')}\n `;
          }
          cadenaDeErrores += `\n `
        }
        datosEdicion.value.respuesta =cadenaDeErrores
        console.log(cadenaDeErrores);  
        break;
      default:
        console.log("ERROR: " + response.status); 
        break;
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }

  //const respsol =  await  enviarSolicitud(url, method, registroSeleccionado.value);
  //console.log ("cuando guarde recibi: " + respsol)
  await obtenerDatos()
  borrar();

}

const eliminarRegistro = async (id) => {
  const url = api + 'casas/' + id;
  const method = 'DELETE';
  const respsol =  await enviarSolicitud(url, method, null);
  console.log ("cuando solicite recibi: " + respsol)
  console.log("despues de borrar, listar");
  obtenerDatos();
};

const borrar = () => {
  registroSeleccionado.value = {};
//  datosEdicion.value.respuesta = ""
  datosEdicion.value.estado = false;
};
</script>

<style scoped>
/* Agrega estilos CSS si es necesario */
input {
  background-color: red;
}
</style>