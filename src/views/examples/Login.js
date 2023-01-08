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
import { useState } from "react";
import axios from "axios";


const Login = () => {
  const [email, setEmail] =  useState();
  const [password, setPassword] =  useState();

  const loginInfo = {
    email: email,
    password: password
  }

  const login = async ()=>{
    await axios.post("/login", loginInfo)
      .then(response => {
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

  var params = new URLSearchParams();
  params.append('email', "john@gmail.com");

  const google = async () => {
    axios.defaults.withCredentials = true;
    await axios.post("/google/login",params)
        .then((response)=>{
          window.alert("구글 회원 인증에 성공했습니다")
          localStorage.setItem("bearer", response.data.result.jwt);
          window.location.replace("/admin/index")
          console.log("로그인 성공 결과: ",response.data)
        })
        .catch((error) => {
          console.log(error)
          window.alert("구글 회원 인증에 실패했습니다")
        })
  }


  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-0">
            <div className="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div className="btn-wrapper text-center">
              <Button
                className="btn-neutral btn-icon"
                color="default"
                href="#pablo"
                onClick={google}
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

