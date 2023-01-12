import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col
} from "reactstrap";
import React, { useState } from "react";
import axios from "axios";
import setAuthorizationToken from "../../utils/setAuthorizationToken.js"
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";

// Redux 활용을 위한 jwt 라이브러리 - jetpack 요구
// import jwt from "jsonwebtoken"


const Login = () => {
  const [email, setEmail] =  useState();
  const [password, setPassword] =  useState();

  const GeneralLoginInfo = {
    email: email,
    password: password
  }

  const GoogleLoginInfo = {
    email: email
  }

  const login = async ()=>{
    await axios.post("/login", GeneralLoginInfo)
      .then(response => {
        if (response.data.isSuccess === true) {
          window.alert(response.data.message);
          console.log("로그인 성공 결과: ",response.data)
          localStorage.setItem("bearer", response.data.result.jwt);
          localStorage.setItem("profile_image", response.data.result.profileImage);
          localStorage.setItem("name", response.data.result.name);

          console.log('토큰: ',response.data.result.jwt)
          setAuthorizationToken(response.data.result.jwt);

          // Redux활용 코드:
          // console.log('디코딩된 토큰(회원정보): ',jwt.decode(response.data.result.jwt))

          window.location.replace("/admin/index")
          return response.data.code;
        } else{
          window.alert(response.data.message);
          console.log("로그인 실패 결과: ",response.data)
        }
      }
    )
  }

  //    **  Header 추가 sample 코드  **
  //    var params = new URLSearchParams();
  //    params.append('email', "john@gmail.com");

  const google = async (credentialResponse) => {
    axios.defaults.withCredentials = true;
    await axios.post("/google/login", credentialResponse)
        .then((response)=>{
          if (response.data.isSuccess === true) {
            window.alert(response.data.message);
            console.log("로그인 성공 결과: ",response.data)
            localStorage.setItem("bearer", response.data.result.jwt);
            window.location.replace("/admin/index")
            return response.data.code;
          } else{
            window.alert(response.data.message);
            console.log("로그인 실패 결과: ",response.data)
          }
         }
        )
  }


  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-5">
            <div className="text-muted text-center mt-2 mb-4">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">

              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={(credentialResponse) => {google(credentialResponse)}}
                    onError={() => window.alert("구글 회원 인증에 실패했습니다")}
                />
              </GoogleOAuthProvider>

            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Or sign in with credentials</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    onChange={(e)=>{setEmail(e.target.value)}}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    onChange={(e)=>{setPassword(e.target.value)}}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="button" onClick={login}>
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;

