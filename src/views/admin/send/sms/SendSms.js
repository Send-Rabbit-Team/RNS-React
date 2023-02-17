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
// core components
import UserHeader from "components/Headers/UserHeader.js";
import axios from "axios";
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";
import {ChatBubble, Message} from "react-chat-ui";
import styled from "styled-components";
import SmsTemplateModal from "./SmsTemplateModal";
import SmsImageUpload from "./SmsImageUpload";
import Receiver from "../Receiver";
import MessageSchedule from "../MessageSchedule";
import {Image} from "react-bootstrap";
import {Pie} from "react-chartjs-2";
import iphone from "../../../../assets/img/brand/iphone.png";

const Profile = () => {

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

    // 탬플릿 모달 -> 메인페이지 데이터 전달
    const [selectTemplateTitle, setSelectTemplateTitle] = useState();
    const getSelectTemplateTitle = (data) => {
        setSelectTemplateTitle(data);
        setMessageTitle(data)
    }
    const [selectTemplateContent, setSelectTemplateContent] = useState();
    const getSelectTemplateContent = (data) => {
        setSelectTemplateContent(data);
        setMessageContext(data)
    }

    // 이미지 모달 -> 메인페이지 데이터 전달
    const [selectImage, setSelectImage] = useState([]);
    const getSelectImage = (data) => {
        setSelectImage([...data])
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

    // 메시지 바이트 변환 메소드
    const [messageByte, setMessageByte] = useState()
    useEffect(() => {
        var messageTotal = isBlock ? messageTitle + messageContext + "\n" + messageBlock : messageTitle + messageContext;
        var l = 0;

        for (var idx = 0; idx < messageTotal.length; idx++) {
            var c = escape(messageTotal.charAt(idx));

            if (c.length == 1) l++;
            else if (c.indexOf("%u") != -1) l += 2;
            else if (c.indexOf("%") != -1) l += c.length / 3;
        }

        setMessageByte(l)
    });

    // 메시지 타입 지정 메소드
    const [messageType, setMessageType] = useState()
    useEffect(() => {
        selectImage.length != 0 ? setMessageType("MMS") :
            messageByte > 80 ?
                setMessageType("LMS") : setMessageType("SMS")
    });

    // 미리보기 화면 변수
    const [messageTitle, setMessageTitle] = useState("")
    const [messageContext, setMessageContext] = useState("")
    const [messageBlock, setMessageBlock] = useState("")
    const [message, setMessage] = useState("");

    const [isBlock, setIsBlock] = useState(false);

    const IphoneTime = () => {
        let now = new Date();
        let hour = now.getHours();
        let hourMod = hour <= 12 ? hour : hour - 12
        let min = now.getMinutes();
        // console.log(hour)
        let PA = now.getHours() < 12 ? "오전" : "오후";
        return PA + " " + hourMod + "시 " + min + "분"
    }


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

    // 미리보기 화면 css
    const BlockCss = styled.text`
  font-size: 13px;
  color: blue;
  border:0px;
  background: #e5e5e6;
  text-decoration: underline;
  `;
    const TitleCss = styled.text`
  font-size: 14px;
  font-weight:bold;
  background: #e5e5e6;
  border:0px;
  `;

    const BodyCss = styled.text`
  font-size: 13px;
  background: #e5e5e6;
  border:0px;
  `;

    // 미리보기 화면
    useEffect(() => {
        let message =
            <>
                {messageTitle ? (
                    <>
                        <TitleCss>{messageTitle}</TitleCss>
                        <br/>
                    </>
                ) : null}

                <BodyCss>{messageContext}</BodyCss>

                {isBlock ? (
                    <>
                        <br/>
                        <BlockCss>{messageBlock}</BlockCss>
                    </>
                ) : null}
            </>
        setMessage(message)
    }, [messageTitle, messageContext, isBlock, messageBlock])


    // 발송 규칙 불러오기
    const [smsKTRate, setSmsKTRate] = useState(0);
    const [smsSKTRate, setSmsSKTRate] = useState(0);
    const [smsLGRate, setSmsLGRate] = useState(0);
    useEffect(async () => {
        await axios.get(`/msg/rule/getAll`)
            .then((response) => {
                if (response.data.isSuccess) {
                    console.log(response.data.result.messageRules)
                    response.data.result.messageRules.map(messageRule => {
                        console.log(response.data.result.messageRules)
                        if (messageRule.brokerId == 1) {
                            setSmsKTRate(messageRule.brokerRate);
                        } else if (messageRule.brokerId == 2) {
                            setSmsLGRate(messageRule.brokerRate)
                        } else {
                            setSmsSKTRate(messageRule.brokerRate);
                        }
                    })
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    // 발송 규칙 변경하기
    const applySendRule = async () => {
        parseInt(smsLGRate) + parseInt(smsSKTRate) + parseInt(smsKTRate) !== 100 ? (
            await Swal.fire({
                title            : "발송 비율의 합을 100으로 설정하세요",
                icon             : 'error',
                showConfirmButton: false,
                timer            : 1000,
            })
        ) : await axios.patch(`/msg/rule/edit`, {
            "messageRules": [
                {
                    "brokerId"  : 1,
                    "brokerRate": smsKTRate
                },
                {
                    "brokerId"  : 2,
                    "brokerRate": smsSKTRate
                },
                {
                    "brokerId"  : 3,
                    "brokerRate": smsLGRate
                }
            ]
        }).then(async (response) => {
            if (response.data.isSuccess) {
                await Swal.fire({
                    title            : '발송 설정을 변경했습니다.',
                    icon             : 'success',
                    showConfirmButton: false,
                    timer            : 1000,
                })
            } else {
                await Swal.fire({
                    title            : response.data.message,
                    icon             : 'error',
                    showConfirmButton: false,
                    timer            : 1000,
                })
                console.log(response.data.message)
            }
        })
            .catch(async (error) => {
                await Swal.fire({
                    title            : '발송 설정을 변경하는데 오류가 발생했습니다.',
                    icon             : 'error',
                    showConfirmButton: false,
                    timer            : 1000,
                })
                console.log(error)
            })
    }


    // SenderNumber 불러오기
    const [senderNumber, setSenderNumber] = useState();
    const [senderNumberList, setSenderNumberList] = useState([]);
    useEffect(async () => {
        await axios.get("/sender/all")
            .then((response) => {
                if (response.data.isSuccess) {
                    console.log(response.data.result)
                    setSenderNumberList(response.data.result)
                } else {
                    console.log(response.data.messagge)
                }
            })
            .catch((error) => console.log(error))
    }, [])

    // SmsPoint 불러오기
    const [smsPoint, setSmsPoint] = useState(0)
    useEffect(async () => {
        await axios.get("/point/get")
            .then(response => {
                if (response.data.isSuccess) {
                    console.log(response.data.result.smsPoint)
                    setSmsPoint(response.data.result.smsPoint)
                } else {
                    console.log(response.data.message)
                }
            }).catch(error => console.log(error))
    }, [])

    const messageCost = {
        "SMS": 1,
        "LMS": 3,
        "MMS": 6
    }

    const validMessage = async () => {
        !senderNumber ? await Swal.fire({
            title            : "발신번호를 선택하세요",
            icon             : "warning",
            showConfirmButton: false,
            timer            : 1000
        }) : !messageContext ? await Swal.fire({
            title            : "메시지 내용을 입력하세요",
            icon             : "warning",
            showConfirmButton: false,
            timer            : 1000
        }) : selectContactList.length === 0 ? await Swal.fire({
            title            : "수신번호를 선택하세요",
            icon             : "warning",
            showConfirmButton: false,
            timer            : 1000
        }) : validPoint()
    }

    const validPoint = async () => {
        await axios.get("/point/valid", {
            params: {
                smsPoint  : selectContactList.length * messageCost[messageType],
                kakaoPoint: 0
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
            text             : `당근 ${selectContactList.length * messageCost[messageType] - smsPoint}개가 부족합니다`,
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : "아니요",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.get("/point/charge", {
                    params: {
                        smsPoint  : selectContactList.length * messageCost[messageType] - smsPoint,
                        kakaoPoint: 0
                    }
                }).then(response => {
                    if (response.data.isSuccess) {
                        window.open(response.data.result)
                        window.close()
                    }
                })
            }
        })

    }

    const sendMessage = async () => {
        Swal.fire({
            title            : "결제를 진행하시겠습니까?",
            text             : `메시지 당근 ${selectContactList.length * messageCost[messageType]}개가 차감됩니다.`,
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : "아니요",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.post("/message/send/sms", {
                    "message"  : {
                        "from"          : senderNumber,
                        "subject"       : messageTitle,
                        "content"       : isBlock ? messageContext + messageBlock : messageContext,
                        "images"        : selectImage,
                        "messageType"   : messageType,
                        "cronExpression": cron,
                        "cronText"      : cronText,
                    },
                    "receivers": selectContactList.map(contact => contact.phoneNumber)
                }).then(async (response) => {
                    if (response.data.isSuccess) {
                        await Swal.fire({
                            title            : "메시지를 전송했습니다",
                            text             : response.data.result,
                            icon             : "success",
                            showConfirmButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.replace("/admin/result/sms/:type/:keyword/:page")
                            }
                        })

                    } else {
                        Swal.fire({
                            title            : response.data.message,
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    }
                }).catch((error) => {
                    Swal.fire({
                        title            : "메시지 전송에 실패했습니다",
                        icon             : "error",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                })
            }
        })
    }


    return (
        <>
            {/* 발송 설정 모달 */}
            <SmsTemplateModal
                isShowingTemplate={isShowingTemplate}
                hide={toggleTemplate}
                selectTemplateTitle={selectTemplateTitle}
                setSelectTemplateTitle={getSelectTemplateTitle}
                selectTemplateContent={selectTemplateContent}
                setSelectTemplateContent={getSelectTemplateContent}
            />
            <SmsImageUpload
                isShowingImageUpload={isShowingImageUpload}
                hide={toggleImageUpload}
                selectImage={selectImage}
                setSelectImage={getSelectImage}
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
                                        <h3 className="mb-0">메시지 발송</h3>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <h6 className="heading-small text-muted mb-4">
                                        발신번호
                                        <Button
                                            style={{float: "right"}}
                                            color="primary"
                                            onClick={(e) => {
                                                senderNumber == null ? Swal.fire({
                                                        title            : "발신번호를 선택하세요",
                                                        icon             : "warning",
                                                        showConfirmButton: false,
                                                        timer            : 1000
                                                    }) :
                                                    isBlock == true ? setIsBlock(false) : setIsBlock(true)
                                            }}
                                            size="sm"
                                        >
                                            ✓ Block Number
                                        </Button>
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="12">
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                    >
                                                        발신번호
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        type="select"
                                                        onChange={(e) => {
                                                            setSenderNumber(e.target.value)
                                                            senderNumberList.map(sn => {
                                                                if (sn.phoneNumber === e.target.value) {
                                                                    setMessageBlock("수신차단번호: " + sn.blockNumber)
                                                                }
                                                            })
                                                        }}
                                                    >
                                                        <option value={null}>발신번호를 선택하세요</option>
                                                        {senderNumberList.map(sn => (
                                                            <option key={sn.id}
                                                                    value={sn.phoneNumber}>{sn.memo + " (" + makeHyphen(sn.phoneNumber) + ")"}</option>
                                                        ))}

                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            {isBlock ? (
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                        >
                                                            차단번호
                                                        </label>
                                                        <Input
                                                            value={messageBlock}
                                                            className="form-control-alternative"
                                                            type="text"
                                                            onChange={(e) => setMessageBlock(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            ) : null}
                                        </Row>
                                    </div>

                                    <hr className="my-4"/>

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
                                                                <Badge className="badge-md m-1" color="info">{contactGroup.name}</Badge>
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
                                        메시지 작성
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
                                                        메시지 제목
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
                                                        메시지 내용
                                                    </label>
                                                    <Input
                                                        value={messageContext}
                                                        className="form-control-alternative"
                                                        type="textarea"
                                                        style={{height: 200}}
                                                        onChange={(e) => setMessageContext(e.target.value)}
                                                    />
                                                    <p className="text-right">{messageType}&nbsp;{messageByte}byte</p>
                                                </FormGroup>
                                            </Col>
                                            {selectImage.length > 0 ? (
                                                <Col lg="12">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                        >
                                                            첨부 이미지
                                                        </label>
                                                        <Card className="form-control-alternative"
                                                              style={{height: 200, overflow: "auto"}}>
                                                            <CardBody>
                                                                <Row>
                                                                    {selectImage.map((item, index) => (
                                                                        <div className="col-sm-3" key={index}>
                                                                            <Image className="d-block w-100 m-1"
                                                                                   src={item}/>
                                                                        </div>
                                                                    ))}
                                                                </Row>
                                                            </CardBody>
                                                        </Card>
                                                    </FormGroup>
                                                </Col>
                                            ) : null}

                                        </Row>
                                    </div>

                                    <hr className="my-4"/>

                                    <h6 className="heading-small text-muted mb-4">
                                        발송 비율
                                        <Button
                                            style={{float: "right"}}
                                            color="primary"
                                            size="sm"
                                            onClick={(e) => applySendRule()}
                                        >
                                            Save Changes
                                        </Button>
                                    </h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="6" className="p-0">
                                                <Pie
                                                    data={{
                                                        labels  : ["KT", "SKT", "LG"],
                                                        datasets: [
                                                            {
                                                                data           : [smsKTRate, smsSKTRate, smsLGRate],
                                                                backgroundColor: [
                                                                    'rgba(255, 99, 132, 0.5)',
                                                                    'rgba(54, 162, 235, 0.5)',
                                                                    'rgba(255, 206, 86, 0.5)',
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
                                                    <Col lg="12">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                            >
                                                                KT
                                                            </label>
                                                            <Input
                                                                value={smsKTRate}
                                                                className="form-control-alternative"
                                                                type="number"
                                                                onChange={(e) => setSmsKTRate(e.target.value)}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="12">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                            >
                                                                SKT
                                                            </label>
                                                            <Input
                                                                value={smsSKTRate}
                                                                className="form-control-alternative"
                                                                type="number"
                                                                onChange={(e) => setSmsSKTRate(e.target.value)}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg="12">
                                                        <FormGroup>
                                                            <label
                                                                className="form-control-label"
                                                            >
                                                                LG
                                                            </label>
                                                            <Input
                                                                value={smsLGRate}
                                                                className="form-control-alternative"
                                                                type="number"
                                                                onChange={(e) => setSmsLGRate(e.target.value)}
                                                            />
                                                        </FormGroup>
                                                    </Col>
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
                                                     {messageType}
                                                </span>
                                                <span className="description">
                                                    메시지 타입
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
                                                    {selectContactList.length * messageCost[messageType]}개
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
                            backgroundImage : `url(${iphone})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize  : "100%",
                            height          : "100%",
                        }}>
                            <div style={{height: 110}}></div>
                            <div style={{height: 550, whiteSpace: "pre-wrap", width: 300, margin: 30}}>
                                <div style={{
                                    textAlign : "center",
                                    fontSize  : 10,
                                    fontWeight: "bold",
                                    color     : "#b1b1b4"
                                }}>{`문자 메시지\n(오늘) ${IphoneTime()} `}</div>
                                <ChatBubble
                                    message={messageInput}
                                    bubbleStyles={
                                        {
                                            text      : {
                                                fontSize: 12,
                                                color   : "black"
                                            },
                                            chatbubble: {
                                                borderRadius   : 20,
                                                paddingLeft    : 14,
                                                margin         : 10,
                                                maxWidth       : 250,
                                                backgroundColor: "#e5e5e6",
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
};

export default Profile;
