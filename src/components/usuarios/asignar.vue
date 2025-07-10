<script>
import api from '../../services/apiServices.js';

export default{
    data(){
        return{
            listUser:null
        }
    },
    mounted(){
        this.getUsuarios();
    },
    methods:{
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
    }
    
}
</script>

<template>

<div class="flex flex-col items-center mx-5 mt-4 ">
    <input type="text" placeholder="Buscar usuario" class=" bg-gray-400/70 w-full p-2.5 font-Outfit rounded-lg">
    <div class=" overflow-hidden rounded-xl border-gray-800 bg-white/[0.03] mt-4">
        <div class=" max-w-full overflow-x-visible custom-scrollbar">
            <table class=" min-w-full">
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
                    </tr>
                </tbody>
            </table>
        </div>    
    </div>
</div>


</template>