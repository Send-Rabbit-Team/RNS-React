import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col, Modal, InputGroup, InputGroupAddon, InputGroupText, Label
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import axios from "axios";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";

const Profile = () => {

    const [isModal, setIsModal] = useState(false);

    const [pointInfo, setPointInfo] = useState({});

    const [smsPoint, setSmsPoint] = useState(0);
    const [kakaoPoint, setKakaoPoint] = useState(0);

    const [userInfo, setUserInfo] = useState({});

    useEffect(async () => {
        await axios.get("/userinfo")
            .then((response) => {
                if (response.data.isSuccess) {
                    setUserInfo(response.data.result)
                    console.log("userInfo : " + userInfo)
                } else {
                    console.log(response.data.error)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    useEffect(async () => {
        await axios.get("/point/get")
            .then((response) => {
                if (response.data.isSuccess) {
                    setPointInfo(response.data.result)
                } else {
                    console.log(response.data.error)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [pointInfo])

    const chargePoint = async () => {
        smsPoint + kakaoPoint === 0 ? await Swal.fire({
                title            : "충전할 당근 개수를 입력하세요",
                icon             : "error",
                showConfirmButton: false,
                timer            : 1000
            }) :
            await Swal.fire({
                title            : `${smsPoint * 10 + kakaoPoint * 7} 원을 결제하시겠습니까?`,
                icon             : "question",
                showDenyButton   : true,
                confirmButtonText: "네",
                denyButtonText   : "아니요"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.get("/point/charge", {
                        params: {
                            smsPoint  : smsPoint,
                            kakaoPoint: kakaoPoint,
                        }
                    }).then((response) => {
                        if (response.data.isSuccess) {
                            window.location.replace(response.data.result)
                        }
                    })
                }
            })

        // : null
    }

    return (
        <>
            {/* modal */}
            <Modal
                className="modal-dialog-centered"
                isOpen={isModal}
            >

                {/*modal header*/}
                <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                        당근 충전하기
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setIsModal(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                {/*modal body*/}
                <div className="modal-body ml-4 mr-5">

                    {/*input memo*/}
                    <Row className="mb-3">
                        <label className="form-control-label m-auto col-4">
                            문자 당근
                        </label>
                        <InputGroup className="input-group-alternative col-8">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fa fa-envelope"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                min="0"
                                className="form-control-alternative"
                                defaultValue={smsPoint}
                                type="number"
                                onChange={(e) => {
                                    setSmsPoint(e.target.value)
                                }}
                            />
                            <InputGroupAddon addonType="append">
                                <InputGroupText>개</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Row>

                    {/*input phoneNumber*/}
                    <Row className="mb-3">
                        <label className="form-control-label m-auto col-4">
                            알림톡 당근
                        </label>
                        <InputGroup className="input-group-alternative col-8">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-comment"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                min="0"
                                className="form-control-alternative"
                                defaultValue={kakaoPoint}
                                type="number"
                                onChange={(e) => {
                                    setKakaoPoint(e.target.value)
                                }}
                            />
                            <InputGroupAddon addonType="append">
                                <InputGroupText>개</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </Row>

                    <Row className="mt-5">
                        <label className="form-control-label m-auto col-4">
                            총 금액
                        </label>
                        <label className="form-control-label text-right col-8">
                            {smsPoint * 10 + kakaoPoint * 7} 원
                        </label>
                    </Row>

                </div>

                {/*modal footer*/}
                <div className="modal-footer">
                    <Button color="primary" type="button" onClick={(e) => chargePoint()}>
                        충전하기
                    </Button>
                </div>
            </Modal>


            <UserHeader/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                        <Card className="card-profile shadow">
                            <Row className="justify-content-center">
                                <Col className="order-lg-2" lg="3">
                                    <div className="card-profile-image">
                                        <a href="views/admin/Profile#pablo" onClick={(e) => e.preventDefault()}>
                                            <img
                                                alt="..."
                                                className="rounded-circle"
                                                src={require("../../assets/img/theme/rabbit-user2.png")}
                                            />
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                            <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">

                            </CardHeader>
                            <CardBody className="pt-0 pt-md-4">
                                <Row>
                                    <div className="col">
                                        <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                            <div>
                                                <span className="heading"><i
                                                    className="fas fa-carrot"/> {pointInfo.smsPoint}개</span>
                                                <span className="description">보유한 메시지 당근</span>
                                            </div>
                                            <div>
                                                <span className="heading"><i
                                                    className="fas fa-carrot"/> {pointInfo.kakaoPoint}개</span>
                                                <span className="description">보유한 알림톡 당근</span>
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                                <div className="text-center">
                                    <h3>
                                        <span className="font-weight-light">안녕하세요, </span>
                                        {userInfo.name}
                                        <span className="font-weight-light">님</span>
                                    </h3>
                                    {/*<div className="h5 font-weight-300">*/}
                                    {/*  <i className="ni location_pin mr-2" />*/}
                                    {/*  Bucharest, Romania*/}
                                    {/*</div>*/}
                                    {/*<div className="h5 mt-4">*/}
                                    {/*  <i className="ni business_briefcase-24 mr-2" />*/}
                                    {/*  Solution Manager - Creative Tim Officer*/}
                                    {/*</div>*/}
                                    {/*<div>*/}
                                    {/*  <i className="ni education_hat mr-2" />*/}
                                    {/*  University of Computer Science*/}
                                    {/*</div>*/}
                                    <hr className="my-4"/>
                                    <div>
                                        <Button
                                            size="lg"
                                            style={{backgroundColor: "#f9e000"}}
                                            href="#pablo"
                                            onClick={(e) => setIsModal(true)}
                                        ><i className="fa fa-comment"/>&nbsp;
                                            카카오페이로 당근 충전하기
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="order-xl-1" xl="8">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                    <Col xs="8">
                                        <h3 className="mb-0">My account</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <h6 className="heading-small text-muted mb-4">
                                        User information
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                    >
                                                        회원명
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        type="text"
                                                        value={userInfo.name}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                    >
                                                        휴대폰 번호
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        type="text"
                                                        value={userInfo.phoneNumber}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="12">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                    >
                                                        이메일 주소
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        type="email"
                                                        value={userInfo.email}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </div>


                                    {userInfo.memberType === "COMPANY" ? (
                                        <>
                                            <hr className="my-4"/>
                                            <h6 className="heading-small text-muted mb-4">
                                                Company information
                                            </h6>
                                            <div className="pl-lg-4">
                                                <Row>
                                                    <Col md="12">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                            >
                                                                회사명
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                type="text"
                                                                value={userInfo.companyName}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                            >
                                                                사업자 번호
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                type="text"
                                                                value={userInfo.bsNum}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                            >
                                                                카카오 비즈 ID
                                                            </label>
                                                            <Input
                                                                className="form-control-alternative"
                                                                type="text"
                                                                value={userInfo.kakaoBizId}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </>
                                    ) : null}
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profile;
