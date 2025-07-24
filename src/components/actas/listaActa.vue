<script>
import api from '../../services/apiServices.js';
import { Notyf } from 'notyf';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
const notyf= new Notyf();


export default{
    data(){
        return{
            listActas:null,
            clave:'conteoElectoralmittril',
            currentPage:1,
            searchActas:'',
            itemsPerPage:10,
            modalVisible:false,
            imagenUrl:'',
            
        }
    },
    mounted(){
        
        this.listarActas()
    }, 
    methods:{
        abrirModalImagen(idImagen){
            this.imagenUrl =`https://actas.mittril.com/api/image/${idImagen}`
            this.modalVisible= true
        },
        cerrarModal(){
            this.modalVisible= false;
            this.imagenUrl= ''
        },
        goToPage(page) {
             if (page >= 1 && page <= this.totalPages) {
                this.currentPage= page;
            }
        }, 
        listarActas(){
            const decryptUsuario=CryptoJS.AES.decrypt(Cookies.get('usuario'),this.clave).toString(CryptoJS.enc.Utf8);
                try {
                api.get(`lista_permiso/${decryptUsuario}`)
                .then(response=>{
                    if (!response.data.entry==[]) {
                        this.permiso=response.data.entry;
                        const encryptMunicipio= CryptoJS.AES.encrypt(this.permiso[0].municipio.replace(/ /g, '-'),this.clave).toString();
                        Cookies.set('municipio',encryptMunicipio)
                    }else{
                        return []
                    }
                })
            } catch (error) {
                console.log('ha ocurrido un error al obtener los permisos: ',error);
            } 
            
            const decryptMunicipio=CryptoJS.AES.decrypt(Cookies.get('municipio'),this.clave).toString(CryptoJS.enc.Utf8);
            
            try {
                api.post('lista_acta',{
                    tipo:'municipio',
                    nombre:decryptMunicipio
                })
                .then(response=>{ 
                        console.log(response.data)
                        this.listActas=response.data.data
                    
                })
            } catch (error) {
                console.log('error en el servidor:', error)    
            }
        }
    },
    computed:{
        paginatedActa(){
            let filtered= this.listActas ? this.listActas.filter(rec=> rec.nro.toLowerCase().includes(this.searchActas.toLocaleLowerCase()) || rec.codigo.toLocaleLowerCase().includes(this.searchActas.toLocaleLowerCase()) ) :[];
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return filtered.slice(start, start + this.itemsPerPage);
        },
        totalPages(){
             let filtered= this.listActas ? this.listActas.filter(rec=> rec.nro.toLowerCase().includes(this.searchActas.toLocaleLowerCase()) || rec.codigo.toLocaleLowerCase().includes(this.searchActas.toLocaleLowerCase()) ) :[];
            return Math.ceil(filtered.length / this.itemsPerPage); 
        }
    }
} 
</script>



<template>
<div class="flex flex-col items-center justify-center mx-2 mt-4  w-full">
    <div class="overflow-hidden rounded-xl border-gray-800  bg-white/90 dark:bg-white/[0.03] mt-4">        
        <input type="text" v-model="searchActas" placeholder="Buscar actas" class="bg-gray-300/70 dark:focus:outline-slate-900 focus:outline-gray-300 p-2.5 font-Outfit rounded-lg mt-4 mb-2 mx-3">
        <div v-if="!listActas" class="flex justify-center items-center py-10">
            <span class="text-slate-800 dark:text-white text-lg font-Outfit"> Cargando Actas...</span>
        </div>
        <div v-else class="sm:max-w-sm md:max-w-3xl lg:max-w-5xl  sm:overflow-x-auto lg:custom-scrollbar">
            <table class="min-w-sm ">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">Nro Mesa</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">Codigo Mesa</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">Municipio</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">Recinto</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">Cantidad votos</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">votos validos</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">votos nulos</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">votos blanco</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">Imagen</p>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                    <tr v-for="(ac,index) in paginatedActa" :key="index" class="border-t border-gray-800">
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-medium text-sm font-Outfit text-theme-sm text-slate-900 dark:text-white/90">{{ ac.nro }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-medium text-sm font-Outfit text-theme-sm text-slate-900 dark:text-white/90">{{ ac.codigo }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-medium text-sm font-Outfit text-theme-sm text-slate-900 dark:text-white/90">{{ ac.municipio }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-medium text-sm font-Outfit text-theme-sm text-slate-900 dark:text-white/90">{{ ac.recinto }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-medium text-sm font-Outfit text-theme-sm text-slate-900 dark:text-white/90">{{ ac.cant_votos }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-medium text-sm font-Outfit text-theme-sm text-slate-900 dark:text-white/90">{{ ac.votos_validos }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-medium text-sm font-Outfit text-theme-sm text-slate-900 dark:text-white/90">{{ ac.votos_nulos }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-medium text-sm font-Outfit text-theme-sm text-slate-900 dark:text-white/90">{{ ac.votos_blancos }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div class="border border-orange-700 bg-orange-600 hover:bg-orange-500 dark:bg-slate-800  dark:border-gray-700 rounded-full p-2 dark:hover:bg-blue-600 cursor-pointer" @click="abrirModalImagen(ac.acta)">
                                    <i class="pi pi-images text-white"></i>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="flex justify-center items-center mt-4 mb-4 space-x-2">
                <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="px-3 py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-50"
                >
                    Anterior
                </button>
                <span class="text-white/80 bg-gray-900 px-3 py-1 rounded">
                    Página {{ currentPage }} de {{ totalPages }}
                </span>
                <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    </div>

    <!-- Modal -->
     <transition
     enter-active-class="transition duration-300 ease-out"
     enter-from-class="opacity-0 scale-95"
     enter-to-class=" opacity-100 scale-100"
     leave-active-class=" transition duration-200 ease-in"
     leave-from-class=" opacity-100 scale-100"
     leave-to-class=" opacity-0 scale-95">
        <div v-if="modalVisible" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div class="bg-gray-900 flex flex-col items-center justify-center mt-5 mx-4 rounded-lg py-10 px-5 w-full max-w-md relative">
        
        <button type="button" @click="cerrarModal" class="absolute top-4 right-4 text-gray-300 hover:text-red-500 text-2xl transition">
            <i class="pi pi-times"></i>
        </button>
        <img :src="imagenUrl" alt="Imagen acta" class="rounded-lg max-h-[70vh] object-contain">    
    </div>
        </div>
</transition>
    
</div>

</template>