import React, {useState} from "react";
import {
    Modal,
    Button,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2"

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
    const [companyKakaoBizId, setCompanyKakaoBizId] = useState();

    const [companyPhoneCheck, setCompanyPhoneCheck] = useState(false);
    const [companyBsnumCheck, setCompanyBsnumCheck] = useState(false);
    const [companyModalOpen, setCompanyModalOpen] = useState(false)

    // 휴대폰 번호 입력
    const authPhone = async () => {
        companyPhone == null ?
            await Swal.fire({
                title            : "인증할 휴대폰 번호를 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) :
            await axios.post("/sms/send", {"to": companyPhone})
                .then(async (response) => {
                    if (response.data.isSuccess) {
                        setCompanyModalOpen(true)
                    } else {
                        await Swal.fire({
                            title            : response.data.message,
                            icon             : "warning",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    }
                }).catch(async (error) => {
                    await Swal.fire({
                        title            : error.response.data.message,
                        icon             : "warning",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                })
    }

    // 휴대폰 번호 인증
    const authAccessNum = async () => {
        companyPhoneAccess == null ?
            await Swal.fire({
                title            : "인증 번호를 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) :
            await axios.post("/sms/valid", {
                "phoneNumber": companyPhone,
                "authToken"  : companyPhoneAccess
            }).then(async (response) => {
                if (response.data.isSuccess) {
                    setCompanyModalOpen(false)
                    setCompanyPhoneCheck(true)
                    await Swal.fire({
                        title            : "휴대폰 번호 인증에 성공했습니다",
                        icon             : "success",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                } else {
                    setCompanyModalOpen(false)
                    setCompanyPhoneCheck(false)
                    await Swal.fire({
                        title            : response.data.message,
                        icon             : "error",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                }
            }).catch(async (error) => {
                await Swal.fire({
                    title            : "휴대폰 번호 인증에 실패했습니다",
                    icon             : "error",
                    showConfirmButton: false,
                    timer            : 1000
                })
            })
    }

    // 사업자 번호 인증
    const authBsnum = async () => {
        companyBsnum === "" ?
            await Swal.fire({
                title            : "인증할 사업자 번호를 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) :
            await axios.post("http://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=4l9JfE06zoxwhuNDuBS2OpeuqOKzRqUxyn80TaaEu0ICL1%2FLVpffn7sMULbtz2ada%2FmbIi9gLZeep3rp9I%2BAVw%3D%3D",
                {"b_no": [companyBsnum.toString()]})
                .then(async (response) => {
                    if (response.data["match_cnt"] == 1) {
                        setCompanyBsnumCheck(true)
                        await Swal.fire({
                            title            : "사업자 번호 인증에 성공했습니다",
                            icon             : "success",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    } else {
                        setCompanyBsnumCheck(false)
                        await Swal.fire({
                            title            : response.data.message,
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    }
                })
                .catch(async (error) => {
                    setCompanyBsnumCheck(false)
                    await Swal.fire({
                        title            : "사업자 번호 인증에 실패했습니다",
                        icon             : "error",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                })
    }

    // 회원가입
    const registerCompany = async () => {
        const companyRegisterReq = {
            "email"        : props.gmail == null ? companyEmail : props.gmail,
            "password"     : companyPassword1,
            "checkPassword": companyPassword2,
            "name"         : companyManager,
            "phoneNumber"  : companyPhone,
            "companyName"  : companyName,
            "bsNum"        : companyBsnum,
            "memberType"   : "COMPANY",
            "loginType"    : props.gmail == null ? "DEFAULT" : "GOOGLE",
            "kakaoBizId"   : companyKakaoBizId
        }
        props.gmail == null && companyEmail == null ? await Swal.fire({
                title            : "이메일을 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) :
            props.gmail == null && companyPassword1 == null ? await Swal.fire({
                    title            : "비밀번호를 입력하세요",
                    icon             : "warning",
                    showConfirmButton: false,
                    timer            : 1000
                }) :
                props.gmail == null && companyPassword1 != companyPassword2 ? await Swal.fire({
                        title            : "비밀번호가 일치하지 않습니다",
                        icon             : "warning",
                        showConfirmButton: false,
                        timer            : 1000
                    }) :
                    companyManager == null ? await Swal.fire({
                            title            : "이름을 입력하세요",
                            icon             : "warning",
                            showConfirmButton: false,
                            timer            : 1000
                        }) :
                        companyPhone == null ? await Swal.fire({
                                title            : "휴대폰 번호를 입력하세요",
                                icon             : "warning",
                                showConfirmButton: false,
                                timer            : 1000
                            }) :
                            !companyPhoneCheck ? await Swal.fire({
                                    title            : "휴대폰 번호를 인증하세요",
                                    icon             : "warning",
                                    showConfirmButton: false,
                                    timer            : 1000
                                }) :
                                companyName == null ? await Swal.fire({
                                        title            : "회사이름을 입력하세요",
                                        icon             : "warning",
                                        showConfirmButton: false,
                                        timer            : 1000
                                    }) :
                                    companyBsnum == null ? await Swal.fire({
                                            title            : "사업자번호를 입력하세요",
                                            icon             : "warning",
                                            showConfirmButton: false,
                                            timer            : 1000
                                        }) :
                                        !companyBsnumCheck ? await Swal.fire({
                                                title            : "사업자번호를 인증하세요",
                                                icon             : "warning",
                                                showConfirmButton: false,
                                                timer            : 1000
                                            }) :
                                            await axios.post(regUrl, companyRegisterReq)
                                                .then(async (response) => {
                                                    if (response.data.isSuccess == true) {
                                                        await Swal.fire({
                                                            title            : "회원가입에 성공했습니다",
                                                            icon             : "success",
                                                            showConfirmButton: false,
                                                            timer            : 1000
                                                        })
                                                        window.location.replace("/auth/login")
                                                    } else {
                                                        await Swal.fire({
                                                            title            : response.data.message,
                                                            icon             : "error",
                                                            showConfirmButton: false,
                                                            timer            : 1000
                                                        })
                                                    }
                                                }).catch(async (error) => {
                                                    await Swal.fire({
                                                        title            : "기업 회원가입에 실패했습니다",
                                                        text             : "관리자에게 문의하세요",
                                                        icon             : "error",
                                                        showConfirmButton: false,
                                                        timer            : 1000
                                                    })
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
                    <Input placeholder="인증 번호를 입력하세요" type="number" onChange={(e) => {
                        setCompanyPhoneAccess(e.target.value)
                    }}/>
                </div>
                <div className="modal-footer">
                    <Button
                        color="secondary"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setCompanyModalOpen(false)}
                    >
                        닫기
                    </Button>
                    <Button color="primary" type="button" onClick={authAccessNum}>
                        인증하기
                    </Button>
                </div>
            </Modal>

            <Form role="form">
                {/*email*/}
                <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="ni ni-email-83"/>
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            value={props.gmail != null ? props.gmail : null}
                            readOnly={props.gmail != null ? true : false}
                            placeholder="Email"
                            type="email"
                            autoComplete="new-email"
                            onChange={(e) => {
                                setCompanyEmail(e.target.value)
                            }}
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
                                        <i className="ni ni-lock-circle-open"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    autoComplete="new-password"
                                    onChange={(e) => {
                                        setCompanyPassword1(e.target.value)
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
                                    placeholder="Password Check"
                                    type="password"
                                    onChange={(e) => {
                                        setCompanyPassword2(e.target.value)
                                    }}
                                />
                            </InputGroup>
                        </FormGroup>

                    </>}


                {/*company manager name*/}
                <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="fas fa-user"/>
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="Name"
                            type="text"
                            onChange={(e) => {
                                setCompanyManager(e.target.value)
                            }}
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
                            onChange={(e) => {
                                setCompanyPhone(e.target.value)
                            }}
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
                                <i className="far fa-building"/>
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="Company Name"
                            type="text"
                            onChange={(e) => {
                                setCompanyName(e.target.value)
                            }}
                        />
                    </InputGroup>
                </FormGroup>

                {/*company business number*/}
                <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="fas fa-briefcase"/>
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="Company Business Number"
                            type="number"
                            onChange={(e) => {
                                setCompanyBsnum(e.target.value)
                            }}
                        />
                        <Button color="primary" outline type="button" onClick={authBsnum}>
                            인증
                        </Button>
                    </InputGroup>
                </FormGroup>

                <FormGroup>
                    <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="fas fa-comment"/>
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            placeholder="Kakao Business ID"
                            type="text"
                            onChange={(e) => {
                                setCompanyKakaoBizId(e.target.value)
                            }}
                        />
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
