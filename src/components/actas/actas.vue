<script>
import api from '../../services/apiServices.js';
import { Notyf } from 'notyf';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js';
import Tesseract from 'tesseract.js';
const notyf= new Notyf()

export default{
    data(){
        return{
            listRecinto:null,
            clave:'conteoElectoralmittril',
            permiso:null,
            selectedRecinto:'',
            currentPage:1,
            itemsPerPage:8,
            textoExtraido:'',
            procesando:false,
            datosExtraidos:{
                nombre:'',
                cedula:'',
                direccion:'',
                telefono:''
            }
        }
    },
    mounted(){
        this.getPermiso();
        
    },
    methods:{
        async procesarImagen(event){
            const file= event.target.files[0];
            if (!file) return
            const image= URL.createObjectURL(file);
            this.procesando=true;
            this.textoExtraido='';

            this.datosExtraidos={
                nombre:'',
                cedula:'',
                direccion:'',
                telefono:''
            }
            try {
                const result= await Tesseract.recognize(image, 'spa',{
                    logger: m=> console.log(m)
                })

                this.textoExtraido = result.data.text;
                const texto= result.data.text;
                // extraer campos con regex 
                this.datosExtraidos.nombre= texto.match(/Nombre:\s*(.+)/i)?.[1]?.trim() || ''
                this.datosExtraidos.cedula = texto.match(/C[ée]dula:\s*(\d+)/i)?.[1]?.trim() || ''
                this.datosExtraidos.direccion = texto.match(/Dirección:\s*(.+)/i)?.[1]?.trim() || ''
                this.datosExtraidos.telefono = texto.match(/Tel[eé]fono:\s*(\d+)/i)?.[1]?.trim() || ''

            } catch (error) {
                this.textoExtraido=   'Error al procesar la imagen'
                console.error(err)
            } finally{
                this.procesando=false;
            }
        },
        goToPage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage= page;
            }
        },
        getPermiso(){
            const decryptUsuario=CryptoJS.AES.decrypt(Cookies.get('usuario'),this.clave).toString(CryptoJS.enc.Utf8);
            
            try {
                api.get(`lista_permiso/${decryptUsuario}`)
                .then(response=>{
                    if (!response.data.entry==[]) {
                        this.permiso=response.data.entry;
                        
                    }else{
                        return []
                    }
                })
            } catch (error) {
                console.log('ha ocurrido un error al obtener los permisos: ',error);
            } 
        },
        listaRecinto(){
            //if(!this.permiso || !this.permiso.municipio) return;
            const municipioFormateado= this.permiso[0].municipio.replace(/ /g, '-');
            console.log(municipioFormateado)
            try {
                api.get(`lista_recinto/${municipioFormateado}`)
                .then(response=>{
                    if (!response.data.entry==[]) {
                        this.listRecinto=response.data.entry;
                        console.log(response.data.entry)
                    }
                })
            } catch (error) {
                console.log('ha ocurrido un error al obtener los recintos: ',error)
            } 
        }
    },
    computed:{
        paginatedRecinto(){
            if (!this.listRecinto) return [];
            const start = (this.currentPage -1) * this.itemsPerPage;
            return this.listRecinto.slice(start,start + this.itemsPerPage);
        },
        totalPages(){
            if (!this.listRecinto) return 1;
            return Math.ceil(this.listRecinto.length / this.itemsPerPage);
        }
    },
    watch:{
        permiso(newval){
            this.listaRecinto();
        }
    }
}

</script>

<template>

<div class="flex flex-col items-center mx-5 mt-4  ">
    <div class=" overflow-hidden rounded-xl border-gray-800 bg-white/[0.03] mt-4">
        <input type="text" placeholder="Buscar recinto" class=" bg-gray-400/70 p-2.5 font-Outfit rounded-lg mt-4 mb-2 mx-3">
        <div class=" max-w-sm overflow-x-visible custom-scrollbar">
            <table class=" min-w-sm">
                <thead>
                    <tr class=" border-b border-gray-700">
                       <th class="px-5 py-3 text-left w-3/11">
                        <p class=" font medium text-gray-500 text-sm text-theme-xs">Recintos</p>
                       </th>
                       <th class="px-5 py-3 text-left w-3/11">
                        <p class=" font medium text-gray-500 text-sm text-theme-xs">Subir acta</p>
                       </th>
                       
                    </tr>   
                </thead>
                <tbody class=" divide-y divide-gray-700">
                    <tr v-for="(rec,index) in paginatedRecinto" :key="index" class="border-t border-gray-800" >
                        <td class="px-5 py-4 ">
                            <div class=" flex items-center gap-3">
                                <div>
                                    <span class="block font-light text-sm font-Outfit  text-theme-sm text-white/90">{{ rec.recinto }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class=" flex items-center gap-3">
                                <div  class=" border border-gray-700 rounded-full p-2 hover:bg-blue-600 cursor-pointer">
                                    <input type="file" accept="image/" capture="environment" @change="procesarImagen"><i class=" pi pi-upload text-white"></i>
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
    <div v-if="procesando" class="mt-4 text-yellow-600">Procesando imagen...</div>

    <div v-if="textoExtraido" class="mt-4">
      <h3 class="font-semibold mb-2">Texto completo:</h3>
      <pre class="bg-gray-100 p-2">{{ textoExtraido }}</pre>
    </div>

    <div v-if="datosExtraidos.nombre" class="mt-4">
      <h3 class="font-semibold mb-2">Datos extraídos:</h3>
      <ul class="bg-green-50 p-3 rounded">
        <li><strong>Nombre:</strong> {{ datosExtraidos.nombre }}</li>
        <li><strong>Cédula:</strong> {{ datosExtraidos.cedula }}</li>
        <li><strong>Dirección:</strong> {{ datosExtraidos.direccion }}</li>
        <li><strong>Teléfono:</strong> {{ datosExtraidos.telefono }}</li>
      </ul>
    </div>
</div>    

    
</template>