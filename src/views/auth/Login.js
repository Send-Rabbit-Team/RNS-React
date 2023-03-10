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
import React, {useState} from "react";
import axios from "axios";
import setAuthorizationToken from "../../utils/authorization/SetAuthorizationToken.js"
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import Swal from "sweetalert2"


// Redux 활용을 위한 jwt 라이브러리 - jetpack 요구
// import jwt from "jsonwebtoken"


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const GeneralLoginInfo = {
        email   : email,
        password: password
    }

    const GoogleLoginInfo = {
        email: email
    }

    if (localStorage.getItem("bearer") != null) {
        localStorage.clear()
        window.location.reload();
    }

    const login = async () => {
        email === "" ? await Swal.fire({
            title            : "이메일을 입력하세요",
            icon             : "warning",
            showConfirmButton: false,
            timer            : 1000
        }) : password === "" ? await Swal.fire({
                title            : "비밀번호를 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) :
            await axios.post("/login", GeneralLoginInfo)
                .then(async response => {
                        if (response.data.isSuccess === true) {
                            await Swal.fire({
                                title            : "로그인에 성공했습니다",
                                icon             : "success",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                            localStorage.setItem("bearer", response.data.result.jwt);
                            if (response.data.result.profileImageURL)
                                localStorage.setItem("profile_image", response.data.result.profileImageURL)
                            localStorage.setItem("name", response.data.result.name);
                            localStorage.setItem("member_type", response.data.result.memberType);

                            setAuthorizationToken(response.data.result.jwt);

                            // Redux활용 코드:
                            // console.log("디코딩된 토큰(회원정보): ",jwt.decode(response.data.result.jwt))

                            window.location.replace("/admin/sms")
                            return response.data.code;
                        } else {
                            await Swal.fire({
                                title            : "로그인에 실패했습니다",
                                text             : "아이디 또는 비밀번호를 확인하세요",
                                icon             : "error",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                        }
                    }
                )
    }

    //    **  Header 추가 sample 코드  **
    //    var params = new URLSearchParams();
    //    params.append("email", "john@gmail.com");

    const google = async (credentialResponse) => {
        axios.defaults.withCredentials = true;
        await axios.post("/google/login", credentialResponse)
            .then(async (response) => {
                    if (response.data.isSuccess === true) {
                        await Swal.fire({
                            title            : "로그인에 성공했습니다",
                            icon             : "success",
                            showConfirmButton: false,
                            timer            : 1000
                        })

                        localStorage.setItem("bearer", response.data.result.jwt);
                        if (response.data.result.profileImageURL)
                            localStorage.setItem("profile_image", response.data.result.profileImageURL)
                        localStorage.setItem("name", response.data.result.name);
                        localStorage.setItem("member_type", response.data.result.memberType);

                        window.location.replace("/admin/sms")
                        return response.data.code;
                    } else {
                        await Swal.fire({
                            title            : "로그인에 실패했습니다",
                            text             : "구글 회원으로 가입하세요",
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                        window.location.replace("/auth/register")
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
                        <div align="center">

                            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        google(credentialResponse)
                                    }}
                                    onError={async () =>
                                        await Swal.fire({
                                            title            : "구글 회원 인증에 실패했습니다",
                                            icon             : "error",
                                            showConfirmButton: false,
                                            timer            : 1000
                                        })
                                    }
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
                                            <i className="ni ni-email-83"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        autoComplete="new-email"
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-lock-circle-open"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Password"
                                        type="password"
                                        autoComplete="new-password"
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                        }}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <div className="text-center">
                                <Button className="my-4" color="primary" type="button" onClick={login}>
                                    Sign in
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </>
    );
};

export default Login;

