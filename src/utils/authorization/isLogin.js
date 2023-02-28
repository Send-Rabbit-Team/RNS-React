const isLogin = () => !!localStorage.getItem("bearer");
export default isLogin;