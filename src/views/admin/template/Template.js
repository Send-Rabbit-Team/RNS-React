import Header from "../../../components/Headers/Header";
import React, {useEffect, useState} from "react";
import {
    NavItem,
    NavLink,
    Nav,
    TabContent,
    TabPane
} from "reactstrap";
import SmsTemplate from "./SmsTemplate";
import KakaoTemplate from "./KakaoTemplate";
import {useParams} from "react-router-dom";

const Template = () => {
    const params = useParams();
    const [hTabsIcons, setHTabsIcons] = useState("sms");
    useEffect(() => (
        params.type != ":type" ? setHTabsIcons(params.type) : null
    ))
  return (
      <>
          <Header />
          <div className="ml-5 mr-5 mt-3 nav-wrapper">
              <Nav className="nav-fill flex-column flex-md-row" pills role="tablist">
                  <NavItem>
                      <NavLink
                          className={
                              "mb-sm-3 mb-md-0 " +
                              (hTabsIcons === "sms" ? "active" : "")
                          }
                          href="#pablo"
                          onClick={(e) => {
                              e.preventDefault();
                              window.location.replace("/admin/template/sms/1")
                          }}
                      >
                          <i className="ni ni-cloud-upload-96 mr-2"></i>
                          문자 탬플릿
                      </NavLink>
                  </NavItem>
                  <NavItem>
                      <NavLink
                          className={
                              "mb-sm-3 mb-md-0 " +
                              (hTabsIcons === "kakao" ? "active" : "")
                          }
                          href="#pablo"
                          onClick={(e) => {
                              e.preventDefault();
                              window.location.replace("/admin/template/kakao/1")
                          }}
                      >
                          <i className="ni ni-bell-55 mr-2"></i>
                          알림톡 탬플릿
                      </NavLink>
                  </NavItem>
              </Nav>
          </div>
          <TabContent className="ml-5 mr-5 mt-3" id="myTabContent" activeTab={hTabsIcons}>
              <TabPane tabId="sms" role="tabpanel">
                  <SmsTemplate></SmsTemplate>
              </TabPane>
              <TabPane tabId="kakao" role="tabpanel">
                  <KakaoTemplate></KakaoTemplate>
              </TabPane>
          </TabContent>


      </>
  )
}

export default Template;
