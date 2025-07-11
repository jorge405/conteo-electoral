import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Usuarios from '../views/usuarios/usuarios.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component:Login,
    },
    {
      path:'/usuarios',
      name:'usuarios',
      component:Usuarios
    },
    {
      path:'/asignar',
      name:'asignar',
      component:()=> import('../views/usuarios/asignar.vue')
    },
    {
      path:'/crearUsuario',
      name:'crearUsuario',
      component:()=> import('../views/usuarios/crearUsuario.vue')
    },
    {
      path:'/municipio',
      name:'municipio',
      component:()=>import('../views/municipio/municipio.vue')
    },
    {
      path:'/acta',
      name:'acta',
      component:()=>import('../views/municipio/cargaActa.vue')
    }
  ],
})

export default router
