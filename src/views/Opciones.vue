<template>
    <RouterLink to="/casas">Casas</RouterLink> - 
    <RouterLink to="/terrenos">Terrenos</RouterLink> -
    <a @click="salir">Salir</a>

    <!--  
    <RouterView />
    -->
</template>

<script setup>
import { useRouter, RouterLink, RouterView } from 'vue-router'
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();
const salir = () => {
    // Reemplaza 'nombreRuta' con el nombre de la ruta definida en vue-router
    store.commit('salir'); 
    router.push({ name: 'home' });
};
</script>
