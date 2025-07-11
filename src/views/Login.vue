<script>
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import api from '../services/apiServices.js';
const notyf = new Notyf()

export default{
    data(){
        return{
            usuario:'',
            pass:'',
            token:'',
            refreshToken:'',
            clave:'conteoElectoralmittril'
        }
    },
    mounted(){
        this.firstToken();
    },
    methods:{
        firstToken(){
        const clave = "conteoElectoralmittril";
        Cookies.set('clave',clave)
        if (!Cookies.get('access_token') && !Cookies.get('refresh_token')) {
        try {
            axios.post('https://colecto.mittril.com/public/consumer/login', {
                username: "colectoapp",
                password: "5893589300" 
            }).then((response) => {
                
                const tokenCifrado= CryptoJS.AES.encrypt(response.data.token, clave).toString();
                const refreshTokenCifrado = CryptoJS.AES.encrypt(response.data.refreshToken, clave).toString();
                Cookies.set('access_token', tokenCifrado, { expires: 1 });
                Cookies.set('refresh_token', refreshTokenCifrado, { expires: 7 });
                this.token= tokenCifrado;
                this.refreshToken= refreshTokenCifrado;
            });
        } catch (error) {
            console.log('Error al pedir el token', error);
        }
    } else {
        return console.log('si hay tokens guardados');
    }
    },
        envioLogin(){
            const datos={
                usuario:this.usuario,
                pass:this.pass  
            }
            try {
                api.post('login',datos)
                .then(response =>{
                    if(response.data.msj==='ok'){
                        const encryptUsuario= CryptoJS.AES.encrypt(datos.usuario,this.clave).toString();
                        Cookies.set('usuario',encryptUsuario);
                        notyf.success('Bienvenido al sistema de conteo electoral');
                        const userTipo= CryptoJS.AES.encrypt(response.data.tipo,Cookies.get('clave')).toString();
                        Cookies.set('tipo',userTipo)
                        const decriptTipo= CryptoJS.AES.decrypt(Cookies.get('tipo'),this.clave).toString(CryptoJS.enc.Utf8);
                        
                        if (decriptTipo==='ADMINISTRADOR') {
                            this.$router.push('/usuarios')              
                        }else if(decriptTipo==='MUNICIPIO')
                        this.$router.push('/municipio')          
                    }else{
                        notyf.error('credenciales incorrectas');
                        this.usuario='';
                        this.pass='';          
                    }
                })
            } catch (error) {
                console.log('ha ocurrido un error: ',error)
            } 
            
            
        }
    }
}

</script>

<template>
    <div class="fixed inset-0 min-h-screen min-w-screen bg-linear-to-b from-slate-900    to-slate-950 ">
        <div class="flex flex-col items-center space-y-10 justify-center mt-20 bg-transparent mx-10 rounded-md pt-10 pb-20 z-50 ">
        <img src="../assets/images/imgenVoto.jpg" class=" bg-no-repeat bg-cover w-20 h-20 rounded-lg mx-10" alt="">
        <div class=" w-full">
            <form method="post">
                <div class=" block">
                    <label for="" class=" block mb-2 text-sm font-medium font-Outfit text-gray-400 ">Usuario</label>
                    <input type="text" v-model="usuario" class=" bg-gray-200/70 text-sm  rounded-lg border border-gray-300 p-3 w-full" placeholder="ingrese su usuario">
                </div>
                <div class=" block mt-4">
                    <label for="" class=" block mb-2 text-sm font-medium font-Outfit text-gray-400">Password</label>
                    <input type="password" v-model="pass" class=" bg-gray-200/70 text-sm rounded-lg border border-gray-300 p-3 w-full" placeholder="ingrese su contraseña">
                </div>
            </form>
            <div class="block mt-5">
                <button type="button" @click="envioLogin" class=" w-full bg-blue-800 font-Outfit rounded-lg p-3 text-white hover:bg-blue-900">Ingresar</button>
            </div>
        </div>
        
    </div>
    
    </div>
    
</template>

