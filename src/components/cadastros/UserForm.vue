<template>
    <div class="container">
        <h3>{{ userId ? 'Editar Usuário' : 'Adicionar Novo Usuário' }}</h3>
        <form @submit.prevent="submitForm">
            <div class="input-field">
                <input v-model="form.nome" type="text" id="nome" required />
                <label for="nome">Nome</label>
            </div>
            <div class="input-field">
                <input v-model="form.email" type="email" id="email" required />
                <label for="email">Email</label>
            </div>
            <div class="input-field">
                <input v-model="form.dt_nascimento" type="date" id="dt_nascimento" required @change="formataDateIdade" />
                <label for="dt_nascimento">Data de Nascimento</label>
            </div>
            <div class="input-field">
                <label for="idade">Idade: </label>
                <input v-model="idade" type="text" disabled />
            </div>
            <div class="input-field">
                <input v-model="form.telefone" type="text" id="telefone"  v-mask="'(##) #########'" required/>
                <label for="telefone">Telefone</label>
            </div>
            <br>
            <div class="input-field">
                <input type="file" @change="handleFileChange" />
                <label for="perfil_img" style="margin-top: 10px">Imagem de Perfil</label>
            </div>
            <br>
            <div v-if="perfil_img_preview">
                <img :src="perfil_img_preview" alt="Pré-visualização da Imagem" style="width: 100px; max-height: 200px;">
            </div>
            <br>
            <div v-if="perfil_img_carregado">
            <img :src="'http://localhost/assets/img/' + perfil_img_carregado" alt="User Icon" style="width: 100px; max-height: 200px;">
            </div>
            <br>

            <button type="submit" class="btn blue">{{ userId ? 'Atualizar' : 'Adicionar' }}</button>
        </form>
    </div>
</template>

<script>
    import DataService from "../../services/DataService";

    export default {
        data() {
            return {
                form: {
                    id: null,
                    nome: '',
                    email: '',
                    dt_nascimento: '',
                    password: '',
                    telefone: ''
                },
                perfil_img: null,
                userId: null,
                perfil_img_preview: null,
                perfil_img_carregado: null,
                idade: null
            };
        },
        async created() {
            this.checkId();
        },
        mounted() {
            M.updateTextFields(); // Inicializa os campos de texto do Materialize
        },
        updated() {
            M.updateTextFields();
        },
        methods: {
            checkId() {
                const id = this.$route.params.id;

                if (id) {
                    this.getUser(id);
                }
            },

            async getUser(id) {
                try {
                    DataService.getUser(id)
                        .then(response => {
                            console.log(response.data.data);
                            this.form = response.data.data;
                            this.userId = response.data.data.id;
                            this.perfil_img_carregado = response.data.data.perfil_img;
                            this.formataDateIdade();
                        })
                        .catch(e => {
                            console.log(e);
                        });
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário', error);
                }
            },
            handleFileChange(event) {
                const file = event.target.files[0];
                if (file) {
                    this.perfil_img = file;
                    this.perfil_img_preview = URL.createObjectURL(file);
                }
            },

            async submitForm() {
                if (this.userId) {
                    // Atualizar usuário existente
                    await this.updateUser();
                } else {
                    // Adicionar novo usuário
                    await this.createUser();
                }
            },
            async createUser() {
                try {

                    DataService.createUser(this.form)
                        .then(response => {
                            let userID = response.data.data;
                            let msg = response.data.message;

                            if (this.perfil_img) {
                                DataService.uploadImgUser(userID, this.perfil_img )
                                    .then(response => {
                                        this.perfil_img = null;
                                        this.perfil_img_preview = null;
                                        this.perfil_img_carregado = response.data.data;
                                        let msg = response.data.message;
                                        M.toast({html: msg, classes: 'green toast-bottom-left'});
                                        this.$router.push('/cadastros');
                                    })
                                    .catch(e => {
                                        let msg = response.data.message;
                                        M.toast({html: msg, classes: 'red toast-bottom-left'});
                                    });
                            }else{
                                M.toast({html: msg, classes: 'green toast-bottom-left'});
                                this.$router.push('/cadastros');
                            }

                        })
                        .catch(e => {
                            let msg = response.data.message;
                            M.toast({html: msg, classes: 'red toast-bottom-left'});
                        });


                     // Redirecionar após sucesso
                } catch (error) {
                    console.error('Erro ao criar usuário', error);
                }
            },
            async updateUser() {
                try {
                    DataService.updateUser(this.userId, this.form )
                        .then(response => {
                            let result = response.data.result;
                            if (this.perfil_img && result === true) {
                                DataService.uploadImgUser(this.userId, this.perfil_img )
                                    .then(response => {
                                        this.perfil_img = null;
                                        this.perfil_img_preview = null;
                                        this.perfil_img_carregado = response.data.data;
                                        let msg = response.data.message;
                                        M.toast({html: msg, classes: 'green toast-bottom-left'});
                                    })
                                    .catch(e => {
                                        let msg = response.data.message;
                                        M.toast({html: msg, classes: 'red toast-bottom-left'});
                                    });
                            }else{
                                let msg = response.data.message;
                                M.toast({html: msg, classes: 'green toast-bottom-left'});
                            }
                        })
                        .catch(e => {
                            let msg = response.data.message;
                            M.toast({html: msg, classes: 'red toast-bottom-left'});
                        });
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário', error);
                }
            },

            formataDateIdade() {

                let date = this.form.dt_nascimento;

                const [year, month, day] = date.split('-');
                const formataData = `${day}/${month}/${year}`;
                const idade = this.calcularIdade(year, month, day);
                return `${formataData} (Idade: ${idade} anos)`;
            },
            calcularIdade(year, month, day) {
                const hojeDate = new Date();
                const nascimento = new Date(year, month - 1, day);
                this.idade = hojeDate.getFullYear() - nascimento.getFullYear();
                this.idade = this.idade + " anos"
            },
        }
    }
</script>

<style>
    .container {
        margin: 20px;
    }
</style>