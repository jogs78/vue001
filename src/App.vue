<template>
    <span v-if="estaValidado">
        <span class="izquierda">
            <opciones/>
        </span>
        <span class="derecha">
            <perfil/>
        </span>
    </span>
    <router-view/>
    
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useRouter, RouterView } from 'vue-router'
    import opciones from "./views/Opciones.vue"
    import perfil from "./views/Perfil.vue"
    import { useStore } from 'vuex';
    const store = useStore();
    
    let estaValidado = ref("algo")
    
    onMounted(async () => {
        console.log("001")
        console.log(store.getters.validado)
        estaValidado.value = store.getters.validado
        console.log("002")
          console.log("estaValidado?", estaValidado)

        //await obtenerDatos()
    });

    watch(() => store.getters.validado, (newValue) => {
        estaValidado.value = newValue;
    });

    const entrar = () => {
    // Reemplaza 'nombreRuta' con el nombre de la ruta definida en vue-router
    router.push({ path: '/entrar' });
};
</script>

<style scoped>
 .izquierda{
    text-align: left;
}
 .derecha{
    text-align: right;
 }
</style>