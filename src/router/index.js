import { createRouter, createWebHistory } from 'vue-router'
const NotFound = () => import("../components/NotFound.vue")
import {useAuth} from "@/store/auth.js";
import {toast} from "vue3-toastify";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [

        {
            alias: "/cadastros",
            name: "cadastros",
            component: () => import("../components/cadastros/CadastrosList.vue")
        },
        {
            alias: "/cadastro/:id?",
            name: "cadastro-add",
            component: () => import("../components/cadastros/UserForm.vue")
        },
        {
            path: '/unauthorized',
            name: 'ErroAutenticacao',
            component: () => import("../components/auth/Unauthorized.vue")
        },

        {
            path: '/boas-vindas',
            name: 'boasvindas',
            component: () => import("../components/BoasVindas.vue"),
            meta: {
                auth: true
            }
        },

        {
            path: "/:pathMath(.*)*",
            name: "NotFound",
            component: NotFound
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    if (to.meta?.auth) {
        const auth = useAuth();
        if (auth.token && auth.user) {
            try {
                // Aguarde a resolução da promessa
                const isAuthenticate = await auth.checkToken();

                if (isAuthenticate) {
                    if (to.name === 'login') {
                        next({ name: 'boasvindas' })
                    }
                    console.log('Usuário autenticado');
                    next();
                } else {
                    await auth.clear();

                    setTimeout(() => {
                        toast.success('Sessão expirada');
                    }, 1000);

                    console.log('Token inválido');
                    next({ name: 'login' });
                }
            } catch (error) {
                console.error('Erro ao verificar o token:', error);
                next({ name: 'login' });
            }
        } else {
            console.log('Token ou usuário ausentes');
            next({ name: 'login' });
        }
    } else {
        // Se a rota não exige autenticação, prossiga
        next();
    }
});


export default router
