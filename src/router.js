import { createRouter, createWebHistory } from 'vue-router'
import { autenticacionGuard } from './middleware_auth'; // Ajusta la ruta según tu estructura de carpetas


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/FormularioBienvenida.vue')
//      redirect: '/entrar', // Redirige la raíz a la ruta /entrar
    },
    {
      path: '/entrar',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/FormularioPuerta.vue')
    },
    {
      path: '/casas',
      name: 'rcasas',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/CasasView.vue'),
      beforeEnter: autenticacionGuard
    },
    {
      path: '/terrenos',
      name: 'rterrenos',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/TerrenosView.vue'),
      beforeEnter: autenticacionGuard
    }
  ]
})
/*
Route::get('_',[PuertaController::class,"entrar"])->name('_');
Route::get('salir',[PuertaController::class,"salir"])->name('salir'); 

Route::post('revisar',[PuertaController::class, "revisar"])->name('revisar');

*/
export default router
