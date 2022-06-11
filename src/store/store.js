import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: localStorage.getItem('token'),
        username: localStorage.getItem('username'),
        id: localStorage.getItem('id')
    },
    mutations: {
        saveUserInfo (state, user) {
            state.token = user.token;
            state.username = user.username
            state.id = user.id
            localStorage.setItem('id', user.id);
            localStorage.setItem('token', user.token);
            localStorage.setItem('username', user.username);
        },
        removeUserInfo(state) {
            state.token = '';
            state.username = '';
            state.id = '';
            localStorage.setItem('id', '');
            localStorage.setItem('token', '');
            localStorage.setItem('username', '');
        }
    }
})

export default store