import Register from "views/auth/Register.js";
import Login from "views/auth/Login.js";
import SenderNumber from "./views/admin/SenderNumber";
import ContactNumber from "views/examples/Contact.js";
import ContactGroup from "./views/admin/ContactGroup";

var routes_nav = [
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
    path: "/group/:page",
    name: "수신자 그룹 관리",
    icon: "ni ni-circle-08 text-red",
    component: ContactGroup,
    layout: "/admin"
  },
  {
    path: "/sender/:page",
    name: "발신자 번호 관리",
    icon: "fas fa-phone",
    component: SenderNumber,
    layout: "/admin"
  },
  {
    path: "/contact/:page",
    name: "연락처 관리",
    icon: "fas fa-phone",
    component: ContactNumber,
    layout: "/admin"
  },
];
export default routes_nav;
