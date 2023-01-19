import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/auth/Register.js";
import Login from "views/auth/Login.js";
import Tables from "views/admin/SenderNumber.js";
import Icons from "views/examples/Icons.js";
import SenderNumber from "./views/admin/SenderNumber";
import ContactNumber from "views/examples/Contact.js";
import ContactGroup from "./views/admin/ContactGroup";
import SendSms from "./views/admin/SendSms"
import MakeTemplate from "./views/admin/MakeTemplate";

var routes = [
  {
    path: "/register",
    name: "메시지 관리",
    icon: "ni ni-email-83",
    component: Register,
    layout: "/auth",
    sidebar:false
  },
  {
    path: "/group/:page",
    name: "수신자 그룹 관리",
    icon: "fas fa-users",
    component: ContactGroup,
    layout: "/admin",
    sidebar:true
  },
  {
    path: "/onboarding",
    name: "온보딩",
    icon: "ni ni-send text-blue",
    component: Register,
    layout: "/main",
    sidebar:false
  },
  {
    path: "/login",
    name: "로그인",
    icon: "ni ni-send text-blue",
    component: Login,
    layout: "/auth",
    sidebar:false
  },
  {
    path: "/sender/:page",
    name: "발신번호 관리",
    icon: "fas fa-phone",
    component: SenderNumber,
    layout: "/admin",
    sidebar:true
  },
  {
    path: "/contact/:page",
    name: "연락처 관리",
    icon: "fas fa-book",
    component: ContactNumber,
    layout: "/admin",
    sidebar:true
  },
  {
    path: "/sms",
    name: "SMS 발송",
    icon: "ni ni-send",
    component: SendSms,
    layout: "/admin",
    sidebar:true
  },
  {
    path: "/template/:page",
    name: "탬플릿 관리",
    icon: "fas fa-cog",
    component: MakeTemplate,
    layout: "/admin",
    sidebar:true
  }
];
export default routes;
