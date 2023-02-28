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
    Col,
    Badge
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";
import axios from "axios";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import {ChatBubble, Message} from "react-chat-ui";
import Receiver from "../Receiver";
import MessageSchedule from "../MessageSchedule";
import {Image} from "react-bootstrap";
import {Pie} from "react-chartjs-2";
import KakaoTemplateModal from "./KakaoTemplateModal";
import KakaoImageUpload from "./KakaoImageUpload";
import iphonekakao from "../../../../assets/img/brand/iphonekakao.png";

const SendKakao = () => {

    var memberType = localStorage.getItem("member_type")

    const redirect = async () => {
        await Swal.fire({
            title            : "기업 회원만 이용 가능합니다",
            text             : "기업 아이디로 로그인 하세요",
            icon             : "error",
            showConfirmButton: false,
            timer            : 3000
        })
        window.location.replace("/admin/sms")
    }

    // Modal
    const useModalReceiver = () => {
        const [isShowingReceiver, setIsShowingReceiver] = useState(false);

        function toggleReceiver() {
            setIsShowingReceiver(!isShowingReceiver);
        }

        return {
            isShowingReceiver,
            toggleReceiver
        };
    };

    const useModalTemplate = () => {
        const [isShowingTemplate, setIsShowingTemplate] = useState(false);

        function toggleTemplate() {
            setIsShowingTemplate(!isShowingTemplate);
        }

        return {
            isShowingTemplate,
            toggleTemplate
        };
    };

    const useModalImageUpload = () => {
        const [isShowingImageUpload, setIsShowingImageUpload] = useState(false);

        function toggleImageUpload() {
            setIsShowingImageUpload(!isShowingImageUpload);
        }

        return {
            isShowingImageUpload,
            toggleImageUpload
        };
    };

    const useModalMessageSchedule = () => {
        const [isShowingMessageSchedule, setIsShowingMessageSchedule] = useState(false);

        function toggleMessageSchedule() {
            setIsShowingMessageSchedule(!isShowingMessageSchedule);
        }

        return {
            isShowingMessageSchedule,
            toggleMessageSchedule
        };
    };

    const {isShowingReceiver, toggleReceiver} = useModalReceiver();
    const {isShowingTemplate, toggleTemplate} = useModalTemplate();
    const {isShowingImageUpload, toggleImageUpload} = useModalImageUpload();
    const {isShowingMessageSchedule, toggleMessageSchedule} = useModalMessageSchedule();

    // 수신자 모달 -> 메인페이지 데이터 전달
    const [selectContactList, setSelectContactList] = useState([]);
    const getSelectContactList = (data) => {
        setSelectContactList(data);
    }
    const [selectContactGroupList, setSelectContactGroupList] = useState([]);
    const getSelectContactGroupList = (data) => {
        setSelectContactGroupList(data);
    }

    // 이미지 모달 -> 메인페이지 데이터 전달
    const [selectImage, setSelectImage] = useState(null);
    const getSelectImage = (data) => {
        setSelectImage(data)
    }
    const removeSelectImage = () => {
        setSelectImage(null)
    }

    // 예약발송 모달 -> 메인페이지 데이터 전달
    const [cron, setCron] = useState(null);
    const getCron = (data) => {
        setCron(data);
    }
    const [cronText, setCronText] = useState(null);
    const getCronText = (data) => {
        setCronText(data);
    }

    // 연락처 포맷 수정 메소드
    const makeHyphen = (number) => {
        return number.slice(0, 3) + "-" +
            number.slice(3, 7) + "-" +
            number.slice(7, 11)
    }


    // 미리보기 화면 변수
    const [messageTitle, setMessageTitle] = useState("")
    const [messageSubtitle, setMessageSubtitle] = useState("")
    const [messageContext, setMessageContext] = useState("")
    const [messageDescription, setMessageDescription] = useState("")
    const [buttonTitle, setButtonTitle] = useState("")
    const [buttonUrl, setButtonUrl] = useState("")
    const [buttonType, setButtonType] = useState(null)

    const [message, setMessage] = useState("");

    var messageInput = new Message({
        id        : 1,
        message   : message,
        senderName: "youngjoo"
    });

    useEffect(() => {
        messageInput = new Message({
            id     : 1,
            message: message,
        });
    }, [message])

    const ButtonCss = {
        width          : "100%",
        padding        : "8px 12px",
        borderRadius   : 5,
        fontSize       : 14,
        fontWeight     : 500,
        lineWeight     : 1.5,
        backgroundColor: "#f5f5f5",
        position       : "relative"
    }

    const ImageCss = {
        width       : "125%",
        paddingRight: 40,
        marginLeft  : -14,
    }


    // 미리보기 화면
    useEffect(() => {
        let kakaoMessage =
            <body style={{margin: 0}}>

            {selectImage ? (
                <>
                    <Image src={selectImage} style={ImageCss}></Image>
                    <br/>
                    <br/>
                </>
            ) : null}

            {messageTitle ? (
                <h2>{messageTitle}</h2>
            ) : null}

            {messageSubtitle ? (
                <>
                    <h5 className="text-muted">{messageSubtitle}</h5>
                </>
            ) : null}

            <p style={{fontSize: "14px"}}>{messageContext}</p>

            {messageDescription ? (
                <>
                    <small className="text-muted">{messageDescription}</small>
                    <br/>
                </>
            ) : null}

            {buttonUrl && buttonTitle && buttonType ? (
                <Button style={ButtonCss} href={buttonUrl} className="mt-3 mb-3">{buttonTitle}</Button>
            ) : null}

            </body>

        setMessage(kakaoMessage)
    }, [selectImage, messageTitle, messageSubtitle, messageContext, messageDescription, buttonUrl, buttonTitle, buttonType])


    //발송 규칙 불러오기
    const [kakaoMessageRule, setKakaoMessageRule] = useState([])
    useEffect(async () => {
        await axios.get('/kakao/msg/rule/get')
            .then((response) => {
                if (response.data.isSuccess) {
                    setKakaoMessageRule(response.data.result);
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    // 발송 규칙 수정
    const editKakaoMsgRule = async () => {
        var sum = 0
        kakaoMessageRule.map((item) => {
            sum += parseInt(item.kakaoBrokerRate)
        })
        sum !== 100 ?
            await Swal.fire({
                title            : "발송 비율의 합을 100으로 설정하세요",
                icon             : "error",
                showConfirmButton: true,
                timer            : 1000
            }) :
            await axios.patch('/kakao/msg/rule/edit', kakaoMessageRule)
                .then(async (response) => {
                    if (response.data.isSuccess) {
                        await Swal.fire({
                            title            : "발송 설정을 변경했습니다",
                            icon             : "success",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    } else {
                        await Swal.fire({
                            title            : response.data.message,
                            icon             : "error",
                            showConfirmButton: true,
                            timer            : 1000
                        })
                    }
                })
                .catch(async (error) => {
                    await Swal.fire({
                        title            : "발송 설정 변경에 실패했습니다",
                        icon             : "error",
                        showConfirmButton: true,
                        timer            : 1000
                    })
                })
    }

    // 기업 정보 불러오기
    const [companyKakaoBizId, setCompanyKakaoBizId] = useState("");
    useEffect(async () => {
        await axios.get("/userinfo")
            .then((response) => {
                if (response.data.isSuccess) {
                    setCompanyKakaoBizId(response.data.result.kakaoBizId)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    })

    // KakaoPoint 불러오기
    const [kakaoPoint, setKakaoPoint] = useState(0)
    useEffect(async () => {
        await axios.get("/point/get")
            .then(response => {
                if (response.data.isSuccess) {
                    setKakaoPoint(response.data.result.kakaoPoint)
                } else {
                    console.log(response.data.message)
                }
            }).catch(error => console.log(error))
    }, [])


    const validMessage = async () => {
        messageTitle == "" ? Swal.fire({
            title            : "알림톡 제목을 입력하세요",
            icon             : "error",
            showConfirmButton: false,
            timer            : 1000
        }) : messageContext == "" ? Swal.fire({
            title            : "알림톡 내용을 입력하세요",
            icon             : "error",
            showConfirmButton: false,
            timer            : 1000
        }) : selectContactList.length == 0 ? Swal.fire({
            title            : "수신번호를 선택하세요",
            icon             : "error",
            showConfirmButton: false,
            timer            : 1000
        }) : validPoint()
    }

    const validPoint = async () => {
        await axios.get("/point/valid", {
            params: {
                smsPoint  : 0,
                kakaoPoint: selectContactList.length
            }
        }).then(async (response) => {
            if (response.data.isSuccess) {
                sendMessage()
            } else {
                chargePoint()
            }
        }).catch(async (error) => {
            await Swal.fire({
                title            : error.response.data.message,
                icon             : "error",
                showConfirmButton: false,
                timer            : 1000
            })
            console.log(error)
        })
    }

    const chargePoint = async () => {
        Swal.fire({
            title            : "카카오 페이로 결제하시겠습니까?",
            text             : `당근 ${selectContactList.length - kakaoPoint}개가 부족합니다`,
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : "아니요",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.get("/point/charge", {
                    params: {
                        smsPoint  : 0,
                        kakaoPoint: selectContactList.length - kakaoPoint
                    }
                }).then(response => {
                    if (response.data.isSuccess) {
                        window.open(response.data.result)
                    }
                })
            }
        })
    }

    // 메시지 전송
    const sendMessage = async () => {
        Swal.fire({
            title            : "결제를 진행하시겠습니까?",
            text             : `알림톡 당근 ${selectContactList.length}개가 차감됩니다.`,
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : "아니요",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.post("/message/send/kakao", {
                    "kakaoMessageDto": {
                        "from"          : companyKakaoBizId,
                        "title"         : messageTitle,
                        "subtitle"      : messageSubtitle,
                        "content"       : messageContext,
                        "description"   : messageDescription,
                        "image"         : selectImage,
                        "buttonTitle"   : buttonTitle,
                        "buttonType"    : buttonType,
                        "buttonUrl"     : buttonUrl,
                        "cronExpression": cron,
                        "cronText"      : cronText,
                    },
                    "receivers"      : selectContactList.map(contact => contact.phoneNumber)
                }).then(async (response) => {
                    if (response.data.isSuccess) {
                        await Swal.fire({
                            title            : "메시지를 전송했습니다",
                            text             : response.data.result,
                            icon             : "success",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                        window.location.replace("/admin/result/kakao/:type/:keyword/:page")

                    } else {
                        await Swal.fire({
                            title            : response.data.message,
                            icon             : "error",
                            showConfirmButton: true,
                            timer            : 1000
                        })
                    }
                })
                    .catch(async (error) => {
                        await Swal.fire({
                            title            : "메시지 전송에 실패했습니다",
                            icon             : "error",
                            showConfirmButton: true,
                            timer            : 1000
                        })
                    })
            }
        })
    }

    if (memberType === "COMPANY")
        return (
            <>
                {/* 발송 설정 모달 */}
                <KakaoTemplateModal
                    isShowingTemplate={isShowingTemplate}
                    hide={toggleTemplate}
                    setMessageTitle={setMessageTitle}
                    setMessageSubtitle={setMessageSubtitle}
                    setMessageContext={setMessageContext}
                    setMessageDescription={setMessageDescription}
                    setButtonTitle={setButtonTitle}
                    setButtonUrl={setButtonUrl}
                    setButtonType={setButtonType}
                />
                <KakaoImageUpload
                    isShowingImageUpload={isShowingImageUpload}
                    hide={toggleImageUpload}
                    selectImage={selectImage}
                    setSelectImage={getSelectImage}
                    removeSelectImage={removeSelectImage}
                />
                <Receiver
                    isShowingReceiver={isShowingReceiver}
                    hide={toggleReceiver}
                    selectContactList={selectContactList}
                    selectContactGroupList={selectContactGroupList}
                    setSelectContactList={getSelectContactList}
                    setSelectContactGroupList={getSelectContactGroupList}
                />
                <MessageSchedule
                    isShowingMessageSchedule={isShowingMessageSchedule}
                    hide={toggleMessageSchedule}
                    setCron={getCron}
                    setCronText={getCronText}
                />


                <UserHeader/>
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <Row>
                        <Col md="8">
                            <Card className="bg-secondary shadow">
                                <CardHeader className="bg-white border-0">
                                    <Row className="align-items-center">
                                        <Col xs="8">
                                            <h3 className="mb-0">알림톡 발송</h3>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <h6 className="heading-small text-muted mb-4">
                                            수신번호
                                            <Button
                                                style={{float: "right"}}
                                                color="primary"
                                                onClick={(e) => toggleReceiver()}
                                                size="sm"
                                            >
                                                + Contact
                                            </Button>
                                        </h6>
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col lg="12">
                                                    <Card className="form-control-alternative"
                                                          style={{height: 200, overflow: "auto"}}>
                                                        <CardBody>
                                                            <div className="mb-3">
                                                                {selectContactList.map((contact) => (
                                                                    (contact.groupId === 0) ? (
                                                                        <Badge className="badge-md m-1"
                                                                               color="primary">{contact.memo} ({makeHyphen(contact.phoneNumber)})</Badge>
                                                                    ) : null
                                                                ))}
                                                            </div>

                                                            {selectContactGroupList.map(contactGroup => (
                                                                <div className="mb-3">
                                                                    <Badge className="badge-md m-1"
                                                                           color="info">{contactGroup.name}</Badge>
                                                                    <br/>
                                                                    {selectContactList.map((contact) => (
                                                                        (contact.groupId === contactGroup.id) ? (
                                                                            <Badge className="badge-md m-1"
                                                                                   color="primary">{contact.memo} ({makeHyphen(contact.phoneNumber)})</Badge>
                                                                        ) : null
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </CardBody>
                                                    </Card>
                                                </Col>

                                            </Row>
                                        </div>

                                        <hr className="my-4"/>

                                        <h6 className="heading-small text-muted mb-4">
                                            알림톡 작성
                                            <Button
                                                style={{float: "right"}}
                                                color="primary"
                                                onClick={(e) => toggleTemplate()}
                                                size="sm"
                                            >
                                                + Templates
                                            </Button>
                                            <Button
                                                className="mr-3"
                                                style={{float: "right"}}
                                                color="primary"
                                                onClick={(e) => toggleImageUpload()}
                                                size="sm"
                                            >
                                                + Upload Images
                                            </Button>
                                        </h6>
                                        {/*</Col>*/}
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                        >
                                                            알림톡 제목
                                                        </label>
                                                        <Input
                                                            value={messageTitle}
                                                            className="form-control-alternative"
                                                            type="text"
                                                            onChange={(e) => setMessageTitle(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                        >
                                                            알림톡 소제목
                                                        </label>
                                                        <Input
                                                            value={messageSubtitle}
                                                            className="form-control-alternative"
                                                            type="text"
                                                            onChange={(e) => setMessageSubtitle(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                        >
                                                            알림톡 내용
                                                        </label>
                                                        <Input
                                                            value={messageContext}
                                                            className="form-control-alternative"
                                                            type="textarea"
                                                            style={{height: 200}}
                                                            onChange={(e) => setMessageContext(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                        >
                                                            알림톡 부가정보
                                                        </label>
                                                        <Input
                                                            value={messageDescription}
                                                            className="form-control-alternative"
                                                            type="textarea"
                                                            style={{height: 200}}
                                                            onChange={(e) => setMessageDescription(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>

                                        <hr className="my-4"/>

                                        <h6 className="heading-small text-muted mb-4">
                                            알림톡 버튼
                                        </h6>
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                        >
                                                            알림톡 버튼 이름
                                                        </label>
                                                        <Input
                                                            value={buttonTitle}
                                                            className="form-control-alternative"
                                                            type="text"
                                                            onChange={(e) => setButtonTitle(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                        >
                                                            알림톡 버튼 링크
                                                        </label>
                                                        <Input
                                                            value={buttonUrl}
                                                            className="form-control-alternative"
                                                            type="text"
                                                            onChange={(e) => setButtonUrl(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                        >
                                                            알림톡 버튼 종류
                                                        </label>
                                                        <Input
                                                            value={buttonType}
                                                            className="form-control-alternative"
                                                            type="select"
                                                            onChange={(e) => setButtonType(e.target.value)}
                                                        >
                                                            <option>선택</option>
                                                            <option value="DS" selected={buttonType === "DS"}>배송 조회</option>
                                                            <option value="WL" selected={buttonType === "WL"}>웹 링크</option>
                                                            <option value="AL" selected={buttonType === "AL"}>앱 링크</option>
                                                            <option value="BK" selected={buttonType === "BK"}>봇 키워드</option>
                                                            <option value="MD" selected={buttonType === "MD"}>메시지 전달</option>
                                                            <option value="AC" selected={buttonType === "AC"}>채널 추가</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>

                                        <hr className="my-4"/>

                                        <h6 className="heading-small text-muted mb-4">
                                            발송 비율
                                            <Button
                                                style={{float: "right"}}
                                                color="primary"
                                                size="sm"
                                                onClick={(e) => editKakaoMsgRule()}
                                            >
                                                Save Changes
                                            </Button>
                                        </h6>
                                        <div className="pl-lg-4">
                                            <Row>
                                                <Col lg="6" className="p-0">
                                                    <Pie
                                                        data={{
                                                            labels  : kakaoMessageRule.map(item => item.kakaoBrokerName),
                                                            datasets: [
                                                                {
                                                                    data           : kakaoMessageRule.map(item => item.kakaoBrokerRate),
                                                                    backgroundColor: [
                                                                        'rgba(255, 99, 132, 0.5)',
                                                                        'rgba(54, 162, 235, 0.5)',
                                                                    ],
                                                                    borderWidth    : 1,
                                                                },
                                                            ],
                                                        }}
                                                        options={{
                                                            title: {
                                                                display: true,
                                                                text   : "발송 비율 정보"
                                                            }
                                                        }}
                                                    ></Pie>
                                                </Col>
                                                <Col lg="6">
                                                    <Row>
                                                        {kakaoMessageRule.map((item) => (
                                                            <Col lg="12">
                                                                <FormGroup>
                                                                    <label
                                                                        className="form-control-label"
                                                                    >
                                                                        {item.kakaoBrokerName}
                                                                    </label>
                                                                    <Input
                                                                        defaultValue={item.kakaoBrokerRate}
                                                                        value={item.kakaoBrokerRate}
                                                                        className="form-control-alternative"
                                                                        type="number"
                                                                        onChange={(e) => {
                                                                            setKakaoMessageRule(
                                                                                kakaoMessageRule.map((k) =>
                                                                                    k.kakaoMessageRuleId === item.kakaoMessageRuleId ? {
                                                                                        ...k,
                                                                                        kakaoBrokerRate: e.target.value
                                                                                    } : k
                                                                                )
                                                                            )
                                                                        }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>

                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col md="4">
                            <Card className="card-profile shadow mb-3">
                                <CardBody>
                                    <Row className="mb-3">
                                        <div className="col p-0">
                                            <div className="card-profile-stats d-flex justify-content-center p-0">
                                                <div>
                                                <span className="heading">
                                                     {companyKakaoBizId}
                                                </span>
                                                    <span className="description">
                                                    카카오 비즈 ID
                                                </span>
                                                </div>
                                                <div>
                                                <span className="heading">
                                                    {selectContactList.length}명
                                                </span>
                                                    <span className="description">
                                                    수신자 수
                                                </span>
                                                </div>
                                                <div>
                                                <span className="heading">
                                                    {selectContactList.length}개
                                                </span>
                                                    <span className="description">
                                                    총 필요 당근
                                                </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Row>
                                    <div className="text-center">
                                        <Button
                                            block
                                            color="primary"
                                            size="lg"
                                            onClick={(e) => validMessage()}
                                        ><i className="ni ni-send"/>&nbsp;
                                            발송하기
                                        </Button>
                                        <hr/>
                                        <p>{!cronText ? "설정된 예약 없음" : cronText}</p>
                                        <Button
                                            block
                                            color="primary"
                                            size="lg"
                                            onClick={(e) => toggleMessageSchedule()}
                                        ><i className="ni ni-time-alarm"/>&nbsp;
                                            예약 설정
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>

                            <div style={{
                                backgroundImage : `url(${iphonekakao})`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize  : "100%",
                                height          : "100%",
                            }}>
                                <div style={{height: 250}}></div>
                                <div style={{
                                    height    : 550,
                                    whiteSpace: "pre-wrap",
                                    width     : 350,
                                    margin    : 30
                                }}>
                                    <ChatBubble
                                        message={messageInput}
                                        bubbleStyles={
                                            {
                                                text      : {
                                                    fontSize: 12,
                                                    color   : "black"
                                                },
                                                chatbubble: {
                                                    borderTop      : "40px solid #F7E600",
                                                    borderRadius   : 20,
                                                    paddingLeft    : 14,
                                                    margin         : 10,
                                                    width          : 300,
                                                    backgroundColor: "white",
                                                }
                                            }
                                        }
                                    />

                                </div>
                            </div>


                        </Col>
                    </Row>
                </Container>
            </>
        );
    else {
        redirect()
    }
};

export default SendKakao;
