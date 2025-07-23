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
            //currentPage:1,
            searchActas:''
            
        }
    },
    mounted(){
        
        this.listarActas()
    }, 
    methods:{
        /*goToPage(page) {
             if (page >= 1 && page <= this.totalPages) {
                this.currentPage= page;
            }
        }, */
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
        /*totalPages(){
            if (!this.listRecinto) return 1;
            // Calcula páginas según el filtro
            const filtered = this.listRecinto
                ? this.listRecinto.filter(r =>
                    r.recinto.toLowerCase().includes(this.searchRecinto.toLowerCase())
                  )
                : [];
            return Math.ceil(filtered.length / this.itemsPerPage);
        } */
    }
}
</script>



<template>
<div class="flex flex-col items-center justify-center mx-2 mt-4  w-full">
    <div class="overflow-hidden rounded-xl border-gray-800 bg-white/[0.03] mt-4">
        <input type="text" v-model="searchActas" placeholder="Buscar actas" class="bg-gray-400/70 p-2.5 font-Outfit rounded-lg mt-4 mb-2 mx-3">
        <div v-if="!listActas" class="flex justify-center items-center py-10">
            <span class="text-white text-lg font-Outfit"> Cargando Actas...</span>
        </div>
        <div v-else class="max-w-sm overflow-x-visible custom-scrollbar">
            <table class="min-w-sm">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font medium text-gray-500 text-sm text-theme-xs">Municipio</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font medium text-gray-500 text-sm text-theme-xs">Recinto</p>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                    <tr v-for="(ac,index) in listActas" :key="index" class="border-t border-gray-800">
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-light text-sm font-Outfit text-theme-sm text-white/90">{{ ac.municipio }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-light text-sm font-Outfit text-theme-sm text-white/90">{{ ac.recinto }}</span>
                                </div>
                            </div>
                        </td>
                        <!--<td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div class="border border-gray-700 rounded-full p-2 hover:bg-blue-600 cursor-pointer" @click="abrirModal(rec)">
                                    <i class="pi pi-upload text-white"></i>
                                </div>
                            </div>
                        </td> -->
                    </tr>
                </tbody>
            </table>
            <!--<div class="flex justify-center items-center mt-4 mb-4 space-x-2">
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
            </div>-->
        </div>
    </div>

    <!-- Modal -->
     <!--<transition
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
        <form method="post" class="w-full">
            <div class="block mb-4">
                <label class="text-white font-light font-Outfit font-sm mb-4">Subir imagen</label>
                <input type="file" accept="image/*" capture="environment" @change="subirImagen" class="block w-full text-sm text-gray-200
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-Outfit
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"  />
            </div>
            <div class=" block mb-4">
                <label  class=" text-white font-light font-Outfit font-sm mb-4 ">Nombre del archivo</label>
                <input type="text" v-model="nombreFoto" placeholder="Escribe el nombre de la foto" class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
            </div>
            <div class="block mb-4">
                <label class="text-white font-light font-Outfit font-sm mb-4">Codigo Mesa</label>
                <input type="text" v-model="cod_mesa" placeholder="ingrese codigo mesa" class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
            </div>
            <div class="block mb-4">
                <label class="text-white font-light font-Outfit font-sm mb-2">Nro Mesa</label>
                <input type="text" v-model="nro_mesa" placeholder="ingrese nro mesa" class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
            </div>
            <div class="mb-4 grid grid-cols-2 gap-x-2">
                <div>
                    <label class="text-white font-light font-Outfit font-sm mb-2">Cantidad votos</label>
                    <input type="number" inputmode="numeric" pattern="[0-9]*" v-model="cant_votos"  class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                </div>
                <div class="">
                    <label class="text-white font-light font-Outfit font-sm mb-2">Votos nulos</label>
                    <input type="number" inputmode="numeric" pattern="[0-9]*" v-model="voto_nulo"  class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-x-2 mb-4">
                <div>
                    <label class="text-white font-light font-Outfit font-sm mb-2">Votos blancos</label>
                    <input type="number" inputmode="numeric" pattern="[0-9]*" v-model="voto_blanco"  class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                </div>
                <div class="">
                    <label class="text-white font-light font-Outfit font-sm mb-2">Votos validos</label>
                    <input type="number" inputmode="numeric" pattern="[0-9]*" v-model="voto_valido"  class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                </div>
            </div>
            <button type="button" @click="subirActa" class="bg-blue-600 text-white font-medium font-Outfit w-full p-2.5 rounded-lg mt-5">Registrar Acta</button>
        </form>
    </div>
        </div>
</transition>-->
    
</div>

</template>