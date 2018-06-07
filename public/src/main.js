import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
window.axios = require('axios');
var draggable = require('vuedraggable');

Vue.component('draggable',draggable);

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        loading : true
    },
    getters: {
        titleCollectStyle : (state) => (task) => {
            return task.collected ? 'collected' : undefined;
        }
    }
})

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
