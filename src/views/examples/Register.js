/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import React from "react";
import classnames from "classnames";
import { Card, CardHeader, CardBody, Col, Nav, NavItem, NavLink, TabContent, TabPane, Button} from "reactstrap";
import RegMember from "./RegMember";
import RegCompany from "./RegCompany";
import axios from "axios";
// import {GoogleLogin, GoogleOAuthProvider, useGoogleLogin} from "@react-oauth/google";
import GoogleLogin from "react-google-login";

const CLIENT_ID_GOOGLE = "835228927820-80mfcdq6p90s97pqbo582f9f1s0ng935.apps.googleusercontent.com"

class Register extends React.Component {
  state = {
    tabs: 1,
    gmail: null
  };
  toggleNavs = (e, state, index) => {
    e.preventDefault();
    this.setState({
      [state]: index
    });
  };

  // spring google(cors error)
  google = async () => {
      await axios.get("https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=835228927820-80mfcdq6p90s97pqbo582f9f1s0ng935.apps.googleusercontent.com&scope=email&redirect_uri=http://localhost:8080/google/redirect",
          {headers : {
              "Access-Control-Allow-Origin":"*"
            }})
      // await axios.get("/google")
          .then((response)=>{
          console.log(response)
          if (response.data.isSuccess) {
            window.alert(response.data.message)
            this.state.gmail = response.data.result["email"]
          }


        })
        .catch((error) => {
          console.log(error)
          window.alert("구글 회원 인증에 실패했습니다")
        })
  }
  render() {
    return (
        <>
          <Col lg="6" md="8">
            <Card className="bg-secondary shadow border-0">
              <CardHeader className="bg-transparent pb-5">
                <div className="text-muted text-center mt-2 mb-4">
                  <small>Sign up with</small>
                </div>
                <div className="text-center">


                  {/*import GoogleLogin from "react-google-login";*/}
                  <GoogleLogin
                      clientId={CLIENT_ID_GOOGLE}
                      onSuccess={(response) => console.log(response)}
                      onFailure={(error) => {console.log(error)}}/>

                  {/*// import {GoogleLogin, GoogleOAuthProvider, useGoogleLogin} from "@react-oauth/google";*/}
                  {/*<GoogleOAuthProvider clientId={CLIENT_ID_GOOGLE}>*/}
                  {/*  <GoogleLogin flow='auth-code'*/}
                  {/*    onSuccess={async (response) => {*/}
                  {/*      console.log(response)*/}
                  {/*      console.log(response.credential)*/}
                  {/*      // await axios.get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + response.credential*/}
                  {/*      // await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",*/}
                  {/*      //     {headers: {"Authorization" : "Bearer " + response.credential}}*/}
                  {/*      // ).then((response) => {*/}
                  {/*      //       console.log(response)*/}
                  {/*      //     })*/}
                  {/*    }}*/}
                  {/*    onError={() => console.log("google register error")}*/}
                  {/*  />*/}
                  {/*</GoogleOAuthProvider>*/}

                  {/*spring google(cors error)*/}
                  <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      onClick={this.google}
                  >
                    <span className="btn-inner--icon">
                      <img
                          alt="..."
                          src={
                            require("../../assets/img/icons/common/google.svg")
                                .default
                          }
                      />
                    </span>
                    <span className="btn-inner--text">Google</span>
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Or sign up with credentials</small>
                </div>

                <div className="nav-wrapper">
                  <Nav
                      className="nav-fill flex-column flex-md-row"
                      id="tabs-icons-text"
                      pills
                      role="tablist"
                  >
                    <NavItem>
                      <NavLink
                          aria-selected={this.state.tabs === 1}
                          className={classnames("mb-sm-3 mb-md-0", {
                            active: this.state.tabs === 1
                          })}
                          onClick={e => this.toggleNavs(e, "tabs", 1)}
                          href="#pablo"
                          role="tab"
                      >
                        개인
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                          aria-selected={this.state.tabs === 2}
                          className={classnames("mb-sm-3 mb-md-0", {
                            active: this.state.tabs === 2
                          })}
                          onClick={e => this.toggleNavs(e, "tabs", 2)}
                          href="#pablo"
                          role="tab"
                      >
                        기업
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
                <Card className="shadow">
                  <CardBody>
                    <TabContent activeTab={"tabs" + this.state.tabs}>
                      <TabPane tabId="tabs1">
                        <RegMember gmail={this.state.gmail}></RegMember>
                      </TabPane>
                      <TabPane tabId="tabs2">
                        <RegCompany gmail={this.state.gmail}></RegCompany>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>


              </CardBody>
            </Card>
          </Col>
        </>
    );
  }
};

export default Register;
