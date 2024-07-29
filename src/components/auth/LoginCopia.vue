<!-- Login.vue -->
<template>
  <div class="login-container">
    <div class="card">
      <div class="card-content">
        <span class="card-title">Login</span>
        <form  @submit="handleLogin">
          <div class="input-field">
            <label for="cpf">CPF:</label>
            <input id="cpf" v-mask="'###.###.###-##'" type="text" v-model="cpf" />
          </div>
          <div class="input-field">
            <label for="password">Senha:</label>
            <input id="password" type="password" v-model="password" required />
          </div>
          <button type="submit" class="btn waves-effect waves-light">Entrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        cpf: '',
        password: '',
      };
    },
    methods: {
      login() {
        // Lógica de autenticação
        const cleanedCPF = this.cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
        console.log(`Tentativa de login com CPF: ${cleanedCPF} e senha: ${this.password}`);
      },
    },
  };
</script>

<style scoped>
  .login-container {
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

  .input-field {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }
</style>
