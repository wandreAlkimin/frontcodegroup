import http from "./http";

class DataService {

// CADASTROS
    getAllCadastros(pagina) {
        if(pagina){
            return http.get(`/users?page=${pagina}`);
        }else{
            return http.get(`/users`);
        }
    }

    deletarUsuario(id){
        return http.post(`/user/delete/${id}`);
    }

    getUser(id){
        return http.get(`/user/${id}`);
    }

    createUser(data) {
        return http.post("/user/store", data);
    }
    updateUser(id, data) {
        return http.post(`/user/update/${id}`, data);
    }

    uploadImgUser(id, data){

        const formData = new FormData();
        formData.append('perfil_img', data);

        return http.post(`/user/upload-foto-perfil/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

    }
    cadastroSearchNomeEmail(data){
        return http.get(`/user/search?nome=${data}&email=${data}`);
    }

    cadastroSearchDataNascimento(incio, fim){
        return http.get(`/user/search/datanascimento?start_data=${incio}&end_data=${fim}`);
    }

}

export default new DataService();