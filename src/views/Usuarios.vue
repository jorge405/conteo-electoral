<script> 
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // for React, Vue and Svelt
import Sidebar from '../layouts/sidebar.vue';

export default{
    data(){

    },
    components:{
        Sidebar
    }
}

</script>

<template>
<Sidebar>
    <template #title>Usuarios</template>
    <span>body</span>
</Sidebar>
</template>
