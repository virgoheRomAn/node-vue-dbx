export default {
  showKeyBoard: ({ commit }) => {
    commit('showKeyBoard')
  },
  hideKeyBoard: ({ commit }) => {
    commit('hideKeyBoard')
  },
  addPayPassword: ({ commit }, num) => {
    commit('pushPayPassword', num)
  },
  delPayPassword: ({ commit }, del) => {
    commit('delPayPassword', del)
  },
  emptyPayPassword: ({ commit }) => {
    commit('emptyPayPassword')
  },
  userLogin({ commit }, userInfo) {
    commit('userLogin', userInfo)
  },
  userLogout({ commit }) {
    commit('userLogout')
  }
}