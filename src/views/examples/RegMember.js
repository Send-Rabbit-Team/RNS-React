import React, {useState} from "react";
import {Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row} from "reactstrap";
import axios from "axios";

const RegMember = () => {
    const [memberEmail, setMemberEmail] = useState();
    const [memberPassword1, setMemberPassword1] = useState("");
    const [memberPassword2, setMemberPassword2] = useState("");
    const [memberName, setMemberName] = useState();
    const [memberPhone, setMemberPhone] = useState();

    const [memberPasswordCheck, setMemberPasswordCheck] = useState("");
    const [memberPhoneCheck, setMemberPhoneCheck] = useState("");

    const authPhone = async () => {
        memberPhone == null ? window.alert("인증할 휴대폰 번호를 입력하세요") :
            await axios.get("/", memberPhone)
                .then((response) => {
                    setMemberPhoneCheck("has-success")
                    window.alert("휴대폰 번호 인증에 성공했습니다")
                })
                .catch((error) => {
                    setMemberPhoneCheck("has-danger")
                    window.alert("휴대폰 번호 인증에 실패했습니다")
                })
    }

    const registerMember = async () => {
        const memberRegisterReq = {
            "email" : memberEmail,
            "password" : memberPassword1,
            "checkPassword" : memberPassword2,
            "name" : memberName,
            "phoneNumber" : memberPhone,
            "companyName" : null,
            "bsNum" : null,
            "memberType" : "PERSON",
            "loginType" : "DEFAULT"

        }
        memberEmail == null ? window.alert("이메일을 입력하세요") :
            memberPassword1 == null ? window.alert("비밀번호를 입력하세요") :
                // memberPasswordCheck != "has-success" ? window.alert("비밀번호를 확인하세요") :
                memberName == null ? window.alert("이름을 입력하세요") :
                    memberPhone == null ? window.alert("휴대폰 번호를 입력하세요") :
                        // memberPhoneCheck != "has-success" ? window.alert("휴대폰 번호를 인증하세요") :
                        await axios.post("/register", memberRegisterReq)
                            .then((response) => {
                                if (response.data.isSuccess == true) {
                                    window.alert(response.data.message)
                                    window.location.replace("/login")
                                } else {
                                    window.alert(response.data.message)
                                }
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
                        onChange={(e)=>{setMemberEmail(e.target.value)}}
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
                            setMemberPassword1(e.target.value)
                            memberPassword1 === memberPassword2 ? setMemberPasswordCheck("has-success") : setMemberPasswordCheck("has-danger")
                        }}
                    />
                </InputGroup>
            </FormGroup>

            {/*password check*/}
            <FormGroup className={memberPasswordCheck}>
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
                            setMemberPassword2(e.target.value)
                            memberPassword1 === memberPassword2 ? setMemberPasswordCheck("has-success") : setMemberPasswordCheck("has-danger")
                        }}
                    />
                </InputGroup>
            </FormGroup>

            {/*name*/}
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
                        onChange={(e)=>{setMemberName(e.target.value)}}
                    />
                </InputGroup>
            </FormGroup>

            {/*phoneNumber*/}
            <Row>
                <Col xs="9">
                    <FormGroup className={memberPhoneCheck}>
                        <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-phone"></i>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                placeholder="Phone"
                                type="tel"
                                onChange={(e)=>{setMemberPhone(e.target.value)}}
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

            <div className="text-center">
                <Button className="mt-4" color="primary" type="button" onClick={registerMember}>
                    Create account
                </Button>
            </div>
        </Form>
    );
}

export default RegMember;
