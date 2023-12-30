// middleware.js
import { ref } from 'vue';
import { useStore } from 'vuex';

const verificarAutenticacion = () => {
  const store = useStore();
  const logeado = ref(store.state.logeado);
  return logeado;
};

export const autenticacionGuard = (to, from, next) => {
  const logeado = verificarAutenticacion();
  if (logeado.value) {
    next(); // Permitir la navegación
  } else {
    next('/entrar'); // Redirigir a la página de inicio de sesión
  }
};
