<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <RouterLink to="/casas">Casas</RouterLink> - 
    <RouterLink to="/terrenos">Terrenos</RouterLink>
    <RouterView />
</template>

