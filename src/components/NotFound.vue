<template>
    <div class="container">
        <div class="row">
            <div class="col s12 center-align">
                <h2 class="red-text text-darken-2">Erro 404</h2>
                <p class="flow-text">Ops! Parece que a página que você está procurando não foi encontrada.</p>
                <router-link :to="{ name: 'boasvindas' }" class="btn indigo">Voltar para a Página Inicial</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
</script>

<style scoped>
    .container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .mdi {
        font-size: 72px; /* Tamanho do ícone */
    }

    .btn {
        margin-top: 20px;
    }

    .red-text {
        color: #f44336; /* Cor vermelha */
    }

    .indigo {
        background-color: #3f51b5; /* Cor azul indigo */
    }

    .router-link {
        color: #26a69a;
        text-decoration: underline;
    }
</style>
