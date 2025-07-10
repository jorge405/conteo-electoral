<script>
import api from '../../services/apiServices.js';

export default{
    data(){
        return{
            listUser:null,
            listDepartamento:null,
            listMunicipio:null,
            selectedDepartamento:'',
            currentPage:1,
            itemsPerPage:5
        }
    },
    mounted(){
        this.getUsuarios();
        this.getDepartamentos();
    },
    methods:{
        goToPage(page){
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage= page;
            }
        },
        getMunicipios(){
            try {
                api.get(`lista_municipio/${this.selectedDepartamento==='La Paz' ? 'La-Paz': this.selectedDepartamento === 'Santa Cruz' ?'Santa-Cruz' : this.selectedDepartamento ==='Potosí' ? 'Potosi': this.selectedDepartamento}`)
                .then(response=>{
                    if (response.data.entry) {
                        console.log(response.data.entry);
                        this.listMunicipio=response.data.entry;
                    }
                })
            } catch (error) {
                console.log('error en el servidor al obtener los municipios', error);
            }
        },
        getDepartamentos(){ 
            try {
                api.get('lista_departamento')
                .then(response=>{
                    if (response.data.entry) {
                        this.listDepartamento= response.data.entry;
                        console.log(response.data.entry);
                    }else {
                        this.listDepartamento=[]
                    }
                })
            } catch (error) {
                console.log('error en el servidor al obtener los departamentos')
            }
        },
        getUsuarios(){
            try {
                api.get('lista_usuario')
                .then(response=>{
                    this.listUser=response.data.entry;
                    console.log(this.listUser);
                })
            } catch (error) {
                console.log('error en el servidor al obtener los usuarios')
            }
        }
    },
    computed:{
        paginatedMunicipios(){
            if (!this.listMunicipio) return [];
            const start = (this.currentPage -1) * this.itemsPerPage;
            return this.listMunicipio.slice(start,start + this.itemsPerPage);
        },
        totalPages(){
            if (!this.listMunicipio) return 1;
            return Math.ceil(this.listMunicipio.length / this.itemsPerPage);
        }
    },
    watch:{
        selectedDepartamento(newval){
            this.currentPage=1;
            this.getMunicipios();
        }
    }
    
}
</script>

<template>
<div class="flex flex-col items-center mx-5 mt-4 ">
    
    <div class=" w-full">
        <select v-model="selectedDepartamento" class=" bg-dark-900 h-11 w-full appearance-none rounded-lg   bg-none px-4 py-2.5 pr-11 text-sm  shadow-theme-xs  focus:border-gray-900 focus:outline-hidden focus:ring-3 focus:ring-gray-900/10 border border-gray-900 bg-gray-900 text-white/90 placeholder:text-white/30 focus:border-brand-800 mt-4">
            <option value="" selected disabled>Seleciona un departamento</option>
            <option v-for="item in listDepartamento" :key="item.departamento" :value="item.departamento" class="bg-gray-900 text-gray-400 roundedxl">
                            {{ item.departamento }}
            </option>
        </select>
    </div>
    <div class=" overflow-hidden rounded-xl border-gray-800 bg-white/[0.03] mt-4">
        <input type="text" placeholder="Buscar usuario" class=" bg-gray-400/70 p-2.5 font-Outfit rounded-lg mt-4 mb-2 mx-3">
        <div class=" max-w-sm overflow-x-visible custom-scrollbar">
            <table class=" min-w-sm">
                <thead>
                    <tr class=" border-b border-gray-700">
                       <th class="px-5 py-3 text-left w-3/11">
                        <p class=" font medium text-gray-500 text-sm text-theme-xs">Municipios</p>
                       </th>
                       <th class="px-5 py-3 text-left w-3/11">
                        <p class=" font medium text-gray-500 text-sm text-theme-xs">Asignar</p>
                       </th>
                       
                    </tr>   
                </thead>
                <tbody class=" divide-y divide-gray-700">
                    <tr v-for="(dep,index) in paginatedMunicipios" :key="index" class="border-t border-gray-800" >
                        <td class="px-5 py-4 ">
                            <div class=" flex items-center gap-3">
                                <div>
                                    <span class="block font-light text-sm font-Outfit  text-theme-sm text-white/90">{{ dep.municipio }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class=" flex items-center gap-3">
                                <div class=" border border-gray-700 rounded-full p-2 hover:bg-blue-600 cursor-pointer">
                                    <i class=" pi pi-check text-white"></i>
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
</div>
 <!-- mostrar esta tabla como modal -->
<div v-if="false" class="flex flex-col items-center mx-5 mt-4  ">
    <input type="text" placeholder="Buscar usuario" class=" bg-gray-400/70 w-full p-2.5 font-Outfit rounded-lg">
    <div class=" overflow-hidden rounded-xl border-gray-800 bg-white/[0.03] mt-4">
        <div class=" max-w-sm overflow-x-visible custom-scrollbar">
            <table class=" min-w-sm">
                <thead>
                    <tr class=" border-b border-gray-700">
                       <th class="px-5 py-3 text-left w-3/11">
                        <p class=" font medium text-gray-500 text-sm text-theme-xs">Usuario</p>
                       </th>
                       <th class="px-5 py-3 text-left w-3/11">
                        <p class=" font medium text-gray-500 text-sm text-theme-xs">Nombre completo</p>
                       </th>
                       <th class="px-5 py-3 text-left w-3/11">
                        <p class=" font medium text-gray-500 text-sm text-theme-xs">Tipo usuario</p>
                       </th>
                       <th class="px-5 py-3 text-left w-3/11">
                        <p class=" font medium text-gray-500 text-sm text-theme-xs">Asignar</p>
                       </th>
                    </tr>   
                </thead>
                <tbody class=" divide-y divide-gray-700">
                    <tr v-for="(user,index) in listUser" :key="index" class="border-t border-gray-800" >
                        <td class="px-5 py-4 ">
                            <div class=" flex items-center gap-3">
                                <div>
                                    <span class="block font-light text-sm font-Outfit  text-theme-sm text-white/90">{{ user.usuario }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class=" flex items-center gap-3">
                                <div>
                                    <span class="block font-light text-sm font-Outfit  text-theme-sm text-white/90">{{ user.nombre_completo }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class=" flex items-center gap-3">
                                <div>
                                    <span class="block font-light text-sm font-Outfit  text-theme-sm text-white/90">{{ user.tipo_us }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="px-5 py-4 ">
                            <div class=" flex items-center gap-3">
                                <div>
                                    <i class=" pi pi-check text-white"></i>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>    
    </div>
</div>

</template>