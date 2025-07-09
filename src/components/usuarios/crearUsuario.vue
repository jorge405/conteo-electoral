<script>


</script>

<template>
<div class=" bg-tranparent flex flex-col items-center justify-center mt-5 mx-4 rounded-lg py-10 px-5">
    <form method="post">
        <div class="block mb-4">
            <label for="" class=" text-white font-light font-Outfit font-sm mb-4">Usuario</label>
            <input type="text" placeholder="ingresar un usuario" class=" bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
        </div>
        <div class=" block mb-4">
            <label for="" class="text-white font-light font-Outfit font-sm mb-4">Password</label>
            <input type="text" placeholder="ingresar un usuario" class=" bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray-400 p-2">
        </div>
        <div class=" block mb-4">
            <label for="" class="text-white font-light font-Outfit  font-sm mb-2">Nombre completo</label>
            <input type="text" placeholder="ingresar un usuario" class="bg-gray-300/70 font-Outfit text-sm rounded-lg w-full border border-gray400 p-2">
        </div>
        <div class=" block mb-4">
            <label for="" class=" text-white font-light font-Outfit font-sm mb-2">Tipo</label>
            <select class="bg-gray-300 h-11 w-full appearance-none rounded-lg border border-gray-300/70 font-light font-Outfit  px-4 p-2 pr-11 text-sm text-gray-800/70 shadow-theme-xs placeholder:text-gray-400/70 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 mt-4  ">
                <option value="" class="bg-gray-300/70 font-light font-Outfit font-sm rounded-lg" selected disabled>selecciona tipo</option>
                <option value="ADMINISTRADOR" class="bg-gray-300/70 font-light font-Outfit rounded-lg">ADMINISTRADOR</option>
                <option value="MUNICIPIO" class="bg-gray-300/70 font-light font-Outfit rounded-lg">MUNICIPIO</option>
            </select>
        </div>
        <button class=" bg-blue-600 text-white font-medium font-Outfit w-full p-2.5 rounded-lg mt-5">Crear Usuario</button>
    </form>
</div>

</template>