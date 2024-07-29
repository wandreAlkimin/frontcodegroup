<template>
    <div class="">
        <br>
        <div class="row">
            <div class="col s12 m12 l12" style="margin-bottom: 50px;margin-top: 10px">
                <a href="/cadastro" class="btn btn-primary">Adicionar um novo usuario</a>
            </div>


            <div class=" col s12 m6 l6">
                <div class="input-field col s12 m19 l9" >
                    <input
                            type="text"
                            class="validate"
                            placeholder="Pesquise pelo nome ou email"
                            v-model="searchNomeEmail"
                    />
                </div>
                <button
                        class="btn blue"
                        type="button"
                        @click="clickSearchNomeEmail"
                        style="margin-top: 20px;"
                >
                    Pesquisar
                </button>
            </div>

            <!-- Seção de Pesquisa por Intervalo de Anos -->
            <div class="  col s12 m6 l6">

                <p style="margin-top: -5px; margin-left: 10px">Pesquise por um intervalo de ano</p>
                <div class="input-field col s12 m4 l4" style="margin-top: -20px">

                    <input
                            type="number"
                            class="validate"
                            v-model="searchDataInicio"
                            placeholder="Ano de Início"
                            @input="inputValidaAno($event, 'start')"
                    />
                </div>
                <div class="input-field col s12 m4 l4" style="margin-top: -20px">
                    <input
                            type="number"
                            class="validate"
                            v-model="searchDataFim"
                            placeholder="Ano de Término"
                            @input="inputValidaAno($event, 'end')"
                    />

                </div>
                <button
                        class="btn blue"
                        type="button"
                        @click="clickSearchDataNascimento"
                        style="margin-top: -20px;"
                >
                    Pesquisar
                </button>
            </div>


            <br>
            <br>

            <div class="input-group-append  col s12 m12 l12" v-if="search == true" style="margin-top: 25px;margin-bottom: 25px">
                <button class="btn btn-outline-secondary" type="button"
                        @click="limparSearch"
                >
                    Limpar busca
                </button>
            </div>





            <table class="highlight striped">
                <thead>
                <tr>
                    <th><button @click="sortTable('id')" data-tooltip="Ordenar pelo ID" class="btn" >ID </button></th>
                    <th>Foto</th>
                    <th><button @click="sortTable('nome')" data-tooltip="Ordenar pelo nome" class="btn">Nome</button></th>
                    <th>Email</th>
                    <th><button @click="sortTable('dt_nascimento')" data-tooltip="Ordenar pela data de nascimento" class="btn">Data de Nascimento</button></th>
                    <th>Telefone</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(cadastro, index) in cadastros" :key="index">
                    <td>{{ cadastro.id }}</td>
                    <td>
                        <img :src="'http://localhost/assets/img/' + cadastro.perfil_img"
                             alt="User Icon"
                             class="responsive-img circle"
                             style="width: 50px; height: 50px;">
                    </td>
                    <td>{{ cadastro.nome }}</td>
                    <td>{{ cadastro.email }}</td>
                    <td>{{ formataDateIdade(cadastro.dt_nascimento) }}</td>
                    <td><input v-model="cadastro.telefone" v-mask="'(##) #####-####'" disabled type="text" /></td>
                    <td>
                        <router-link :to="'/cadastro/' + cadastro.id" class="btn blue">Editar</router-link>
                        <button @click="openModalDelete(cadastro.id)" class="btn red modal-trigger" data-target="confirmModal">Excluir</button>
                    </td>
                </tr>
                </tbody>
            </table>

        </div>
        <br>



    </div>

    <div id="confirmModal" class="modal">
        <div class="modal-content">
            <h4>Confirmação</h4>
            <p>Tem certeza que deseja excluir este cadastro?</p>
        </div>
        <div class="modal-footer">
            <button @click="confirmaDeleteCadastro" class="modal-close waves-effect waves-green btn-flat">Sim</button>
            <button class="modal-close waves-effect waves-red btn-flat">Não</button>
        </div>
    </div>




</template>

