import {ref} from 'vue'
import {defineStore} from 'pinia'
import http from '@/services/http.js'

export const useAuth = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token'))
    const user = ref(JSON.parse(localStorage.getItem('user')))
    
    function setToken(tokenValue) {
        localStorage.setItem('token', tokenValue)
        token.value = tokenValue
    }

    function setUser(userValue) {
        localStorage.setItem('user', JSON.stringify(userValue))
        user.value = userValue
    }

    function isAuthenticate(){
        return token.value && user.value;
    }


    function getUser() {
        if (user.value) {
            return user.value.nome;
        }
        return '';
    }

    function clear(){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        token.value = '';
        user.value = '';
    }

    async function checkToken() {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            };

            const response = await http.get('/user-validate-rash', config);

            // Verifica se o status da resposta é 401
            if (response.status === 401) {
                console.log('Token inválido');
                return false;
            }
            // Verifica se o status da resposta é 401
            if (response.status === 500) {
                console.log('Token Expirado');
                return false;
            }

            // Se a resposta não for 401, continua com o processamento

            return true;
        } catch (error) {
            console.log('checkToken: ' + error);
            return false; // Em caso de erro, também retorna false
        }
    }

    return {
        token,
        user,
        setToken,
        setUser,
        checkToken,
        isAuthenticate,
        getUser,
        clear
    }

})