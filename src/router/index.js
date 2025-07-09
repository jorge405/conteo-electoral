import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Usuarios from '../views/Usuarios.vue'
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
    }
  ],
})

export default router
