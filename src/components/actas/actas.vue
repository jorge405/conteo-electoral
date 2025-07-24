<script>
import axios from 'axios'
import api from '../../services/apiServices.js';
import { Notyf } from 'notyf';
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js';

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
            modalVisible: false,
            nombreFoto:'',
            cod_mesa:'',
            nro_mesa:'',
            cant_votos:0,
            voto_blanco:0,
            voto_nulo:0,
            voto_valido:0,
            searchRecinto:'',
            searchActa:'',
            imageID:'',
            imageFile:'',
            municipio:'',
            showModal:false,
            showModalImagen:false,
            recintoSeleccionado:'',
            listActaRecinto:null,
            numActas:null

        }
    },
    mounted(){
        this.getPermiso();
        
    },
    methods:{
        
        abrirModal(rec) {
            
            this.modalVisible = true;
            const encryptRecinto= CryptoJS.AES.encrypt(rec.recinto,this.clave).toString()
            Cookies.set('recinto',encryptRecinto)
            // Puedes usar rec para asociar el modal al recinto si lo necesitas
        },
        cerrarModal() {
            this.modalVisible = false;
            this.nro_mesa='';
            this.cod_mesa='';
            this.voto_blanco=0;
            this.voto_valido=0;
            this.voto_nulo=0;
            this.cant_votos=0;
            this.imageID='';

        },
        abrirModal2(recinto){
            this.showModal=true
            try {
                api.post('lista_acta',{
                    tipo:'recinto',
                    nombre:recinto.recinto
                })
                .then(response=>{
                    this.listActaRecinto=response.data.data
                    this.recintoSeleccionado=recinto.recinto;
                    const numActas= response.data.data.length;
                    this.numActas= numActas;
                })
            } catch (error) {
                console.log('ha ocurrido un error al obtener las actas por recinto:', error)
            }
        },
        cerrarModal2(){
            this.showModal=false;
        },
        
        goToPage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage= page;
            }
        },
        goToPageActa(page){
            if (page >= 1 && page <= this.totalPagesActa) {
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
                        this.municipio=this.permiso[0].municipio
                        const encryptMunicipio= CryptoJS.AES.encrypt(this.permiso[0].municipio.replace(/ /g, '-'),this.clave).toString();
                        Cookies.set('municipio',encryptMunicipio)
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
        },
        archivoSeleccionado(event){
            const file= event.target.files[0];
            if (!file) return;
            this.imageFile= file;
            this.nombreFoto='';
            this.imageURL='';
        },
        async subirImagen(event) {
            const file= event.target.files[0]
        if (!file) return;

        try {
            const base64= await this.convertirABase64(file)
            const payload= {
                image:base64,
                user_id:1
            }

            const response= await axios.post('https://actas.mittril.com/api/upload',payload,{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            
            if (response.data.success===true) {
                this.imageID=response.data.id;
                notyf.success('imagen subida')
            }else{
                notyf.error('error al subir la imagen');
            }
        } catch (error) {
            console.log('ha ocurrido un error al subir la imagen:', error);
        }
        
        },
        convertirABase64(file) {
            return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
            });
        },
        subirActa(){
            if ( this.nro_mesa==='' || this.cod_mesa==='') {
                notyf.error('debe llenar todos los campos obligatoriamente')
                return ;
            }
            const decryptUser= CryptoJS.AES.decrypt(Cookies.get('usuario'),this.clave).toString(CryptoJS.enc.Utf8)
            const decryptMunicipio= CryptoJS.AES.decrypt(Cookies.get('municipio'),this.clave).toString(CryptoJS.enc.Utf8);
            const decryptRecinto= CryptoJS.AES.decrypt(Cookies.get('recinto'),this.clave).toString(CryptoJS.enc.Utf8);
            try {
               api.post('reg_acta',{
                usuario:decryptUser,
                nro:this.nro_mesa,
                codigo:this.cod_mesa,
                municipio:decryptMunicipio,
                recinto:decryptRecinto,
                acta:this.imageID,  // id que mandara el endpoint si sube la imagen para conectar con otra tabla
                cant_votos:this.cant_votos,
                votos_validos:this.voto_valido,
                votos_nulos:this.voto_nulo,
                votos_blancos:this.voto_blanco
               }) 
               .then(response=>{
                 if (response.data.status='creado') {
                    notyf.success('acta registrada correctamente')
                    this.nro_mesa='';
                    this.cod_mesa='';
                    this.cant_votos=0;
                    this.voto_valido=0;
                    this.voto_nulo=0;
                    this.voto_blanco=0;
                    this.nombreFoto=''
                 }else if(response.data.status==='error'){
                    notyf.error('no se pudo crear el acta vuelva a intentarlo');
                    this.nro_mesa='';
                    this.cod_mesa='';
                    this.cant_votos=0;
                    this.voto_valido=0;
                    this.voto_nulo=0;
                    this.voto_blanco=0;
                    this.nombreFoto='' 
                 }
               })
            } catch (error) {
                console.log('ha ocurrido un error al registrar acta', error)
            }
        },
        abrirModalImagen(idImagen){
            this.imagenUrl =`https://actas.mittril.com/api/image/${idImagen}`
            this.showModalImagen=true
        },
        cerrarModalImagen(){
            this.showModalImagen=false;
        }
    },
    computed:{
        paginatedRecinto(){
            // Filtra por texto de búsqueda antes de paginar
            let filtered = this.listRecinto
                ? this.listRecinto.filter(r =>
                    r.recinto.toLowerCase().includes(this.searchRecinto.toLowerCase())
                  )
                : [];
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return filtered.slice(start, start + this.itemsPerPage);
        },
        totalPages(){
            if (!this.listRecinto) return 1;
            // Calcula páginas según el filtro
            const filtered = this.listRecinto
                ? this.listRecinto.filter(r =>
                    r.recinto.toLowerCase().includes(this.searchRecinto.toLowerCase())
                  )
                : [];
            return Math.ceil(filtered.length / this.itemsPerPage);
        },
        paginatedActa(){
            let filtered= this.listActaRecinto ? this.listActaRecinto.filter(rec=> rec.nro.toLowerCase().includes(this.searchActa.toLocaleLowerCase()) || rec.codigo.toLocaleLowerCase().includes(this.searchActa.toLocaleLowerCase()) ) :[];
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return filtered.slice(start, start + this.itemsPerPage);
        },
        totalPagesActa(){
            let filtered= this.listActaRecinto ? this.listActaRecinto.filter(rec=> rec.nro.toLowerCase().includes(this.searchActa.toLocaleLowerCase()) || rec.codigo.toLocaleLowerCase().includes(this.searchActa.toLocaleLowerCase()) ) :[];
            return Math.ceil(filtered.length / this.itemsPerPage); 
        }
    },
    watch:{  
        permiso(newval){
            this.listaRecinto();
        },
        nombreFoto(newval){ 

        },
        cod_mesa(newval){

        },
        nro_mesa(newval){

        }
        
    }
}

