import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Usuarios from '../views/usuarios/usuarios.vue';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
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
      component:Usuarios,
      meta:{requiresAuth:true}
    },
    {
      path:'/asignar',
      name:'asignar',
      component:()=> import('../views/usuarios/asignar.vue'),
      meta:{requiresAuth:true}
    },
    {
      path:'/crearUsuario',
      name:'crearUsuario',
      component:()=> import('../views/usuarios/crearUsuario.vue'),
      meta:{requiresAuth:true}
    },
    {
      path:'/municipio',
      name:'municipio',
      component:()=>import('../views/municipio/municipio.vue'),
      meta:{requiresAuth:true}
    },
    {
      path:'/acta',
      name:'acta',
      component:()=>import('../views/municipio/cargaActa.vue'),
      meta:{requiresAuth:true}
    },
    {
      path:'/listaActa',
      name:'ListaActa',
      component:()=>import('../views/municipio/ListaActas.vue'),
      meta:{requiresAuth:true}
    }
  ],
})

export default router

function isAuthentificated(){
  
  const token = Cookies.get('access_token');
  return !!token;
}

router.beforeEach((to,from,next)=>{
  if (to.matched.some(record=> record.meta.requiresAuth)) {
    if (!isAuthentificated()) {
      next('/');
    }else{
      next();
    }
  }else{
    next();
  }

});