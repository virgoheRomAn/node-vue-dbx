export default {
  showKeyBoard(state) {
    state.keyBoardShow = true;
  },
  hideKeyBoard(state) {
    state.keyBoardShow = false;
  },
  pushPayPassword(state, num) {
    state.payPassword.push(num);
  },
  delPayPassword(state, payload) {
    state.payPassword.splice(payload.index, payload.number);
  },
  emptyPayPassword(state) {
    state.payPassword.splice(0, state.payPassword.length);
    state.psdIndex = 0;
  },
  userLogin(state, userInfo) {
    state.user.isLogin = true;
    state.user.token = userInfo.token;
    state.user.userId = userInfo.userId;
    state.user.userName = userInfo.userName;
  },
  userLogout(state) {
    state.user.isLogin = false;
    state.user.token = "";
    state.user.userId = "";
    state.user.userName = "";
  }
}