// store.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    count: 0,
    logeado: false,
    usuario:{
    }
  },
  mutations: {
    // Aquí defines las mutaciones para modificar el estado
    asignar(state, quien){
        console.log("asignando")
        state.logeado = true
        state.usuario = { ...quien };
    },
    salir(state){
      state.logeado = false
  },

    // Otras mutaciones...
  },
  actions: {
    // Aquí defines acciones que pueden llamar a mutaciones
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    },
    // Otras acciones...
  },
  getters: {
    // Aquí defines getters para obtener valores derivados del estado
    getCount: state => state.count,
    validado: state => {
      return state.logeado
    },
    quien : state => state.usuario,
    // Otros getters...
  },
});
