<template>
  <div class="login-container">
    <div class="card ">
      <div class="card-content">
        <span class="card-title">Login</span>
        <form @submit.prevent="login">
          <div class="input-field">
            <label for="email">E-mail:</label>
            <input id="email" type="text" v-model="user.email" required />
          </div>
          <div class="input-field">
            <label for="password">Senha:</label>
            <input id="password" type="password" v-model="user.password" required />
          </div>
          <button type="submit" class="btn waves-effect waves-light" :disabled="loading">
            {{ loading ? 'Loading...' : 'Entrar' }}
          </button>
          <p v-if="loginError" class="error-message">{{ loginError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import http from '@/services/http.js';
  import {onMounted, onUpdated, reactive, ref} from 'vue';
  import { useAuth } from '@/store/auth.js';
  import { useRouter } from "vue-router";

  const auth = useAuth();
  const router = useRouter();

  // const user = reactive({
  //   email: 'wandre1997@gmail.com',
  //   password: '@wandre9315'
  // });

  const loading = ref(false);
  const loginError = ref('');

  async function login() {
    if (loading.value) {
      return; // Impede que o usuário clique novamente enquanto estiver carregando
    }

    try {
      loading.value = true; // Ativa o estado de loading

      const { data } = await http.post('/login', user);
      auth.setToken(data.authorization.token);
      auth.setUser(data.user);

      router.push({ name: 'boasvindas' });

    } catch (error) {
      if (error.response && error.response.status === 401) {
        loginError.value = 'Credenciais inválidas. Por favor, verifique seu e-mail e senha.';
      } else {
        console.log('Erro durante a autenticação:', error);
        // Tratamento de outros erros
      }
    } finally {
      loading.value = false; // Desativa o estado de loading, independentemente do resultado
    }
  }

  onMounted(async () => {
    M.updateTextFields()
  });

  onUpdated(()=>{
    M.updateTextFields()
  })
</script>

<style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .card {
    width: 400px;
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

  .error-message {
    color: red;
    margin-top: 10px;
  }
</style>