<script>
import Sidebar from '../../layouts/sidebar.vue';
import ListaActa from '../../components/actas/listaActa.vue'

export default{
    components:{
        Sidebar,
        ListaActa
    }
}
</script>

<template>
<Sidebar>
<template #title>Lista Actas</template>
<div class=" flex flex-col">
<ListaActa></ListaActa>
</div>

<router-view></router-view>    
</Sidebar>

</template>