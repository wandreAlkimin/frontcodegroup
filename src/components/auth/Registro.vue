<!-- src/components/Register.vue -->
<template>
    <div class="register-container">
        <div class="card">
            <div class="card-content">
                <span class="card-title">Registro</span>
                <form @submit.prevent="register">
                    <div class="input-field">
                        <input id="name" type="text" v-model="name" required>
                        <label for="name">Nome</label>
                    </div>
                    <div class="input-field">
                        <input id="email" type="email" v-model="email" required>
                        <label for="email">E-mail</label>
                    </div>
                    <div class="input-field">
                        <input id="birthdate" type="date" v-model="birthdate" required>
                        <label for="birthdate">Data de Nascimento</label>
                    </div>
                    <div class="input-field">
                        <input id="cpf" type="text" v-model="cpf" required>
                        <label for="cpf">CPF</label>
                    </div>
                    <div class="input-field">
                        <input id="password" type="password" v-model="password" required>
                        <label for="password">Senha</label>
                    </div>
                    <div class="input-field">
                        <input id="confirmPassword" type="password" v-model="confirmPassword" required>
                        <label for="confirmPassword">Confirmar Senha</label>
                    </div>
                    <button type="submit" class="btn waves-effect waves-light">Registrar</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                name: '',
                email: '',
                birthdate: '',
                cpf: '',
                password: '',
                confirmPassword: ''
            };
        },
        methods: {
            register() {
                // Aqui você pode implementar a lógica de registro
                // Geralmente, você faria uma chamada para um servidor para criar uma conta
                console.log('Tentativa de registro:', {
                    name: this.name,
                    email: this.email,
                    birthdate: this.birthdate,
                    cpf: this.cpf,
                    password: this.password,
                    confirmPassword: this.confirmPassword
                });
            }
        }
    };
</script>

<style scoped>
    .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .card {
        width: 300px;
    }

    form {
        margin-top: 20px;
    }
</style>