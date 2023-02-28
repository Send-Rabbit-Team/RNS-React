import React from "react";
import {useLocation, Route} from "react-router-dom";
import {Container, Row, Col, Card, CardBody, CardTitle} from "reactstrap";
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import TextAnimation from "react-text-animations";
import animation_sms from "../assets/img/brand/sms-animation.gif"
import {Button} from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";

const Onboarding = (props) => {
    var token = localStorage.getItem("bearer");

    const mainContent = React.useRef(null);
    const location = useLocation();


    React.useEffect(() => {
        document.body.classList.add("bg-default");
        return () => {
            document.body.classList.remove("bg-default");
        };
    }, []);

    React.useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        mainContent.current.scrollTop = 0;
    }, [location]);

    const chargePoint = async (smsPoint, kakaoPoint) => {
        if (!token) {
            await Swal.fire({
                title            : "로그인이 필요한 서비스입니다",
                icon             : 'error',
                showConfirmButton: false,
                timer            : 1000,
            })
            window.location.replace("/auth/login") }
        else {
            Swal.fire({
                title            : "결제 화면으로 이동하시겠습니까?",
                icon             : 'question',
                showConfirmButton: true,
                showDenyButton   : true,
                confirmButtonText: '네',
                denyButtonText   : `아니요`,
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
        }
    }

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === "/auth") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };

    const smsPromotion = [
        {"count": 500, "price": 5000},
        {"count": 1000, "price": 10000},
        {"count": 3000, "price": 30000},
        {"count": 5000, "price": 50000},
    ]

    const kakaoPromotion = [
        {"count": 500, "price": 3500},
        {"count": 1000, "price": 7000},
        {"count": 3000, "price": 21000},
        {"count": 5000, "price": 35000},
    ]

    return (
        <>
            <div className="main-content" ref={mainContent}>
                <AuthNavbar/>
                <div className="header bg-gradient-info py-7 py-lg-2">
                    <Container>
                        <div className="header-body">
                            <Row className="pt-6">
                                <Col lg="4" md="6">
                                    <h1 className="text-white"
                                        style={{fontSize: 60, paddingTop: 75, lineHeight: "140%"}}>Rabbit Notification
                                        Service</h1>
                                    <p className="text-lead text-light" style={{fontSize: 18}}>
                                        <TextAnimation.Slide animation={{
                                            duration      : 1000,
                                            delay         : 2000,
                                            timingFunction: 'ease-out',
                                        }} target="안전하게" text={['신속하게', '정확하게', '대량으로']}>
                                            당신의 메시지를 "안전하게" 전달해보세요
                                        </TextAnimation.Slide>
                                        <Row style={{paddingTop: 20, paddingLeft: 15}}>
                                            <Button button style={{width: 180, height: 60, fontSize: 25}}
                                                    color="primary" type="button"
                                                    href={token ? "/admin/sms" : "/auth/login"}>
                                                시작하기
                                            </Button>
                                        </Row>
                                    </p>
                                </Col>
                                <Col style={{marginLeft: 30}}>
                                    <div>
                                        <img src={animation_sms}
                                             style={{paddingLeft: 80, paddingBottom: 120, width: 630, height: 590}}
                                             alt="sms"/>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                    <div className="separator separator-bottom separator-skew zindex-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            version="1.1"
                            viewBox="0 0 2560 100"
                            x="0"
                            y="0"
                        >
                            <polygon
                                className="fill-default"
                                points="2560 0 2560 100 0 100"
                            />
                        </svg>
                    </div>
                </div>

                <br/>

                <Row className="m-5 p-0">
                    <Col md={6}>
                        <Row className="p-0">
                            {smsPromotion.map((item) => (
                                <Col className="p-0" sm={6}>
                                    <Button block className="p-0">
                                        <Card className="m-0">
                                            <CardBody className="text-center">
                                                <CardTitle>문자 당근</CardTitle>
                                                <h3>{item.count} <small>개</small></h3>
                                                <h1 className="text-primary">{item.price} <small>원</small></h1>
                                                <Button size="lg" outline color="primary"
                                                        onClick={(e) => chargePoint(item.count, 0)}>신청하기</Button>
                                            </CardBody>
                                        </Card>
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row className="p-0">
                            {kakaoPromotion.map((item) => (
                                <Col className="p-0" sm={6}>
                                    <Button block className="p-0">
                                        <Card className="m-0">
                                            <CardBody className="text-center"
                                                // style={{backgroundImage : `url(${rabbitImg})`}}
                                            >
                                                <CardTitle>알림톡 당근</CardTitle>
                                                <h3>{item.count} <small>개</small></h3>
                                                <h1 className="text-primary">{item.price} <small>원</small></h1>
                                                <Button size="lg" outline color="primary"
                                                        onClick={(e) => chargePoint(0, item.count)}>신청하기</Button>
                                            </CardBody>
                                        </Card>
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col className="m-3 text-light">
                        <li>발송 성공 시 단문 문자는 문자 당근 1개, 장문 문자는 문자 당근 3개, 포토 문자는 문자 당근 6개가 차감됩니다.</li>
                        <li>발송 성공 시 알림톡은 알림톡 당근 1개가 차감됩니다.</li>
                        <li>당근 5000개 이상 신청을 원하시는 경우 영업자와 상담하세요. 합리적인 가격에 서비스를 이용할 수 있습니다.</li>
                        <li>문자 발송 서비스는 전기통신사업법 발신번호 등록 정책에 따라, 인증된 발신번호만 사용할 수 있습니다.</li>
                    </Col>
                </Row>


            </div>
        </>
    );
};

export default Onboarding;
