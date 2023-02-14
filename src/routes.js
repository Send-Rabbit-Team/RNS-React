import Register from "views/auth/Register.js";
import Login from "views/auth/Login.js";
import SenderNumber from "./views/admin/SenderNumber";
import ContactNumber from "views/admin/Contact.js";
import ContactGroup from "./views/admin/ContactGroup";
import SendSms from "./views/admin/send/sms/SendSms"
import SendKakao from "./views/admin/send/kakao/SendKakao"
import Template from "./views/admin/template/Template";
import MessageResult from "./views/admin/result/MessageResult";
import MessageReserve from "./views/admin/reserve/MessageReserve";
import KakaoMessageResult from "./views/admin/result/KakaoMessageResult";
import KakaoMessageReserve from "./views/admin/reserve/KakaoMessageReserve";
import Profile from "./views/admin/Profile";

var routes = [
  {
    path: "/onboarding",
    name: "온보딩",
    icon: "ni ni-send text-blue",
    component: Register,
    layout: "/main",
    sidebar:false
  },
  {
    path: "/register",
    name: "회원가입",
    icon: "ni ni-send text-blue",
    component: Register,
    layout: "/auth",
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
    path: "/profile",
    name: "프로필",
    icon: "fas fa-clock",
    component: Profile                                                                     ,
    layout: "/admin",
    sidebar: false
  },
  //  category: 발송 관리
  {
    category: "setting",
    path: "/sender/:page",
    name: "발신번호 관리",
    icon: "fas fa-phone-alt",
    component: SenderNumber,
    layout: "/admin",
    sidebar:true
  },
  {
    category: "setting",
    path: "/group/:page",
    name: "그룹 관리",
    icon: "fas fa-users",
    component: ContactGroup,
    layout: "/admin",
    sidebar:true
  },
  {
    category: "setting",
    path: "/contact/:page",
    name: "연락처 관리",
    icon: "fas fa-book",
    component: ContactNumber,
    layout: "/admin",
    sidebar:true
  },
  {
    category: "setting",
    path: "/template/:type/:page",
    name: "탬플릿 관리",
    icon: "fas fa-cog",
    component: Template                                                                     ,
    layout: "/admin",
    sidebar:true
  },
  //  category: 발송
  {
    category: "send",
    path: "/sms",
    name: "메시지 발송",
    icon: "fas fa-mail-bulk",
    component: SendSms,
    layout: "/admin",
    sidebar:true
  },
  {
    category: "send",
    path: "/kakao",
    name: "알림톡 발송",
    icon: "fas fa-comments",
    component: SendKakao,
    layout: "/admin",
    sidebar:true
  },
  // category: 발송 결과
  {
    category: "result",
    path: "/result/sms/:type/:keyword/:page",
    name: "메시지 발송 결과",
    icon: "ni ni-email-83",
    component: MessageResult                                                                     ,
    layout: "/admin",
    sidebar:true
  },
  {
    category: "result",
    path: "/result/kakao/:type/:keyword/:page",
    name: "알림톡 발송 결과",
    icon: "ni ni-chat-round",
    component: KakaoMessageResult                                                                     ,
    layout: "/admin",
    sidebar:true
  },
  {
    category: "result",
    path: "/reserve/sms/:page",
    name: "메시지 예약 결과",
    icon: "fas fa-clock",
    component: MessageReserve                                                                     ,
    layout: "/admin",
    sidebar:true
  },
  {
    category: "result",
    path: "/reserve/kakao/:page",
    name: "알림톡 예약 결과",
    icon: "ni ni-time-alarm",
    component: KakaoMessageReserve                                                                     ,
    layout: "/admin",
    sidebar:true
  },
];
export default routes;
