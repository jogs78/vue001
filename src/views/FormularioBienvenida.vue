<template>
    <pre v-if="datosEdicion.respuesta != ''">{{ datosEdicion.respuesta }}</pre>
    <div class="greetings">
        <h1 class="green">BienVenido</h1>
        <h3> You’ve successfully created a project. What's next? </h3>
    </div>
    <nav>
        <a @click="ir">Entrar</a>
    </nav>
    <!--
          <router-view></router-view>
            <RouterLink to="/casas">Casas</RouterLink> - 
            <RouterLink to="/terrenos">Terrenos</RouterLink> - 
            <RouterLink to="/entrar">Entrar</RouterLink>
            <RouterView />
        
        -->
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const datosEdicion = ref({ row: null, campo: "", valor: null, estado: false, respuesta: null })

const ir = () => {
    // Reemplaza 'nombreRuta' con el nombre de la ruta definida en vue-router
    console.log("ir")
    router.push({ name: 'login' });
};



</script>
/*
<style scoped>
/* Agrega estilos CSS si es necesario */
</style>
*/