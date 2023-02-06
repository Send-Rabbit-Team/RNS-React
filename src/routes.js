import Register from "views/auth/Register.js";
import Login from "views/auth/Login.js";
import SenderNumber from "./views/admin/SenderNumber";
import ContactNumber from "views/admin/Contact.js";
import ContactGroup from "./views/admin/ContactGroup";
import SendSms from "./views/admin/send/sms/SendSms"
import SendKakao from "./views/admin/send/kakao/SendKakao"
import Template from "./views/admin/template/Template";
import MessageResult from "./views/admin/MessageResult";
import MessageReserve from "./views/admin/MessageReserve";

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
    path: "/contact/:page",
    name: "연락처 관리",
    icon: "fas fa-book",
    component: ContactNumber,
    layout: "/admin",
    sidebar:true
  },
  {
    path: "/group/:page",
    name: "연락처 그룹 관리",
    icon: "fas fa-users",
    component: ContactGroup,
    layout: "/admin",
    sidebar:true
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
    path: "/sms",
    name: "SMS 발송",
    icon: "ni ni-send",
    component: SendSms,
    layout: "/admin",
    sidebar:true
  },
  {
    path: "/kakao",
    name: "알림톡 발송",
    icon: "fas fa-comment",
    component: SendKakao,
    layout: "/admin",
    sidebar:true
  },
  {
    path: "/template/:type/:page",
    name: "탬플릿 관리",
    icon: "fas fa-cog",
    component: Template                                                                     ,
    layout: "/admin",
    sidebar:true
  },
  {
    path: "/result/sms/:type/:keyword/:page",
    name: "메시지 발송 결과",
    icon: "fas fa-envelope",
    component: MessageResult                                                                     ,
    layout: "/admin",
    sidebar:true
  },
  {
    path: "/reserve/sms/:page",
    name: "메시지 예약 발송",
    icon: "fas fa-clock",
    component: MessageReserve                                                                     ,
    layout: "/admin",
    sidebar:true
  },
];
export default routes;
