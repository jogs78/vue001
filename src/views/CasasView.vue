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
      <tbody v-if="datos.length > 0">
        <tr v-for="(row, rowIndex) in datos" :key="rowIndex">
          <td v-if="!estaEditando(rowIndex, 'direccion')"  @dblclick="startEditing(rowIndex, 'direccion', row.direccion)">{{ row.direccion }}</td>
          <td v-else><input v-model="valorTemporal"  name="direccion" @keyup.esc="cancelEdit()" @keyup.enter="saveEdit(row)"/></td>

          <td v-if="!estaEditando(rowIndex, 'codigo_postal')" @dblclick="startEditing(rowIndex, 'codigo_postal',row.codigo_postal )">{{ row.codigo_postal }}</td>
          <td v-else><input v-model="valorTemporal" name="codigo_postal" @keyup.esc="cancelEdit()" @keyup.enter="saveEdit(row)" /></td>

          <td v-if="!estaEditando(rowIndex, 'precio')" @dblclick="startEditing(rowIndex, 'precio',row.precio)">{{ row.precio }}</td>
          <td v-else><input v-model="valorTemporal" name="codigo_postal" @keyup.esc="cancelEdit()" @keyup.enter="saveEdit(row)" /></td>

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
  const lasrtresponse = ref("");
  const registroSeleccionado = ref({});
  const datosEdicion = ref({row:null, campo:"", valor:null, estado:false})
  const modoEdicion = ref(false);
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


  const startEditing = (row, campo, valor) => {
    if(datosEdicion.value.estado)return
    valorTemporal.value = valor;
    datosEdicion.value.row = row
    datosEdicion.value.campo = campo 
    datosEdicion.value.estado = true;
  };


  const cancelEdit = () => {
    valorTemporal.value = ''
    datosEdicion.value.row = null
    datosEdicion.value.campo = null
    datosEdicion.value.estado = false;
  };

  const saveEdit = (registro) => {
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

const actualizarRegistro = async (registro) => {
  let url = "";
  let method = "";
  url =  api + 'casas/' + registro.value.id
  method = 'PUT'
  const respsol =  await  enviarSolicitud(url, method, registro.value);
  console.log ("cuando actualice recibi: " + respsol)
  await obtenerDatos()
  cancelarEdicion();
};


const agregarRegistro = async () => {
  let url =  api + 'casas'
  let mesthod = 'POST'
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
  datosEdicion.value.estado = false;
};
</script>

<style scoped>
/* Agrega estilos CSS si es necesario */
input {
  background-color: red;
}
</style>