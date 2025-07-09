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
<asignar></asignar>
<router-view></router-view>
</sidebar>
</template>