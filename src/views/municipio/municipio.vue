<script>
import Sidebar from '../../layouts/sidebar.vue';

export default{
    components:{
        Sidebar
    }
}
</script>

<template>
<Sidebar>
<template #title>Municipios</template>

<router-view></router-view>
</Sidebar>


</template>