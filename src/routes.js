import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "/register",
    name: "메시지 전송",
    icon: "ni ni-send text-blue",
    component: Register,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "메시지 관리",
    icon: "ni ni-email-83 text-green",
    component: Register,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "그룹 관리",
    icon: "ni ni-circle-08 text-red",
    component: Register,
    layout: "/auth"
  },
  {
    path: "/onboarding",
    name: "온보딩",
    icon: "ni ni-send text-blue",
    component: Register,
    layout: "/main"
  },
  {
    path: "/login",
    name: "로그인",
    icon: "ni ni-send text-blue",
    component: Login,
    layout: "/auth"
  },
];
export default routes;
