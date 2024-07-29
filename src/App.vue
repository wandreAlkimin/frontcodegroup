<template>



  <div class="navbar-fixed">

    <nav class="indigo darken-4 "  >
      <div class="nav-wrapper" style="margin-right: 20px; margin-left: 20px; ">
        <router-link to="/" class="brand-logo">Wandre Alkimin</router-link>

        <!-- Adicione o ícone do menu para dispositivos pequenos -->
        <a href="#" data-target="mobile-nav" class="sidenav-trigger"><i class="mdi mdi-menu"></i></a>

        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><router-link to="/cadastros">Cadastros</router-link></li>
          <li><router-link to="/cadastro">Cadastros Adicionar</router-link></li>
          <li>
            <template v-if="isAutenticado()">
              <div>
                Olá {{ auth.getUser() }}
                <button class="btn waves-effect waves-light indigo valign-wrapper tooltipped" @click="logout" :disabled="loading"
                        data-position="bottom" data-tooltip="Sair do Sistema" >
                  <i class="mdi mdi-exit-to-app center" style="margin-top: -15px"></i>
                </button>
              </div>
            </template>
            <template v-else>
              Olá visitante
            </template>
          </li>
        </ul>
      </div>
    </nav>
  </div>



  <!-- Sidenav para dispositivos pequenos -->
  <ul class="sidenav" id="mobile-nav">
    <li v-if="isAutenticado()">
      <template v-if="!loading">
        <div class="center-align">
          <button class="btn waves-effect waves-light indigo" @click="logout" :disabled="loading">
           Logout <i class="mdi mdi-exit-to-app right"></i>
          </button>
        </div>
        <div class="center-align">
          Olá {{ auth.getUser() }}
        </div>
      </template>
    </li>
    <li v-else>
      <div class="center-align">
        Olá visitante
      </div>
    </li>
    <li class="center"><router-link :to="{ name: 'boasvindas' }">Home</router-link></li>

  </ul>

  <div class="row">

    <!-- Barra lateral para telas médias e grandes -->
    <template v-if="isAutenticado()">
      <div class="col s12 m2 l2 hide-on-small-only" style="">

          <ul id="slide-out" class="sidenav sidenav-fixed" style="width: 17%!important;margin-top: 65px">
            <li class="center"><router-link :to="{ name: 'boasvindas' }">Home</router-link></li>

          </ul>
      </div>
    </template>

    <template v-else>
      <div class="col m1 l1" style=""></div>
    </template>

    <div class="col s12 m12 l10">

      <div class="container-fluid">
        <div class="row">
          <!-- Conteúdo principal -->
          <router-view />
        </div>
      </div>
    </div>
  </div>

  <VueToastify v-if="show" />
</template>

<style lang="scss">
  @import '@/assets/css/materialize.scss';
  /* Adicione seus estilos personalizados abaixo, se necessário */
  .custonParagrafomenu {
    margin-top: -10px;
    margin-bottom: -10px;
  }

</style>

<script setup>
  import { toast } from 'vue3-toastify';
  import { useAuth } from '@/store/auth.js';
  import { useRouter } from 'vue-router';
  import { ref, onMounted, onUpdated } from 'vue';

  const auth = useAuth();
  const router = useRouter();
  const loading = ref(false);

  const initializeSidenav = () => {
    const sidenav = M.Sidenav.init(document.querySelectorAll('.sidenav'));
    const collapsibles = M.Collapsible.init(document.querySelectorAll('.collapsible'));
    const tooltips = M.Tooltip.init(document.querySelectorAll('.tooltipped'));

    return { sidenav, collapsibles, tooltips };
  };

  onMounted(initializeSidenav);
  onUpdated(initializeSidenav);

  function isAutenticado() {
    if(auth.isAuthenticate()){
      return true;
    }else{
      return false;
    }
  }

  const logout = async () => {

    if (loading.value) return;

    try {
      loading.value = true;
      await auth.clear();

      router.push({ name: 'login' });

    } finally {
      loading.value = false;
    }
  };
</script>
