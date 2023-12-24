<template>
  <div style="align-content: center;">
    <table border="1">
      <thead>
        <tr>
          <th>id</th>
          <th>servicio</th>
          <th>direccion</th>
          <th>precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-if="datos.length > 0" >
        <tr v-for="(item, index) in datos" :key="index" @click="seleccionarRegistro(item)">
          <td>{{ item.id }}</td>
          <td>{{ item.servicio }}</td>
          <td>{{ item.direccion }}</td>
          <td>{{ item.precio }}</td>
          <td>
            <button @click.stop="eliminarRegistro(item.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4">No hay terrenos disponibles.</td>
        </tr>
      </tbody>
    </table>
    <br>
    <br>
    <br>
    {{ modoEdicion ? 'Actualizar el registro seleccionado' : 'Crear un nuevo registro' }}
    <hr>
    <form @submit.prevent="guardarRegistro"  >
      <label for="servicio">Servicio:</label>
      <input v-model="registroSeleccionado.servicio" id="servicio" />
      <br>
      <label for="direccion">Direccion:</label>
      <input v-model="registroSeleccionado.direccion"  id="direccion" />
      <br>
      <label for="precio">Precio:</label>
      <input v-model="registroSeleccionado.precio"  type="number" id="precio" />
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
  const registroSeleccionado = ref({});
  const modoEdicion = ref(false);

  onMounted(async () => {
    fetch(  api + 'terrenos')
    .then(response => { //function asdfasdf(response){}
      if (!response.ok ) {
        throw new Error(`Error al realizar la solicitud: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => { // function asdfasdfasdf(data){ }
      datos.value = data;
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
});

function obtenerDatos() {
  fetch(  api + 'terrenos')
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


  const enviarSolicitud = (url, method, body) => {
    let requestBody;
    requestBody = new URLSearchParams(body);

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al realizar la solicitud: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        return obtenerDatos(); // Llama a obtenerDatos después de completar la solicitud
      })
      .catch( error => {
        console.error('Error en la solicitud:', error);
      });
};

const guardarRegistro = async () => {
  let url = "";
  let method = "";
  if( modoEdicion.value == false ) {
    url =  api + 'terrenos'
    method = 'POST'
  }  else{
    url =  api + 'terrenos/' + registroSeleccionado.value.id
    method = 'PUT'
  }

  await enviarSolicitud(url, method, registroSeleccionado.value);
  cancelarEdicion();
};

const eliminarRegistro = async (id) => {
  const url = api + 'terrenos/' + id;
  const method = 'DELETE';
  await enviarSolicitud(url, method, { 'id' : id });
};

const cancelarEdicion = () => {
  registroSeleccionado.value = {};
  modoEdicion.value = false;
};
</script>

<style scoped>
/* Agrega estilos CSS si es necesario */
</style>


