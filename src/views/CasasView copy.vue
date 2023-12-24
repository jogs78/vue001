<template>
  <div v-if="lasrtresponse != ''" >Respuesta...{{ lasrtresponse }}</div>
  <br>
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
      <tbody v-if="datos.length > 0" >

        <tr v-for="(row, rowIndex) in datos" :key="rowIndex" @click="seleccionarRegistro(rowIndex)">
            <td v-for="(cell, colIndex) in sinId(row)" :key="colIndex">
                <template v-if="!modoEdicion">
                  <span @dblclick="startEditing(rowIndex, colIndex)">{{ cell }}</span>
                </template>
                <template v-else>
                  <input v-model="datos[rowIndex][colIndex]" name="{{ colIndex }}" @keyup.enter="saveEdit(rowIndex, colIndex)" @keyup.esc="cancelEdit(rowIndex, colIndex)" />
                </template>

              </td>

            <td>
              <button @click.stop="eliminarRegistro(item.id)">Eliminar</button>
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
    <br>
    <br>
    <br>
    {{ modoEdicion ? 'Actualizar el registro seleccionado' : 'Crear un nuevo registro' }}
    <hr>
    <form @submit.prevent="guardarRegistro"  >
      <label for="direccion">Direccion:</label>
      <input v-model="registroSeleccionado.direccion" id="direccion" />
      <br>
      <label for="codigo_postal">Codigo Postal:</label>
      <input v-model="registroSeleccionado.codigo_postal"  type="number" id="codigo_postal" />
      <br>
      <label for="precio">Precio:</label>
      <input v-model="registroSeleccionado.precio" id="precio" />
      <br>
      <button type="submit">{{ modoEdicion ? 'Actualizar' : 'Crear' }}</button>
      <button @click.prevent="cancelarEdicion" v-if="modoEdicion">Cancelar</button>
    </form>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  const api = 'http://127.0.0.1:8000/api/';
  const datos = ref([]);
  const lasrtresponse = ref("");
  const registroSeleccionado = ref({});
  const modoEdicion = ref(false);
  const campos = ref(['direccion','codigo_postal','precio'])

  const sinId = (row) =>{
    delete row.id;
    return row
  }

  const editedData = ref([]);

  const startEditing = (row, col) => {
//    editing = { row, col };
    modoEdicion.value = true;

//    editedData.value = JSON.parse(JSON.stringify(datos.value)); // Clonar los datos para editarlos
  };

  const cancelEdit = () => {
    console.log("escape")
    modoEdicion.value = false;
  };

  const saveEdit = () => {
    console.log("enter")
    modoEdicion.value = false;

    datos.value = JSON.parse(JSON.stringify(editedData.value)); // Guardar los datos editados
  };


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

  const seleccionarRegistro = (item) => {
    registroSeleccionado.value = { ...item };
    modoEdicion.value = true;
  };


  const enviarSolicitud = async (url, method, body) => {
  try {
    let requestBody = new URLSearchParams(body);
    console.log(`${method} : ${url}`);
    lasrtresponse.value = "";

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


  const enviarSolicitudOld = (url, method, body) => {
    let requestBody;
    requestBody = new URLSearchParams(body);
    console.log (method + " : " + url)
    lasrtresponse.value = ""
     fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: requestBody,
    })
      .then(response => {
        switch (response.status) {
          case 200:
              console.log("regreso 200, ok");
              lasrtresponse.value = "OK"
              return response.json();
            break;
          case 201:
              console.log("regreso 201, created");
              lasrtresponse.value = "Creado."
              return response.json();
            break;
          case 204:
              console.log("regreso 204, borrado");
              lasrtresponse.value = "borrado"
              return ;
            break;
          case 422:
              console.log("regreso 422, errores al validar");
              lasrtresponse.value = "Errores al validar";
            break;        
          default:
            throw new Error(`Error al realizar la solicitud: ${response.statusText}`);  
          break;
        }
      })
      .then(() => {
        let tmp = lasrtresponse.value        
        lasrtresponse.value = tmp
        //return obtenerDatos(); // Llama a obtenerDatos después de completar la solicitud
        return
      })
      .catch( error => {
        console.error('Error en la solicitud:', error);
      });
};

const guardarRegistro = async () => {
  let url = "";
  let method = "";
  if( modoEdicion.value == false ) {
    url =  api + 'casas'
    method = 'POST'
  }  else{
    url =  api + 'casas/' + registroSeleccionado.value.id
    method = 'PUT'
  }

  const respsol =  await  enviarSolicitud(url, method, registroSeleccionado.value);
  console.log ("cuando actualice recibi: " + respsol)
  await obtenerDatos()
  cancelarEdicion();
};


const agregarRegistro = async () => {
  let url =  api + 'casas'
  let method = 'POST'
  const respsol =  await  enviarSolicitud(url, method, registroSeleccionado.value);
  console.log ("cuando guarde recibi: " + respsol)
  await obtenerDatos()
  cancelarEdicion();

}


const eliminarRegistro = async (id) => {
  const url = api + 'casas/' + id;
  const method = 'DELETE';
  const respsol =  await enviarSolicitud(url, method, null);
  console.log ("cuando solicite recibi: " + respsol)
  console.log("despues de borrar, listar");
  obtenerDatos();
};

const cancelarEdicion = () => {
  registroSeleccionado.value = {};
  lasrtresponse.value = ""
  modoEdicion.value = false;
};
</script>

<style scoped>
/* Agrega estilos CSS si es necesario */
input {
  background-color: red;
}
</style>


