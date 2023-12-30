<template>
    :: {{ quien.nombre_completo }} ( {{ quien.tipo_de_usuario }} )
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const quien = ref(store.getters.quien);
//const quien.value = store.getters.quien
</script>
