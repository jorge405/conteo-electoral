<script>

import { RouterLink, RouterView } from 'vue-router'
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
export default{
  data(){
    return{
      inactividadTimer:null,
      // 10 minutos en milisegundos
      tiempoMaxInactivo:10 * 60 * 1000 
    };
  },
  created(){
    this.iniciarDetectorInactividad();
    window.addEventListener('beforeunload',()=>{
      this.cerrarSesion();
    })
  },
  methods:{
    cerrarSesion(){
      // Eliminar cookies de token
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('tipo');
      Cookies.remove('usuario');
      // redirigir al login

      this.$router.push('/');
    },
    reiniciarTimer(){
      clearTimeout(this.inactividadTimer);
      this.inactividadTimer=setTimeout(()=>{
        this.cerrarSesion();

      },this.tiempoMaxInactivo);
    },
    iniciarDetectorInactividad(){
      // escuchar distintos eventos de interaccion 
      ['mousemove','keydown','click','touchstart'].forEach(evt=> window.addEventListener(evt,this.reiniciarTimer));
      // arrancamos el primer timer
      this.reiniciarTimer();
    }
  },
  beforeDestroy() {
    //  Esto se ejecuta justo antes de que el componente se destruya.
    //    Sirve para limpiar los event listeners y timers 
    //    y evitar fugar memoria o llamadas inesperadas.
    ['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt => window.removeEventListener(evt, this.reiniciarTimer));
    clearTimeout(this.inactividadTimer);
  },
}

</script>

<template>
  
  <RouterView />
</template>

