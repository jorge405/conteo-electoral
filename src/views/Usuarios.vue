<script> 

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
        <template>
            <router-view></router-view>
        </template>
        
    </Sidebar>

</template>
