<script> 
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // for React, Vue and Svelt
import Sidebar from '../layouts/sidebar.vue';
import crearUsuario from '../components/usuarios/crearUsuario.vue';
export default{
    data(){

    },
    components:{
        Sidebar,
        crearUsuario
    }
}

</script>

<template>
<Sidebar>
    <template #title>Usuarios</template>
    <div class=" flex">
        <crearUsuario></crearUsuario>
    </div>
</Sidebar>
</template>
