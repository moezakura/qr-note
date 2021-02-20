import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import routes from './routes/routes.js'
import VueCompositionApi from '@vue/composition-api';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(VueRouter);
Vue.use(VueCompositionApi);
Vue.use(Vuetify);


const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    routes: routes,
});

new Vue({
    el: '#app',
    vuetify: new Vuetify({
        theme: {dark: true}
    }),
    render: h => h(App),
    router,
});

