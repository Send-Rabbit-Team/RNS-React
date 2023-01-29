import React, {useState} from "react";
import { Modal, Button, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Label} from "reactstrap";
import axios from "axios";
import Swal from 'sweetalert2'

const RegCompany = (props) => {
    const regUrl = props.gmail == null ? "/register" : "/google/register"

    const [companyEmail, setCompanyEmail] = useState();
    const [companyPassword1, setCompanyPassword1] = useState();
    const [companyPassword2, setCompanyPassword2] = useState();
    const [companyManager, setCompanyManager] = useState();
    const [companyPhone, setCompanyPhone] = useState();
    const [companyName, setCompanyName] = useState();
    const [companyBsnum, setCompanyBsnum] = useState();
    const [companyPhoneAccess, setCompanyPhoneAccess] = useState();

    const [companyPhoneCheck, setCompanyPhoneCheck] = useState(false);
    const [companyBsnumCheck, setCompanyBsnumCheck] = useState(false);
    const [companyModalOpen, setCompanyModalOpen] = useState(false)

    const authPhone = async () => {
        companyPhone == null ? window.alert("인증할 휴대폰 번호를 입력하세요") :
            await axios.post("/sms/send", {"to" : companyPhone})
                .then((response) => {
                    console.log(response)
                    if (response.data.isSuccess) {
                        setCompanyModalOpen(true)
                    } else {
                        window.alert(response.data.message)
                    }
                })
    }

    const authAccessNum = async () => {
        companyPhoneAccess == null ? window.alert("인증 번호를 입력하세요") :
            await axios.post("/sms/valid", {
                "phoneNumber": companyPhone,
                "authToken" : companyPhoneAccess
            }).then((response) => {
                if (response.data.isSuccess) {
                    setCompanyModalOpen(false)
                    setCompanyPhoneCheck(true)
                    window.alert(response.data.message)

                } else {
                    setCompanyModalOpen(false)
                    setCompanyPhoneCheck(false)
                    window.alert(response.data.message)
                }
            })
    }

    const authBsnum = async () => {
        companyBsnum == null ? window.alert("인증할 사업자 번호를 입력하세요") :
            await axios.post("http://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=4l9JfE06zoxwhuNDuBS2OpeuqOKzRqUxyn80TaaEu0ICL1%2FLVpffn7sMULbtz2ada%2FmbIi9gLZeep3rp9I%2BAVw%3D%3D",
                {"b_no" : [companyBsnum.toString()]})
                .then((response) => {
                    if (response.data["match_cnt"] == 1) {
                        setCompanyBsnumCheck(true)
                        window.alert("사업자 번호 인증에 성공했습니다")
                    } else {
                        setCompanyBsnumCheck(false)
                        window.alert("사업자 번호 인증에 실패했습니다")
                    }
                })
                .catch((error) => {
                    setCompanyBsnumCheck(false)
                    window.alert("사업자 번호 인증에 실패했습니다")
                })
    }

    const registerCompany = async () => {
        const companyRegisterReq = {
            "email" : props.gmail == null ? companyEmail : props.gmail,
            "password" : companyPassword1,
            "checkPassword" : companyPassword2,
            "name" : companyManager,
            "phoneNumber" : companyPhone,
            "companyName" : companyName,
            "bsNum" : companyBsnum,
            "memberType" : "COMPANY",
            "loginType" : props.gmail == null ? "DEFAULT" : "GOOGLE"
        }
        props.gmail == null && companyEmail == null ? await Swal.fire({
            title: '이메일을 입력하세요',
            icon: 'warning',
            showConfirmButton: false,
            timer: 1500
          }) :
            props.gmail == null && companyPassword1 == null ? await Swal.fire({
                title: '비밀번호를 입력하세요',
                icon: 'warning',
                showConfirmButton: false,
                timer: 1500
              }) :
                props.gmail == null && companyPassword1 != companyPassword2 ? await Swal.fire({
                    title: '비밀번호가 일치하지 않습니다',
                    icon: 'warning',
                    showConfirmButton: false,
                    timer: 1500
                  }) :
                    companyManager == null ? await Swal.fire({
                        title: '이름을 입력하세요',
                        icon: 'warning',
                        showConfirmButton: false,
                        timer: 1500
                      }) :
                        companyPhone == null ? await Swal.fire({
                            title: '휴대폰 번호를 입력하세요',
                            icon: 'warning',
                            showConfirmButton: false,
                            timer: 1500
                          }) :
                            !companyPhoneCheck ? await Swal.fire({
                                title: '휴대폰 번호를 인증하세요',
                                icon: 'warning',
                                showConfirmButton: false,
                                timer: 1500
                              }) :
                                companyName == null ? await Swal.fire({
                                    title: '회사이름을 입력하세요',
                                    icon: 'warning',
                                    showConfirmButton: false,
                                    timer: 1500
                                  }) :
                                    companyBsnum == null ? await Swal.fire({
                                        title: '사업자번호를 입력하세요',
                                        icon: 'warning',
                                        showConfirmButton: false,
                                        timer: 1500
                                      }) :
                                        !companyBsnumCheck ? await Swal.fire({
                                            title: '사업자번호를 인증하세요',
                                            icon: 'warning',
                                            showConfirmButton: false,
                                            timer: 1500
                                          }) :
                                        await axios.post(regUrl, companyRegisterReq)
                                            .then(async(response) => {
                                                if (response.data.isSuccess == true) {
                                                    await Swal.fire({
                                                        title: '회원가입에 실패했습니다',
                                                        icon: 'error',
                                                        showConfirmButton: false,
                                                        timer: 1500
                                                      })
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
                isOpen={companyModalOpen}
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
                        onClick={() => setCompanyModalOpen(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Input placeholder="인증 번호를 입력하세요" type="number" onChange={(e) => {setCompanyPhoneAccess(e.target.value)}}/>
                </div>
                <div className="modal-footer">
                    <Button
                        color="secondary"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setCompanyModalOpen(false)}
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
                            onChange={(e)=>{setCompanyEmail(e.target.value)}}
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
                                        setCompanyPassword1(e.target.value)
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
                                        setCompanyPassword2(e.target.value)
                                    }}
                                />
                            </InputGroup>
                        </FormGroup>

                    </> }


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
                <FormGroup>
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
                        <Button color="primary" outline type="button" onClick={authPhone}>
                            인증
                        </Button>
                    </InputGroup>
                </FormGroup>


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
                <FormGroup>
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
                        <Button color="primary" outline type="button" onClick={authBsnum}>
                            인증
                        </Button>
                    </InputGroup>
                </FormGroup>

                <div className="text-center">
                    <Button className="mt-4" color="primary" type="button" onClick={registerCompany}>
                        Create account
                    </Button>
                </div>
            </Form>
        </>

    );
}

export default RegCompany;