</script>

<template>
<div class="flex flex-col items-center justify-center    xl:dark:min-h-screen lg:dark:min-h-screen w-full overflow-x-visible">
    <div class="overflow-hidden rounded-xl border-gray-800 bg-white/90 dark:bg-white/[0.03] sm:mt-4 mt-4 md:w-2xl mx-auto">
        
            <input type="text" v-model="searchRecinto" placeholder="Buscar recinto" class="bg-gray-300/70 p-2.5 font-Outfit rounded-lg mt-4 mb-2 mx-3">
            <span class=" block font-medium font-Outfit text-slate-800 sm:text-sm lg:text-lg dark:text-white ml-4 md:ml-4 lg:ml-4 xl:ml-4">Municipio: <p class=" inline text-blue-700 font-medium font-Outfit sm:text-sm lg:text-lg">{{municipio}}</p></span>
        
        <div v-if="!listRecinto" class="flex justify-center items-center py-10">
            <span class="text-slate-950 dark:text-white text-lg font-Outfit"> Cargando recintos...</span>
        </div>
        <div v-else class="max-w-sm  overflow-x-visible custom-scrollbar  ">
            <table class="min-w-sm md:min-w-3xl ">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">Recintos</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class="font-medium text-gray-500 text-sm text-theme-xs">Subir acta</p>
                        </th>
                        <th class="px-5 py-3 text-left w-3/11">
                            <p class=" font-medium text-gray-500 text-sm text-theme-xs">Actas</p>
                        </th>

                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                    <tr v-for="(rec,index) in paginatedRecinto" :key="index" class="border-t border-gray-800">
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div>
                                    <span class="block font-normal text-sm font-Outfit text-theme-sm text-slate-950 dark:text-white/90">{{ rec.recinto }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div class="border border-orange-700 bg-orange-600 dark:border-gray-700 dark:bg-gray-800 rounded-full p-2 dark:hover:bg-blue-600 hover:bg-orange-500 cursor-pointer" @click="abrirModal(rec)">
                                    <i class="pi pi-upload text-white dark:text-white"></i>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class="flex items-center gap-3">
                                <div class="border border-orange-700 bg-orange-600 dark:border-gray-700 dark:bg-gray-800 rounded-full p-1 dark:hover:bg-blue-600 hover:bg-orange-500 cursor-pointer space-x-1" @click="abrirModal2(rec)">
                                    <i class="pi pi-file text-white dark:text-white"></i>
                                    <span class=" text-white font-medium font-Outfit text-sm">{{ numActas }}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="flex  justify-center items-center mt-4 mb-4 space-x-2 ">
                <button
                    @click="goToPage(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="px-3 py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                >
                    Anterior
                </button>
                <span class="text-white/80 bg-gray-900 px-3 py-1 rounded">
                    Página {{ currentPage }} de {{ totalPages }}
                </span>
                <button
                    @click="goToPage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
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
    <div class="bg-white/90 dark:bg-gray-900 flex flex-col items-center justify-center mt-5 mx-4 rounded-lg py-10 px-5 w-full max-w-md relative">
        <!-- Icono X para cerrar -->
        <button type="button" @click="cerrarModal" class="absolute top-4 right-4 text-slate-900 dark:text-gray-300 hover:text-red-500 text-2xl transition">
            <i class="pi pi-times"></i>
        </button>
        <form method="post" class="w-full">
            <div class="block mb-4">
                <label class="text-slate-900 dark:text-white font-normal font-Outfit font-sm mb-4">Subir imagen</label>
                <input type="file" accept="image/*" capture="environment" @change="subirImagen" class="block w-full text-sm text-white/90 dark:text-gray-200
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-Outfit
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"  />
            </div>
            <div class=" block mb-4">
                <label  class=" text-slate-900 dark:text-white font-normal font-Outfit font-sm mb-4 ">Nombre del archivo</label>
                <input type="text" v-model="nombreFoto"  placeholder="Escribe el nombre de la foto" class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                
            </div>
            <div class="block mb-4">
                <label class="text-slate-900 dark:text-white font-normal font-Outfit font-sm mb-4">Codigo Mesa</label>
                <input type="text" v-model="cod_mesa" placeholder="ingrese codigo mesa" class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                <span v-if="cod_mesa===''" inputmode="numeric" pattern="[0-9]*" class=" text-red-600 text-sm font-Outfit"> Campo requerido!</span>
            </div>
            <div class="block mb-4">
                <label class=" text-slate-900 dark:text-white font-normal font-Outfit font-sm mb-2">Nro Mesa</label>
                <input type="text" v-model="nro_mesa" placeholder="ingrese nro mesa" class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                <span v-if="nro_mesa===''" inputmode="numeric" pattern="[0-9]*" class=" text-red-600 text-sm font-Outfit"> Campo requerido!</span>
            </div>
            <div class="mb-4 grid grid-cols-2 gap-x-2">
                <div>
                    <label class="text-slate-900 dark:text-white font-normal font-Outfit font-sm mb-2">Cantidad votos</label>
                    <input type="number" inputmode="numeric" pattern="[0-9]*" v-model="cant_votos"  class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                </div>
                <div class="">
                    <label class="text-slate-900 dark:text-white font-normal font-Outfit font-sm mb-2">Votos nulos</label>
                    <input type="number" inputmode="numeric" pattern="[0-9]*" v-model="voto_nulo"  class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-x-2 mb-4">
                <div>
                    <label class="text-slate-900 dark:text-white font-normal font-Outfit font-sm mb-2">Votos blancos</label>
                    <input type="number" inputmode="numeric" pattern="[0-9]*" v-model="voto_blanco"  class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                </div>
                <div class="">
                    <label class="text-slate-900 dark:text-white font-normal font-Outfit font-sm mb-2">Votos validos</label>
                    <input type="number" inputmode="numeric" pattern="[0-9]*" v-model="voto_valido"  class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
                </div>
            </div>
            <button type="button" @click="subirActa" class="bg-blue-600 text-white font-medium font-Outfit w-full p-2.5 rounded-lg mt-3">Registrar Acta</button>
        </form>
    </div>
        </div>
</transition>

 <!-- mostrar esta tabla como modal tabla por recinto -->
<transition name="fade">
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-center justify-center  bg-white/10 backdrop-blur-sm transition-all duration-300"
  >
    <div class="bg-gray-400/70 dark:bg-gray-900 rounded-xl p-6 shadow-lg w-full max-w-3xl relative scale-95 opacity-0 animate-modalIn">
      <button @click="cerrarModal2" class="absolute top-2 right-2 text-slate-950 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white text-2xl">&times;</button>
      <h2 class="text-slate-800 dark:text-white text-lg mb-4 font-bold">
        Recinto: <span class="text-blue-600">{{ recintoSeleccionado }}</span>
      </h2>
      <input type="text" v-model="searchActa" placeholder="Buscar acta" class=" bg-gray-400/70 w-full p-2.5 font-Outfit rounded-lg mb-4 focus:outline-gray-400/90 dark:focus:outline-slate-900">
      <div class="overflow-hidden rounded-xl border-gray-800 bg-white/[0.03]">
        <div class="max-w-sm overflow-x-visible custom-scrollbar">
          <table class="min-w-sm md:min-w-xl">
                    <thead>
                        <tr class="border-b border-gray-700">
                            
                            <th class="px-5 py-3 text-left w-3/11">
                                <p class="font medium text-slate-800 dark:text-gray-500 text-sm text-theme-xs">Nro Mesa</p>
                            </th>
                            <th class="px-5 py-3 text-left w-3/11">
                                <p class="font medium text-slate-800 dark:text-gray-500 text-sm text-theme-xs">Codigo Mesa</p>
                            </th>
                            <th class="px-5 py-3 text-left w-3/11">
                                <p class="font medium text-slate-800 dark:text-gray-500 text-sm text-theme-xs">Municipio</p>
                            </th>
                            <th class="px-5 py-3 text-left w-3/11">
                                <p class="font medium text-slate-800 dark:text-gray-500 text-sm text-theme-xs">Cantidad Votos</p>
                            </th> 
                            <th class="px-5 py-3 text-left w-3/11">
                                <p class="font medium text-slate-800 dark:text-gray-500 text-sm text-theme-xs">Votos Validos</p>
                            </th>
                            <th class="px-5 py-3 text-left w-3/11">
                                <p class="font medium text-slate-800 dark:text-gray-500 text-sm text-theme-xs">Votos Nulos</p>
                            </th>
                            <th class="px-5 py-3 text-left w-3/11">
                                <p class="font medium text-slate-800 dark:text-gray-500 text-sm text-theme-xs">Votos Blanco</p>
                            </th>
                            <th class="px-5 py-3 text-left w-3/11">
                                <p class="font medium text-slate-800 dark:text-gray-500 text-sm text-theme-xs">Imagen</p>
                            </th>
                        </tr>    
                    </thead>
                    <tbody class="divide-y divide-gray-700">
                        <tr v-for="(ac,index) in paginatedActa" :key="index" class="border-t border-gray-800" >
                            
                            <td class="px-5 py-4 ">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <span class="block font-normal text-sm font-Outfit text-theme-sm text-slate-800 dark:text-white/90">{{ ac.nro }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-4 ">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <span class="block font-normal text-sm font-Outfit text-theme-sm text-slate-800 dark:text-white/90">{{ ac.codigo }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-4 ">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <span class="block font-normal text-sm font-Outfit text-theme-sm text-slate-800 dark:text-white/90">{{ ac.municipio }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-4 ">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <span class="block font-normal text-sm font-Outfit text-theme-sm text-slate-800 dark:text-white/90">{{ ac.cant_votos }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-4 ">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <span class="block font-normal text-sm font-Outfit text-theme-sm text-slate-800 dark:text-white/90">{{ ac.votos_validos}}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-4 ">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <span class="block font-normal text-sm font-Outfit text-theme-sm text-slate-800 dark:text-white/90">{{ ac.votos_nulos }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-4 ">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <span class="block font-normal text-sm font-Outfit text-theme-sm text-slate-800 dark:text-white/90">{{ ac.votos_blancos }}</span>
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
        </div>    
      </div>
        <div class="flex justify-center items-center mt-4 mb-4 space-x-2">
                    <button
                        @click="goToPageActa(currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="px-3 py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span class="text-white/80 bg-gray-900 px-3 py-1 rounded">
                        Página {{ currentPage }} de {{ totalPagesActa }}
                    </span>
                    <button
                        @click="goToPageActa(currentPage + 1)"
                        :disabled="currentPage === totalPagesActa"
                        class="px-3 py-1 rounded bg-gray-800 text-white/80 hover:bg-gray-700 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
            </div> 
    </div>
  </div> 
</transition>
<transition
     enter-active-class="transition duration-300 ease-out"
     enter-from-class="opacity-0 scale-95"
     enter-to-class=" opacity-100 scale-100"
     leave-active-class=" transition duration-200 ease-in"
     leave-from-class=" opacity-100 scale-100"
     leave-to-class=" opacity-0 scale-95">
        <div v-if="showModalImagen" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div class="bg-white/10 backdrop-blur-sm dark:bg-gray-900 flex flex-col items-center justify-center mt-5 mx-4 rounded-lg py-10 px-5 w-full max-w-md relative">
        
        <button type="button" @click="cerrarModalImagen" class="absolute top-4 right-4 text-gray-300 hover:text-red-500 text-2xl transition">
            <i class="pi pi-times"></i>
        </button>
        <img :src="imagenUrl" alt="Imagen acta" class="rounded-lg max-h-[70vh] object-contain">    
    </div>
        </div>
</transition>    
</div>
</template>


<style scope>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95);}
  to { opacity: 1; transform: scale(1);}
}
.animate-modalIn {
  animation: modalIn 0.3s ease;
  opacity: 1 !important;
  transform: scale(1) !important;
}

</style>