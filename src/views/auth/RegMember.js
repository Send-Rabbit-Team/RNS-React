import React, {useState} from "react";
import { Modal, Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Label} from "reactstrap";
import axios from "axios";

const RegMember = (props) => {
    const regUrl = props.gmail == null ? "/register" : "/google/register"

    const [memberEmail, setMemberEmail] = useState();
    const [memberPassword1, setMemberPassword1] = useState();
    const [memberPassword2, setMemberPassword2] = useState();
    const [memberName, setMemberName] = useState();
    const [memberPhone, setMemberPhone] = useState();
    const [memberPhoneAccess, setMemberPhoneAccess] = useState();

    const [memberPhoneCheck, setMemberPhoneCheck] = useState(false);
    const [memberModalOpen, setMemberModalOpen] = useState(false)

    const authPhone = async () => {
        memberPhone == null ? window.alert("인증할 휴대폰 번호를 입력하세요") :
            await axios.post("/sms/send", {"to" : memberPhone})
                .then((response) => {
                    console.log(response)
                    if (response.data.isSuccess) {
                        setMemberModalOpen(true)
                    } else {
                        window.alert(response.data.message)
                    }
                })
    }

    const authAccessNum = async () => {
        memberPhoneAccess == null ? window.alert("인증 번호를 입력하세요") :
            await axios.post("/sms/valid", {
                "phoneNumber": memberPhone,
                "authToken" : memberPhoneAccess
            }).then((response) => {
                if (response.data.isSuccess) {
                    setMemberModalOpen(false)
                    setMemberPhoneCheck(true)
                    window.alert(response.data.message)

                } else {
                    setMemberModalOpen(false)
                    setMemberPhoneCheck(false)
                    window.alert(response.data.message)
                }
            })
    }

    const registerMember = async () => {
        const memberRegisterReq = {
            "email" : props.gmail == null ? memberEmail : props.gmail,
            "password" : memberPassword1,
            "checkPassword" : memberPassword2,
            "name" : memberName,
            "phoneNumber" : memberPhone,
            "companyName" : null,
            "bsNum" : null,
            "memberType" : "PERSON",
            "loginType" : props.gmail == null ? "DEFAULT" : "GOOGLE"
        }
        props.gmail == null && memberEmail == null ? window.alert("이메일을 입력하세요") :
            props.gmail == null && memberPassword1 == null ? window.alert("비밀번호를 입력하세요") :
                props.gmail == null && memberPassword1 != memberPassword2 ? window.alert("비밀번호가 일치하지 않습니다") :
                    memberName == null ? window.alert("이름을 입력하세요") :
                        memberPhone == null ? window.alert("휴대폰 번호를 입력하세요") :
                            !memberPhoneCheck ? window.alert("휴대폰 번호를 인증하세요") :
                                await axios.post(regUrl, memberRegisterReq)
                                    .then((response) => {
                                        if (response.data.isSuccess == true) {
                                            window.alert(response.data.message)
                                            window.location.replace("/auth/login")
                                        } else {
                                            window.alert(response.data.message)
                                        }
                                    }).catch((error) => {
                                        window.alert(error.response.data.message)
                                    })
}
    return (
        <>
            <Modal
                className="modal-dialog-centered"
                isOpen={memberModalOpen}
            >
                <div className="modal-header">
                    <h3 className="modal-title" id="exampleModalLabel">
                        휴대폰 인증
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setMemberModalOpen(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Input placeholder="인증 번호를 입력하세요" type="number" onChange={(e) => {setMemberPhoneAccess(e.target.value)}}/>
                </div>
                <div className="modal-footer">
                    <Button
                        color="secondary"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setMemberModalOpen(false)}
                    >
                        Close
                    </Button>
                    <Button color="primary" type="button" onClick={authAccessNum}>
                        Save changes
                    </Button>
                </div>
            </Modal>

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
                            value={props.gmail != null ? props.gmail : null}
                            readOnly={props.gmail != null ? true : false}
                            placeholder="Email"
                            type="email"
                            autoComplete="new-email"
                            onChange={(e)=>{setMemberEmail(e.target.value)}}
                        />
                    </InputGroup>
                </FormGroup>

                {/*password*/}
                {props.gmail != null ? null :
                    <>
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
                                    }}
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
                                    placeholder="Password Check"
                                    type="password"
                                    onChange={(e)=>{
                                        setMemberPassword2(e.target.value)
                                    }}
                                />
                            </InputGroup>
                        </FormGroup>

                    </> }

                {/*member name*/}
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
                        <Button color="primary" outline type="button" onClick={authPhone}>
                            인증
                        </Button>
                    </InputGroup>
                </FormGroup>

                <div className="text-center">
                    <Button className="mt-4" color="primary" type="button" onClick={registerMember}>
                        Create account
                    </Button>
                </div>
            </Form>
        </>

    );
}

export default RegMember;
