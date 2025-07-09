<script>
import crearUsuario from '../../components/usuarios/crearUsuario.vue';
import sidebar from '@/layouts/sidebar.vue';
export default{
    components:{
        crearUsuario,
        sidebar
    }
}
</script>

<template>
    <sidebar>
    <template #title>Usuarios</template>

    <div class="flex">
        <crearUsuario></crearUsuario>
    </div>
    <router-view></router-view>
    </sidebar>
</template>