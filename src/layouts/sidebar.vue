<template>
  <div class="relative">
    <!-- Menú lateral -->
    <transition name="slide">
      <div
        v-if="menuAbierto"
        class="fixed top-0 left-0 h-full w-56 bg-slate-900 shadow-lg z-50 transition-transform duration-300"
      >
        <div class="flex items-center justify-between p-4 border-b border-slate-800">
          <span class="text-white font-bold text-lg">Menú</span>
          <i class="pi pi-bars text-white text-xl cursor-pointer" @click="toggleMenu"></i>
        </div>
        <ul v-if="['/usuarios', '/crearUsuario', '/asignar'].includes($route.path)" class="mt-6 space-y-4 px-6">
          <li><i class="pi pi-home mr-4 text-white"></i><router-link to="/usuarios" class="text-white hover:text-blue-400 transition">Inicio</router-link></li>
          <li><i class="pi pi-user mr-4 text-white"></i><router-link to="/crearUsuario" class="text-white hover:text-blue-400 transition">Crear Usuario</router-link></li>
          <li><i class="pi pi-check-square mr-4 text-white"></i><router-link to="/asignar" class="text-white hover:text-blue-400 transition">Asignar</router-link></li>
        </ul>
        <ul v-if="['/municipio','/acta','/ListaActa'].includes($route.path)" class="mt-6 space-y-4 px-6" >
          <li><i class="pi pi-home mr-4 text-white"></i><router-link to="/municipio" class="text-white hover:text-blue-400 transition">Municipio</router-link></li>
          <li><i class="pi pi-file mr-4 text-white"></i><router-link to="/acta" class="text-white hover:text-blue-400 transition">Cargar Acta</router-link></li>
          <li><i class="pi pi-file mr-4 text-white"></i><router-link to="/ListaActa" class="text-white hover:text-blue-400 transition">Lista de Actas</router-link></li>
        </ul>
      </div>
    </transition>

    <!-- Barra superior -->
    <div class="bg-slate-900 flex justify-between items-center py-8">
      <div
        class="flex w-7 h-7 mx-4 text-white rounded-lg items-center justify-center border border-gray-100 cursor-pointer"
        @click="toggleMenu"
      >
        <i class="pi pi-bars"></i>
      </div>
      <h3 class="font-md font-semibold mx-4 text-white">
        <slot name="title">Título</slot>
      </h3>
      <div class="flex items-center space-x-2">
        <img src="../assets/images/user.png" alt="#" class="bg-cover bg-no-repeat w-10 h-10 bg-slate-900 rounded-full mx-4 ">
        <span @click="toggleDarkmode" class=" cursor-pointer flex items-center rounded-full border border-gray-500 p-1">
          <i v-if="isDark" class="pi pi-moon text-yellow-400 text-md"></i>
          <i v-else class="pi pi-sun text-white text-md"></i>
        </span>
        <span @click="cerrarSesion"><i class="pi pi-power-off text-white w-10 cursor-pointer"></i></span>
      </div>
      
    </div>

    <!-- Contenido principal -->
    <div :class="isDark ? 'bg-slate-950' : 'bg-gray-300/30'" class="min-h-screen transition-colors duration-300">
      <slot />
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { RouterLink, } from 'vue-router';

export default {
  name: "Sidebar",
  data() {
    return {
      menuAbierto: false,
      isDark:Cookies.get('modo')==='dark'
    }
  },
  mounted(){
    if (this.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  methods: {
    toggleMenu() {
      this.menuAbierto = !this.menuAbierto;
    },
    cerrarSesion(){
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('municipio');
      Cookies.remove('recinto');
      Cookies.remove('tipo');
      Cookies.remove('usuario');
      this.$router.push('/');
    },
    toggleDarkmode(){
      this.isDark= !this.isDark;
      if (this.isDark) {
        document.documentElement.classList.add('dark');
        Cookies.set('modo','dark');
        
      }else{
        document.documentElement.classList.remove('dark');
        Cookies.set('modo','light');
      }
    }
    
  }
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>