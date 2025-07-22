<script>
import api from '@/services/apiServices';
import { Notyf } from 'notyf';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
const notyf = new Notyf();


export default{
    data(){
        return{
            usuario:'',
            pass:'',
            nombreCompleto:'',
            tipo:''
        }
    },
    methods:{
        crearUsuario(){
            const datos={
                usuario:this.usuario,
                nombre:this.nombreCompleto,
                pass:this.pass,
                tipo:this.tipo

            }
            try {
                api.post('crear_u',datos)   
                .then(response=>{
                    if(response.data.msj==='creado'){
                        notyf.success('usuario creado correctamente');
                        this.usuario='';
                        this.pass='';
                        this.nombreCompleto='';
                        this.tipo='';
                    }else if(response.data.msj==='El nombre de usuario ya existe'){
                        notyf.error('El nombre de usuario ya existe');
                    }
                }) 
            } catch (error) {
                console.log('error en el servidor: ',error);
                notyf.warning('Error en el servidor, intente mas tarde');
            }
        }
    },
    watch:{
        tipo(newval){ 
            console.log(newval);
        }
    }

}

</script>

<template>
<div class="bg-white dark:bg-gray-900 flex flex-col items-center justify-center mt-5 mx-4 rounded-lg py-10 px-5 md:min-w-xl md:mx-auto">
    <form method="post">
        <div class="block mb-4">
            <label for="" class=" dark:text-white text-slate-800 font-light font-Outfit font-sm mb-4">Usuario</label>
            <input type="text" v-model="usuario" placeholder="ingresar un usuario" class=" bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
        </div>
        <div class=" block mb-4">
            <label for="" class="dark:text-white text-slate-800 font-light font-Outfit font-sm mb-4">Password</label>
            <input type="text" v-model="pass" placeholder="ingresar un usuario" class=" bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
        </div>
        <div class=" block mb-4">
            <label for="" class="dark:text-white text-slate-800 font-light font-Outfit  font-sm mb-2">Nombre completo</label>
            <input type="text" v-model="nombreCompleto" placeholder="ingresar un usuario" class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray400 p-2">
        </div>
        <div class=" block mb-4">
            <label for="" class=" dark:text-white text-slate-800 font-light font-Outfit font-sm mb-2">Tipo</label>
            <select v-model="tipo" class="bg-gray-300/70 h-11 w-full appearance-none rounded-lg border border-gray-300/70 font-light font-Outfit  px-4 p-2  text-sm text-gray-800/70 shadow-theme-xs placeholder:text-gray-400/70 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 mt-2  ">
                <option value="" class="bg-gray-300/70 font-light font-Outfit font-sm rounded-lg" selected disabled>selecciona tipo</option>
                <option value="ADMINISTRADOR" class="bg-gray-300/70 font-light font-Outfit rounded-lg">ADMINISTRADOR</option>
                <option value="MUNICIPIO" class="bg-gray-300/70 font-light font-Outfit rounded-lg">MUNICIPIO</option>
            </select>
        </div>
        <button type="button" @click="crearUsuario" class=" bg-blue-800 hover:bg-blue-600 text-white font-medium font-Outfit w-full p-2.5 rounded-lg mt-5 cursor-pointer">Crear Usuario</button>
    </form>
</div>

</template>