<script>
    import DataService from "../../services/DataService";

    export default {
        name: "cadastros-list",
        data() {
            return {
                deleteId: null,
                dataModel: [],
                cadastros: [],
                searchNomeEmail :null,
                search: false,
                searchDataInicio: null,
                searchDataFim: null,
                sortColumn: '',
                sortDirection: 'asc'
            };
        },

        methods: {
            sortCadastros() {
                // Cria uma cópia da lista de cadastros para evitar mutação direta
                const cadastrosCopy = [...this.cadastros];

                // Define o modificador de acordo com a direção da ordenação
                const modifier = this.sortDirection === 'desc' ? -1 : 1;

                // Função de comparação para a ordenação
                const compare = (a, b) => {
                    // Obtém os valores das propriedades a serem comparadas
                    const valueA = a[this.sortColumn];
                    const valueB = b[this.sortColumn];

                    // Caso os valores sejam números
                    if (!isNaN(valueA) && !isNaN(valueB)) {
                        return (parseFloat(valueA) - parseFloat(valueB)) * modifier;
                    }

                    // Caso os valores sejam strings
                    if (typeof valueA === 'string' && typeof valueB === 'string') {
                        return valueA.localeCompare(valueB) * modifier;
                    }

                    return 0;
                };

                // Retorna a lista ordenada
                return cadastrosCopy.sort(compare);
            },

            limparSearch(){
                this.search = false;
                this.searchDataInicio = null;
                this.searchDataFim = null;
                this.getCadastros();
            },

            sortTable(column) {
                if (this.sortColumn === column) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = column;
                    this.sortDirection = 'asc';
                }

                // Atualiza a lista de cadastros ordenada
                this.cadastros = this.sortCadastros();
            },

            getCadastros() {

                DataService.getAllCadastros(this.$route.query.page)
                    .then(response => {
                        this.cadastros = null;
                        console.log(response.data.data);
                        this.cadastros = response.data.data;
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },

            clickSearchDataNascimento(){
                let inicio = this.searchDataInicio;
                let fim = this.searchDataFim;

                if (!/^\d{4}$/.test(inicio) || !/^\d{4}$/.test(fim)) {
                    M.toast({html: 'Os anos devem ser números válidos com 4 dígitos.', classes: 'red toast-bottom-left'});
                    return;
                }

                if(inicio > fim){
                    M.toast({html: 'O ano de início não pode ser posterior ao ano de término.', classes: 'red toast-bottom-left'});
                    return;
                }

                DataService.cadastroSearchDataNascimento(inicio, fim)
                    .then(response => {
                        console.log('data nascimento')
                        console.log(response.data.data)
                        this.search = true;
                        this.cadastros = response.data.data;
                    })
                    .catch(e => {
                        console.log(e);
                    });

            },

            clickSearchNomeEmail() {
                DataService.cadastroSearchNomeEmail(this.searchNomeEmail)
                    .then(response => {
                        this.search = true;
                        this.cadastros = response.data.data.data;
                        this.searchNomeEmail = null;
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },

            openModalDelete(id) {
                this.deleteId = id;
                const modal = M.Modal.getInstance(document.getElementById('confirmModal'));
                if (modal) {
                    modal.open();
                }
            },
            confirmaDeleteCadastro(){

                DataService.deletarUsuario(this.deleteId )
                    .then(response => {
                        let msg = response.data.message;
                        M.toast({html: msg, classes: 'green toast-bottom-left'});
                        this.getCadastros();
                    })
                    .catch(e => {
                        let msg = response.data.message;
                        M.toast({html: msg, classes: 'red toast-bottom-left'});
                        console.log(e);
                    });
            },
            formataDateIdade(date) {
                if (!date) return '';

                const [year, month, day] = date.split('-');
                const formataData = `${day}/${month}/${year}`;
                const idade = this.calcularIdade(year, month, day);
                return `${formataData} (Idade: ${idade} anos)`;
            },
            calcularIdade(year, month, day) {
                const hojeDate = new Date();
                const nascimento = new Date(year, month - 1, day);
                let idade = hojeDate.getFullYear() - nascimento.getFullYear();
                return idade;
            },
            inputValidaAno(event, type) {
                const value = event.target.value;
                if (value.length > 4) {
                    event.target.value = value.slice(0, 4);
                    // Atualiza o modelo para refletir o valor cortado
                    if (type === 'start') {
                        this.searchDataInicio = event.target.value;
                    } else {
                        this.searchDataFim = event.target.value;
                    }
                }
            }

        },
        mounted() {
            this.getCadastros();
            M.Modal.init(document.querySelectorAll('.modal'));
            M.Tooltip.init(document.querySelectorAll('[data-tooltip]'), {
                position: 'bottom',
            });
        }
    };
</script>