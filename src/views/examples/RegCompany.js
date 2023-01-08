import React, {useState} from "react";
import {Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row} from "reactstrap";
import axios from "axios";

const RegCompany = () => {
    const [companyEmail, setCompanyEmail] = useState();
    const [companyPassword1, setCompanyPassword1] = useState("");
    const [companyPassword2, setCompanyPassword2] = useState("");
    const [companyManager, setCompanyManager] = useState();
    const [companyPhone, setCompanyPhone] = useState();
    const [companyName, setCompanyName] = useState();
    const [companyBsnum, setCompanyBsnum] = useState();

    const [companyPasswordCheck, setCompanyPasswordCheck] = useState("");
    const [companyPhoneCheck, setCompanyPhoneCheck] = useState("");
    const [companyBsnumCheck, setCompanyBsnumCheck] = useState("");

    const authPhone = async () => {
        companyPhone == null ? window.alert("인증할 휴대폰 번호를 입력하세요") :
            await axios.get("/", companyPhone)
                .then((response) => {
                    setCompanyPhoneCheck("has-success")
                    window.alert("휴대폰 번호 인증에 성공했습니다")
                })
                .catch((error) => {
                    setCompanyPhoneCheck("has-danger")
                    window.alert("휴대폰 번호 인증에 실패했습니다")
                })
    }

    const authBsnum = async () => {
        companyBsnum == null ? window.alert("인증할 사업자 번호를 입력하세요") :
            await axios.get("/", companyBsnum)
                .then((response) => {
                    setCompanyBsnumCheck("has-success")
                    window.alert("사업자 번호 인증에 성공했습니다")
                })
                .catch((error) => {
                    setCompanyBsnumCheck("has-danger")
                    window.alert("사업자 번호 인증에 실패했습니다")
                })
    }

    const registerMember = async () => {
        const companyRegisterReq = {
            "email" : companyEmail,
            "password" : companyPassword1,
            "checkPassword" : companyPassword2,
            "name" : companyManager,
            "phoneNumber" : companyPhone,
            "companyName" : companyName,
            "bsNum" : companyBsnum,
            "memberType" : "COMPANY",
            "loginType" : "DEFAULT"

        }
        companyEmail == null ? window.alert("이메일을 입력하세요") :
            companyPassword1 == null ? window.alert("비밀번호를 입력하세요") :
                // companyPasswordCheck != "has-success" ? window.alert("비밀번호를 확인하세요") :
                companyManager == null ? window.alert("이름을 입력하세요") :
                    companyPhone == null ? window.alert("휴대폰 번호를 입력하세요") :
                        // companyPhoneCheck != "has-success" ? window.alert("휴대폰 번호를 인증하세요") :
                        companyName == null ? window.alert("회사 이름을 입력하세요") :
                            companyBsnum == null ? window.alert("사업자 번호를 입력하세요") :
                                // companyBsnumCheck != "has-success" ? window.alert("사업자 번호를 인증하세요") :
                                await axios.post("/register", companyRegisterReq)
                                    .then((response) => {
                                        window.alert("회원가입에 성공했습니다")
                                        window.location.replace("/login")
                                    })
                                    .catch((error) => {
                                        window.alert("회원가입에 실패했습니다")
                                    })
    }
    return (
        <Form role="form">
            {/*email*/}
            <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        placeholder="Email"
                        type="email"
                        autoComplete="new-email"
                        onChange={(e)=>{setCompanyEmail(e.target.value)}}
                    />
                </InputGroup>
            </FormGroup>

            {/*password*/}
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
                        onChange={(e)=>{
                            setCompanyPassword1(e.target.value)
                            companyPassword1 === companyPassword2 ? setCompanyPasswordCheck("has-success") : setCompanyPasswordCheck("has-danger")
                        }}
                    />
                </InputGroup>
            </FormGroup>

            {/*password check*/}
            <FormGroup className={companyPasswordCheck}>
                <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        placeholder="Password Check"
                        type="password"
                        onChange={(e)=>{
                            setCompanyPassword2(e.target.value)
                            companyPassword1 === companyPassword2 ? setCompanyPasswordCheck("has-success") : setCompanyPasswordCheck("has-danger")
                        }}
                    />
                </InputGroup>
            </FormGroup>

            {/*company manager name*/}
            <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="fas fa-user" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        placeholder="Name"
                        type="text"
                        onChange={(e)=>{setCompanyManager(e.target.value)}}
                    />
                </InputGroup>
            </FormGroup>

            {/*phoneNumber*/}
            <Row>
                <Col xs="9">
                    <FormGroup className={companyPhoneCheck}>
                        <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-phone"></i>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                placeholder="Phone"
                                type="tel"
                                onChange={(e)=>{setCompanyPhone(e.target.value)}}
                            />
                        </InputGroup>
                    </FormGroup>
                </Col>
                <Col xs="3">
                    <Button color="primary" outline type="button" onClick={authPhone}>
                        인증
                    </Button>
                </Col>
            </Row>

            {/*company name*/}
            <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="far fa-building" />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        placeholder="Company Name"
                        type="text"
                        onChange={(e)=>{setCompanyName(e.target.value)}}
                    />
                </InputGroup>
            </FormGroup>

            {/*company business number*/}
            <Row>
                <Col xs="9">
                    <FormGroup className={companyBsnumCheck}>
                        <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-briefcase" />
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                placeholder="Company Business Number"
                                type="number"
                                onChange={(e)=>{setCompanyBsnum(e.target.value)}}
                            />
                        </InputGroup>
                    </FormGroup>
                </Col>
                <Col xs="3">
                    <Button color="primary" outline type="button" onClick={authBsnum}>
                        인증
                    </Button>
                </Col>
            </Row>

            <div className="text-center">
                <Button className="mt-4" color="primary" type="button" onClick={registerMember}>
                    Create account
                </Button>
            </div>
        </Form>
    );
}

export default RegCompany;
