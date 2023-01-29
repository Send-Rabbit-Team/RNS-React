import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import routes from "routes.js";
import TextAnimation from "react-text-animations";
import sms from "../assets/img/brand/bulk-sms.png"
import animation_sms from "../assets/img/brand/sms-animation.gif"
import { Button } from "reactstrap";

const Onboarding = (props) => {
  var token = localStorage.getItem("bearer");

  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div className="main-content" ref={mainContent}>
        <AuthNavbar />
        <div className="header bg-gradient-info py-7 py-lg-2">
          <Container>
            <div className="header-body">
              <Row className="pt-6">
                <Col lg="4" md="6">
                  <h1 className="text-white"
                      style={{fontSize: 60, paddingTop: 75, lineHeight: "140%"}}>Rabbit Notification Service</h1>
                  <p className="text-lead text-light" style={{fontSize: 18}}>
                    <TextAnimation.Slide  animation={{
                        duration:1000,
                        delay:2000,
                        timingFunction:'ease-out',
                    }} target="안전하게" text={['신속하게', '정확하게', '대량으로']}>
                        당신의 메시지를 "안전하게" 전달해보세요
                    </TextAnimation.Slide>
                    <Row style={{paddingTop:20,paddingLeft:15}}>
                      <Button button style={{ width:180, height: 60, fontSize:25}} color="primary"type="button"
                      href={token ? "/admin/sms" : "/auth/login"}>
                        시작하기
                      </Button>
                    </Row>
                  </p>
                </Col>
                <Col style={{marginLeft:30}}>
                  <div>
                    <img src={animation_sms} style={{paddingLeft:80, paddingBottom:120,width:630, height:590}} alt="sms"/>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="fill-default"
                points="2560 0 2560 100 0 100"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
