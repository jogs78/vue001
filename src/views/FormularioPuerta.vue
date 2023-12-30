<template>
  <pre  v-if="datosEdicion.respuesta != ''">{{ datosEdicion.respuesta }}</pre>
  <div style="align-content: center;">
    <form @submit.prevent="validar"  >
      <label for="nombre_de_usuario">Usuario:</label>
      <input v-model="credenciales.nombre_de_usuario" id="nombre_de_usuario" />
      <br>
      <label for="clave">Clave:</label>
      <input v-model="credenciales.clave"  type="text" id="clave" />
      <br>
      <button type="submit">Validar</button>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const store = useStore();
  const api = 'http://127.0.0.1:8000/api/';
  const datos = ref([]);
  const credenciales = ref({});
  const datosEdicion = ref({row:null, campo:"", valor:null, estado:false, respuesta:null})

  const validar = async () => {
    let url =  api + 'revisar'
    let method = 'POST'
  //
  try {
      let requestBody = new URLSearchParams(credenciales.value);
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
          datosEdicion.value.respuesta = "Registro encontrado";     
          const quien = await response.json()
          store.commit('asignar', quien); 
          console.log("despues de asignar")
          console.log(store.getters.validado)
          //estaValidado= store.getters.validado
          console.log("despues de asignar2")
          if(quien.tipo_de_usuario == 'vendedor' )
            router.push('/casas');
          else
            router.push('/terrenos');
          break;
        case 401: //errores
          const errores = await response.json()
          console.log("los errores son:" , errores)
          datosEdicion.value.respuesta =errores
          break;
        default:
          console.log("ERROR: " + response.status); 
          break;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

    //const respsol =  await  enviarSolicitud(url, method, credenciales.value);
    //console.log ("cuando guarde recibi: " + respsol)
  }

</script>
/*
<style scoped>
/* Agrega estilos CSS si es necesario */
</style>
*/