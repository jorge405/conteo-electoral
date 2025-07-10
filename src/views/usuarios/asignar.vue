<script>
import asignar from '../../components/usuarios/asignar.vue';
import sidebar from '@/layouts/sidebar.vue';

export default{
    components:{
        asignar,
        sidebar
    }
}
</script>

<template>
<sidebar>
<template #title>Lista de Municipios</template>
<div class=" flex flex-col">
    <asignar></asignar>
</div>
<router-view></router-view>
</sidebar>
</template>