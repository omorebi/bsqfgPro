import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		lan: 1
	},
	mutations: {
		setLan: (state, n) => {
			window.localStorage.setItem('lan', n)
			state.lan = n
		}
	},
});
