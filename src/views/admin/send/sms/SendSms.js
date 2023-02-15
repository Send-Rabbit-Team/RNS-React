import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Container,
    Row,
    Col,
    Button,
    Input,
    FormGroup,
    Badge,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import React, {useEffect, useState} from "react";
import axios from "axios";
import SmsMessageRule from "./SmsMessageRule"
import Receiver from "../Receiver";
import SmsTemplateModal from "./SmsTemplateModal";
import SmsImageUpload from "./SmsImageUpload";
import {Image} from "react-bootstrap";
import MessageSchedule from "../MessageSchedule";
import iphone from "../../../../assets/img/brand/iphone.jpg";
import {ChatBubble, Message} from "react-chat-ui";
import styled from "styled-components";
import Swal from "sweetalert2"
import {Pie} from "react-chartjs-2";

const SendSms = () => {

    // Modal
    const useModalMessageRule = () => {
        const [isShowingMessageRule, setIsShowingMessageRule] = useState(false);

        function toggleMessageRule() {
            setIsShowingMessageRule(!isShowingMessageRule);
        }

        return {
            isShowingMessageRule,
            toggleMessageRule
        };
    };

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

    const {isShowingMessageRule, toggleMessageRule} = useModalMessageRule();
    const {isShowingReceiver, toggleReceiver} = useModalReceiver();
    const {isShowingTemplate, toggleTemplate} = useModalTemplate();
    const {isShowingImageUpload, toggleImageUpload} = useModalImageUpload();
    const {isShowingMessageSchedule, toggleMessageSchedule} = useModalMessageSchedule();

    // 발신자 번호 변수
    const [senderNumber, setSenderNumber] = useState();
    const [blockNumber, setBlockNumber] = useState();
    const [senderMemo, setSenderMemo] = useState();

    // 발송 규칙 모달 -> 메인페이지 데이터 전달
    const [smsKTRate, setSmsKTRate] = useState(0);
    const getSmsKTRate = (data) => {
        setSmsKTRate(data);
    }
    const [smsSKTRate, setSmsSKTRate] = useState(0);
    const getSmsSKTRate = (data) => {
        setSmsSKTRate(data);
    }
    const [smsLGRate, setSmsLGRate] = useState(0);
    const getSmsLGRate = (data) => {
        setSmsLGRate(data);
    }

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


    // 연락처 format 수정 메소드
    const makeHyphen = (number) => {
        return number.slice(0, 3) + "-" +
            number.slice(3, 7) + "-" +
            number.slice(7, 11)
    }

    // 미리보기화면
    const [messageContext, setMessageContext] = useState("")
    const [messageTitle, setMessageTitle] = useState("")
    const [messageBlock, setMessageBlock] = useState("")
    const [isBlock, setIsBlock] = useState(false);
    const [isTitle, setIstitle] = useState(false);
    const [message, setMessage] = useState("");
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

    // CSS
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

    // 미리보기 메시지 내용
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
                        <BlockCss>{messageBlock}</BlockCss>
                    </>
                ) : null}
            </>
        setMessage(message)
    }, [messageTitle, messageContext, isBlock, blockNumber])

    // 메시지 타입 지정
    const [messageType, setMessageType] = useState()
    useEffect(() => {
        selectImage.length != 0 ? setMessageType("MMS") :
            messageByte > 80 ?
                setMessageType("LMS") : setMessageType("SMS")
    });

    // 메시지 바이트 변환
    const [messageByte, setMessageByte] = useState()
    useEffect(() => {
        var messageTotal = isBlock ? messageTitle + messageContext + messageBlock : messageTitle + messageContext;
        var l = 0;

        for (var idx = 0; idx < messageTotal.length; idx++) {
            var c = escape(messageTotal.charAt(idx));

            if (c.length == 1) l++;
            else if (c.indexOf("%u") != -1) l += 2;
            else if (c.indexOf("%") != -1) l += c.length / 3;
        }

        setMessageByte(l)
    });

    // SenderNumber 불러오기
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

    // 메시지 전송
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

    const onChangeTitleHandler = (v) => {
        if (isTitle) {
            setMessageTitle(v)
        } else {
            setIstitle(true)
            setMessageTitle(v)
        }
    }

    return (
        <>
            {/* 발송 설정 모달 */}
            <SmsMessageRule
                isShowingMessageRule={isShowingMessageRule}
                hide={toggleMessageRule}
                smsKTRate={smsKTRate}
                smsSKTRate={smsSKTRate}
                smsLGRate={smsLGRate}
                setSmsKTRate={getSmsKTRate}
                setSmsSKTRate={getSmsSKTRate}
                setSmsLGRate={getSmsLGRate}
            />
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

            {/* 메인 페이지 */}
            <Header/>
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row>
                                    <Col>
                                        <h3 className="mb-0" style={{paddingTop: 10}}>메시지 발송 &nbsp;&nbsp;
                                        </h3>
                                    </Col>
                                </Row>
                            </CardHeader>

                            <CardBody className="py-3">
                                <Row>
                                    <Col lg={2} sm={4} className="mb-4">
                                        <Button color="secondary" size="lg" type="button" block
                                                style={{height: 60}}
                                                onClick={(e) => toggleImageUpload()}>

                                                <span className="btn-inner--icon">
                                                  <i className="ni ni-album-2"/>
                                                </span>
                                            <span className="btn-inner--text">사진</span>
                                        </Button>
                                    </Col>
                                    <Col lg={2} sm={4} className="mb-4">
                                        <UncontrolledDropdown>
                                            <DropdownToggle
                                                size="lg"
                                                caret
                                                color="secondary"
                                                type="button"
                                                style={{height: 60}}
                                            >
                                                      <span className="btn-inner--icon">
                                                        <i className="fas fa-phone"/>
                                                      </span>
                                                <span className="btn-inner--text">발신자</span>
                                            </DropdownToggle>

                                            <DropdownMenu aria-labelledby="dropdownMenuButton">
                                                {senderNumberList.map(sn => (
                                                    <DropdownItem onClick={(e) => {
                                                        setSenderMemo(sn.memo)
                                                        setSenderNumber(sn.phoneNumber)
                                                        setBlockNumber(sn.blockNumber)
                                                        setMessageBlock("\n무료수신거부: " + sn.blockNumber)
                                                    }}>
                                                        {sn.memo + " (" + makeHyphen(sn.phoneNumber) + ")"}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Col>
                                    <Col lg={2} sm={4} className="mb-4">
                                        <Button color="secondary" size="lg" type="button" block
                                                style={{height: 60}} onClick={(e) => {
                                            blockNumber == null ? Swal.fire({
                                                    title            : "발신번호를 선택하세요",
                                                    icon             : "warning",
                                                    showConfirmButton: false,
                                                    timer            : 1000
                                                }) :
                                                isBlock == true ? setIsBlock(false) : setIsBlock(true)
                                        }}>
                                                <span className="btn-inner--icon">
                                                  <i className="ni ni-tag"/>
                                                </span>
                                            <span className="btn-inner--text">수신거부</span>
                                        </Button>
                                    </Col>
                                    <Col lg={2} sm={4} className="mb-4">
                                        <Button color="secondary" size="lg" type="button" block
                                                style={{height: 60}}
                                                onClick={(e) => toggleTemplate()}>
                                                <span className="btn-inner--icon">
                                                  <i className="ni ni-caps-small"/>
                                                </span>
                                            <span className="btn-inner--text">템플릿</span>
                                        </Button>
                                    </Col>
                                    <Col lg={2} sm={4} className="mb-4">
                                        <Button color="secondary" size="lg" type="button" block
                                                style={{height: 60}}
                                                onClick={(e) => toggleMessageRule()}>
                                                <span className="btn-inner--icon">
                                                  <i className="ni ni-time-alarm"/>
                                                </span>
                                            <span className="btn-inner--text">발송설정</span>
                                        </Button>
                                    </Col>
                                    <Col lg={2} sm={4} className="mb-4">
                                        <Button color="secondary" size="lg" type="button" block
                                                style={{height: 60}}
                                                onClick={(e) => toggleReceiver()}>
                                                <span className="btn-inner--icon">
                                                  <i className="ni ni-circle-08"/>
                                                </span>
                                            <span className="btn-inner--text">수신자</span>
                                        </Button>
                                    </Col>


                                    <Col sm="6">
                                        <CardBody style={{boxShadow: "1px 2px 9px #8c8c8c"}}>
                                            <FormGroup>
                                                <label className="form-control-label">
                                                    발송 비용
                                                </label>
                                                <Container>
                                                    <Row>
                                                        <Badge className="badge-md m-1" color="primary">
                                                            메시지 당근 {selectContactList.length * messageCost[messageType]}개
                                                        </Badge>
                                                    </Row>
                                                </Container>
                                            </FormGroup>

                                            <FormGroup>
                                                <label className="form-control-label">
                                                    발신자
                                                </label>
                                                <Container>
                                                    <Row>
                                                        <Badge className="badge-md m-1"
                                                               color="primary">{senderNumber != null ? senderMemo + " (" + makeHyphen(senderNumber) + ")" : null}</Badge>
                                                    </Row>
                                                </Container>
                                            </FormGroup>
                                            <FormGroup>
                                                <label className="form-control-label">
                                                    수신자
                                                </label>
                                                <Container>
                                                    <Row>
                                                        {selectContactGroupList.map(contactGroup => (
                                                            <p>
                                                                <Badge className="badge-md m-1"
                                                                       color="info">{contactGroup.name}</Badge>
                                                                {selectContactList.map((contact) => (
                                                                    (contact.groupId === contactGroup.id) ? (
                                                                        <Badge className="badge-md m-1"
                                                                               color="primary">{contact.memo} ({makeHyphen(contact.phoneNumber)})</Badge>
                                                                    ) : null
                                                                ))}
                                                            </p>
                                                        ))}
                                                        <p>
                                                            {selectContactList.map((contact) => (
                                                                (contact.groupId === 0) ? (
                                                                    <Badge className="badge-md m-1"
                                                                           color="primary">{contact.memo} ({makeHyphen(contact.phoneNumber)})</Badge>
                                                                ) : null
                                                            ))}
                                                        </p>
                                                    </Row>
                                                </Container>
                                            </FormGroup>
                                            <FormGroup>
                                                <label className="form-control-label">
                                                    첨부 이미지
                                                </label>
                                                <Container>
                                                    <Row>
                                                        {selectImage.map((item, index) => (
                                                            <div className="col-sm-3" key={index}>
                                                                <Image className="d-block w-100 m-1"
                                                                       src={item}/>
                                                            </div>
                                                        ))}
                                                    </Row>
                                                </Container>
                                            </FormGroup>
                                            <FormGroup>
                                                <label className="form-control-label">
                                                    제목
                                                </label>
                                                <Input
                                                    // style={{fontWeight:"bold",color:"red"}}
                                                    value={messageTitle}
                                                    rows="1"
                                                    type="textarea"
                                                    onChange={(e) => {
                                                        onChangeTitleHandler(e.target.value)
                                                    }}
                                                ></Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <label className="form-control-label">
                                                    메시지 내용
                                                </label>
                                                <Input
                                                    value={messageContext}
                                                    rows="5"
                                                    type="textarea"
                                                    onChange={(e) => {
                                                        setMessageContext(e.target.value)
                                                    }}
                                                ></Input>
                                                <p align="right">{messageType}&nbsp;{messageByte}byte</p>
                                            </FormGroup>

                                            <FormGroup>
                                                <label className="form-control-label">
                                                    수신차단번호
                                                </label>
                                                <Container>
                                                    {isBlock ?
                                                        <Row>
                                                            <Badge className="badge-md"
                                                                   color="primary">{blockNumber != null ? makeHyphen(blockNumber) : null}</Badge>
                                                        </Row>
                                                        : null}
                                                </Container>
                                            </FormGroup>

                                            <FormGroup>
                                                <label className="form-control-label">
                                                    예약 발송 정보
                                                </label>
                                                <Container>
                                                    <Row>
                                                        <Badge className="badge-md" color="primary">{cronText}</Badge>
                                                    </Row>
                                                </Container>
                                            </FormGroup>

                                            <FormGroup>
                                                <label className="form-control-label">
                                                    발송 비율 정보
                                                </label>
                                                <Container>
                                                    <Row>
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
                                                    </Row>
                                                </Container>
                                            </FormGroup>
                                        </CardBody>
                                    </Col>
                                    {/* 메시지 미리보기  */}
                                    <Col sm="6" style={{paddingLeft: 80}}>
                                        <div style={{
                                            backgroundImage : `url(${iphone})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize  : "80%",
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
                            </CardBody>

                            <CardFooter className="border-0">
                                <Button className="text-lg ml-3 btn-icon btn-3" size="xxl" color="primary" type="button"
                                        style={{float: "right"}}
                                        onClick={(e) => validMessage()}>
                                    <span className="btn-inner--icon">
                                        <i className="ni ni-send text-white"/>
                                    </span>
                                    <span className="btn-inner--text">발송하기</span>
                                </Button>

                                <Button className="text-lg btn-icon btn-3" size="xxl" color="primary" type="button"
                                        style={{float: "right",}}
                                        onClick={(e) => toggleMessageSchedule()}>
                                    <span className="btn-inner--icon">
                                        <i className="ni ni-time-alarm"/>
                                    </span>
                                    <span className="btn-inner--text">예약 발송</span>
                                </Button>
                            </CardFooter>

                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default SendSms;
