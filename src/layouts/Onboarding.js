import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import routes from "routes.js";
import TextAnimation from "react-text-animations";
import sms from "../assets/img/brand/bulk-sms.png"
import { Button } from "reactstrap";

const Onboarding = (props) => {
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
        <div className="header bg-gradient-info py-7 py-lg-8">
          <Container>
            <div className="header-body mb-7">
              <Row>
                <Col lg="5" md="6">
                  <h1 className="text-white" style={{fontSize: 60, paddingTop: 100}} >Rabbit Notification Service</h1>
                  <p className="text-lead text-light" style={{fontSize: 23}}>
                    <TextAnimation.Slide  animation={{
                        duration:1000,
                        delay:2000,
                        timingFunction:'ease-out',
                    }} target="안전하게" text={['신속하게', '정확하게', '대량으로']}>
                        당신의 메시지를 "안전하게" 전달해보세요
                    </TextAnimation.Slide>
                  </p>
                </Col>
                <Col>
                  <div>
                    <img src={sms} style={{paddingTop:30, paddingLeft: 80, width:550, height:460}} alt="sms"/>
                  </div>
                </Col>
              </Row>
              <Row style={{ paddingLeft: 20}}>
                <Button button style={{ width:190, height: 60, fontSize:30}} color="primary"type="button">
                  시작하기
                </Button>
                <Button button style={{ width:190, height: 60, fontSize:30, marginLeft:20}} color="primary"type="button">
                  로그인
                </Button>
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
        {/* 혹시 몰라서 남겨둠, 아래는 로그인 연동 컴포넌트 */}
        {/* Page content */}
        {/* <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Switch>
              {getRoutes(routes)}
              <Redirect from="*" to="/auth/login" />
            </Switch>
          </Row>
        </Container> */}
      </div>
    </>
  );
};

export default Onboarding;
