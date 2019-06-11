import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    feild_active:{
      name:"",
      upper_level:-1
    }
  },
  mutations: {
    setFeildActive(state,params){
      state.feild_active.name = params.name;
      state.feild_active.upper_level = params.upper_level;
    }
  },
  actions: {

  }
})
