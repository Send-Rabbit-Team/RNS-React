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

const Profile = () => {

  const [isModal, setIsModal] = useState(false);

  const [pointInfo, setPointInfo] = useState({});

  const [smsPoint, setSmsPoint] = useState(0);
  const [kakaoPoint, setKakaoPoint] = useState(0);

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
    // (smsPoint & kakaoPoint) === 0 ? window.alert("구매할 당근의 개수를 입력하세요") :
    //   window.confirm(`메시지 당근 ${smsPoint}개와 카카오 당근 ${kakaoPoint}개를 결제하시겠습니까?`) ?
        await axios.get("/point/charge",{
          params : {
            smsPoint : smsPoint,
            kakaoPoint : kakaoPoint,
          }
        }).then((response) => {
          if (response.data.isSuccess) {
            window.location.replace(response.data.result)
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
                  <i className="fa fa-envelope" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                  min="0"
                  className="form-control-alternative"
                  defaultValue={smsPoint}
                  type="number"
                  onChange={(e) => {setSmsPoint(e.target.value)}}
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
                  <i className="fas fa-comment" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                  min="0"
                  className="form-control-alternative"
                  defaultValue={kakaoPoint}
                  type="number"
                  onChange={(e) => {setKakaoPoint(e.target.value)}}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>개</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Row>

        </div>

        {/*modal footer*/}
        <div className="modal-footer">
          <Button color="primary" type="button" onClick={(e) => chargePoint()}>
            충전하기
          </Button>
        </div>
      </Modal>


      <UserHeader />
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
                        src={require("../../assets/img/theme/rabbit-user.jpg")}
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
                        <span className="heading">{pointInfo.smsPoint}개</span>
                        <span className="description">메시지 당근 <i className="fa fa-carrot"/></span>
                      </div>
                      <div>
                        <span className="heading">{pointInfo.kakaoPoint}개</span>
                        <span className="description">알림톡 당근 <i className="fa fa-carrot"/></span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    Jessica Jones
                    <span className="font-weight-light">, 27</span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    Bucharest, Romania
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    University of Computer Science
                  </div>
                  <hr className="my-4" />
                  <div>
                    <Button
                        size="lg"
                        style={{backgroundColor : "#f9e000"}}
                        href="#pablo"
                        onClick={(e) => setIsModal(true)}
                    ><i className="fa fa-comment"/>&nbsp;
                      카카오페이로 충전하기
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
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Settings
                    </Button>
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
                            htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="lucky.jesse"
                            id="input-username"
                            placeholder="Username"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="jesse@example.com"
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="Lucky"
                            id="input-first-name"
                            placeholder="First name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="Jesse"
                            id="input-last-name"
                            placeholder="Last name"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                            id="input-address"
                            placeholder="Home Address"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="New York"
                            id="input-city"
                            placeholder="City"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country
                          </label>
                          <Input
                            className="form-control-alternative"
                            defaultValue="United States"
                            id="input-country"
                            placeholder="Country"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Postal code
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-postal-code"
                            placeholder="Postal code"
                            type="number"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>About Me</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        rows="4"
                        defaultValue="A beautiful Dashboard for Bootstrap 4. It is Free and
                        Open Source."
                        type="textarea"
                      />
                    </FormGroup>
                  </div>
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
