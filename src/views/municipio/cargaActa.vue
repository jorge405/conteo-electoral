<script>
import Sidebar from '../../layouts/sidebar.vue';
import actas from '../../components/actas/actas.vue';
export default{
    components:{
        Sidebar,
        actas
    }
}
</script>

<template>
<Sidebar>
<template #title>Actas</template>
<div class=" flex flex-col">
    <actas></actas>
</div>
<router-view></router-view>
</Sidebar>


</template>