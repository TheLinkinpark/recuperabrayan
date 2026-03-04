import { createRouter, createWebHistory } from "vue-router";
import IniCio from "../components/IniCio.vue";
import EmpleaDos from "../components/EmpleaDos.vue";
import TareaS from "../components/TareaS.vue";
import AbouT from "../components/AbouT.vue";
import EstadisTicas from "../components/EstadisTicas.vue";

const routes = [
    {
        path: "/",
        name: "IniCio",
        component: IniCio,
    },
    {
        path: "/empleados",
        name: "EmpleaDos",
        component: EmpleaDos,
    },
    {
        path: "/tareas",
        name: "TareaS",
        component: TareaS,
    },
    {
        path: "/about",
        name: "AbouT",
        component: AbouT,
    }, {
        path: "/estadisticas",
        name: "EstadisTicas",
        component: EstadisTicas
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;