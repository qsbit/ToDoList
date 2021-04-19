import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todoList: [
      {
        "id": 0,
        "info": "Resume improvement as soon as possible (reconstruction).",
        "done": false
      },
      {
        "id": 1,
        "info": "Don't forget to memorize English words.",
        "done": false
      },
      {
        "id": 2,
        "info": "FE basic knowledge needs to be consolidated.",
        "done": true
      },
      {
        "id": 3,
        "info": "Remember to wash clothes when you go back to the dormitory.",
        "done": false
      },
      {
        "id": 4,
        "info": "Remember to update personal blog.",
        "done": true
      }
    ]
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
