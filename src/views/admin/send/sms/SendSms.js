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
import SmsMessageRule from './SmsMessageRule'
import Receiver from "../Receiver";
import SmsTemplateModal from "./SmsTemplateModal";
import SmsImageUpload from "./SmsImageUpload";
import {Image} from "react-bootstrap";
import MessageSchedule from "../MessageSchedule";
import iphone from '../../../../assets/img/brand/iphone.jpg';
import {ChatBubble, Message} from 'react-chat-ui';
import styled from "styled-components";
import Swal from 'sweetalert2'

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
    const [selectTemplate, setSelectTemplate] = useState();
    const getSelectTemplate = (data) => {
        setSelectTemplate(data);
        setMessageContext(messageContext + data)
    }

    // 이미지 모달 -> 메인페이지 데이터 전달
    const [selectImage, setSelectImage] = useState([]);
    const getSelectImage = (data) => {
        setSelectImage([...data])
    }

    // 예약발송 모달 -> 메인페이지 데이터 전달
    const [cron, setCron] = useState("");
    const getCron = (data) => {
        setCron(data);
        console.log(cron)
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
    const [isBlock, setIsBlock] = useState(false);
    const [isTitle, setIstitle] = useState(false);
    const [message, setMessage] = useState("");
    const IphoneTime = () => {
        let now = new Date();
        let hour = now.getHours();
        let hourMod = hour <= 12 ? hour : hour - 12
        let min = now.getMinutes();
        console.log(hour)
        let PA = now.getHours() < 12 ? "오전" : "오후";
        return PA + ' ' + hourMod + '시 ' + min + '분'
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
    const messageWithBlockNumber = <>{messageContext}<br/><br/>무료수신거부: <BlockCss>{blockNumber}</BlockCss></>
    const messageWithTitle = <><TitleCss>{messageTitle}</TitleCss><br/><BodyCss>{messageContext}</BodyCss></>
    const messageWithBlockerNumberAndTitle = <>
        <TitleCss>{messageTitle}</TitleCss><br/><BodyCss>{messageContext}</BodyCss><br/><br/>무료수신거부:<BlockCss>{blockNumber}</BlockCss></>

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
        var l = 0;

        for (var idx = 0; idx < messageContext.length; idx++) {
            var c = escape(messageContext.charAt(idx));

            if (c.length == 1) l++;
            else if (c.indexOf("%u") != -1) l += 2;
            else if (c.indexOf("%") != -1) l += c.length / 3;
        }

        isBlock ? setMessageByte(l + 29) : setMessageByte(l)
    });

    // SenderNumber 불러오기
    const [senderNumberList, setSenderNumberList] = useState([]);
    useState(async () => {
        await axios.get('/sender/all')
            .then((response) => {
                if (response.data.isSuccess) {
                    setSenderNumberList(response.data.result)
                }
            })
            .catch((error) => {
                // 에러핸들링
            })
    })

    // 메시지 전송
    const sendMessage = async () => {
        await axios.post('/message/send/sms', {
            "message"  : {
                "from"       : senderNumber,
                "subject"    : messageTitle,
                "content"    : messageContext,
                "images"     : selectImage,
                "messageType": messageType
            },
            "receivers": selectContactList.map(contact => contact.phoneNumber)
        }).then((response) => {
            if (response.data.isSuccess) {
                console.log("시간: ", response)
                Swal.fire({
                    title            : '메시지를 전송했습니다',
                    icon             : 'success',
                    showConfirmButton: false,
                    timer            : 1000
                })
            } else {
                window.alert(response.data.message)
            }
        })
            .catch((error) => {
                window.alert(error.response.data.message)
            })
    }


    // 미리보기 출력 텍스트
    useEffect(() => {
            if (isBlock && isTitle) {
                setMessage(messageWithBlockerNumberAndTitle)
            } else if (isBlock) {
                setMessage(messageWithBlockNumber)
            } else if (isTitle) {
                setMessage(messageWithTitle)
            } else {
                setMessage(messageContext)
            }
        }
        , [messageTitle, isBlock, messageContext])

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
            <SmsMessageRule isShowingMessageRule={isShowingMessageRule} hide={toggleMessageRule}/>
            <SmsTemplateModal
                isShowingTemplate={isShowingTemplate}
                hide={toggleTemplate}
                selectTemplate={selectTemplate}
                setSelectTemplate={getSelectTemplate}
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
                                        <h3 className="mb-0" style={{paddingTop: 10}}>SMS 발송 &nbsp;&nbsp;
                                        </h3>
                                    </Col>
                                </Row>
                            </CardHeader>

                            <CardFooter className="py-3">
                                <Row>
                                    <Col sm="10">
                                        <div className="d-flex justify-content-between"
                                             style={{paddingBottom: 20, flexDirection: "row"}} align="center">
                                            <Button color="secondary" size="lg" type="button"
                                                    style={{width: 150, height: 60, fontSize: 16}}
                                                    onClick={(e) => toggleImageUpload()}>

                                                <span className="btn-inner--icon">
                                                  <i className="ni ni-album-2"/>
                                                </span>
                                                <span className="btn-inner--text">사진</span>
                                            </Button>

                                            {/*발신자 드롭다운*/}
                                            <UncontrolledDropdown>
                                                <DropdownToggle
                                                    size="lg"
                                                    caret
                                                    color="secondary"
                                                    type="button"
                                                    style={{width: 150, height: 60, fontSize: 16}}
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
                                                        }}>
                                                            {"[" + sn.memo + "] " + makeHyphen(sn.phoneNumber)}
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </UncontrolledDropdown>

                                            <Button color="secondary" size="lg" type="button"
                                                    style={{width: 150, height: 60, fontSize: 16}} onClick={(e) => {
                                                blockNumber == null ? Swal.fire({
                                                        title            : '발신번호를 선택하세요',
                                                        icon             : 'warning',
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
                                            <Button color="secondary" size="lg" type="button"
                                                    style={{width: 150, height: 60, fontSize: 16}}
                                                    onClick={(e) => toggleTemplate()}>
                                                <span className="btn-inner--icon">
                                                  <i className="ni ni-caps-small"/>
                                                </span>
                                                <span className="btn-inner--text">템플릿</span>
                                            </Button>
                                            <Button color="secondary" size="lg" type="button"
                                                    style={{width: 150, height: 60, fontSize: 16}}
                                                    onClick={(e) => toggleMessageRule()}>
                                                <span className="btn-inner--icon">
                                                  <i className="ni ni-time-alarm"/>
                                                </span>
                                                <span className="btn-inner--text">발송설정</span>
                                            </Button>
                                            <Button color="secondary" size="lg" type="button"
                                                    style={{width: 150, height: 60, fontSize: 16}}
                                                    onClick={(e) => toggleReceiver()}>
                                                <span className="btn-inner--icon">
                                                  <i className="ni ni-circle-08"/>
                                                </span>
                                                <span className="btn-inner--text">수신자</span>
                                            </Button>
                                        </div>
                                    </Col>


                                    <Col sm="6">
                                        <CardBody style={{boxShadow: '1px 2px 9px #8c8c8c'}}>
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
                                                                               color="primary">{makeHyphen(contact.phoneNumber)}</Badge>
                                                                    ) : null
                                                                ))}
                                                            </p>
                                                        ))}
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
                                                    color     : '#b1b1b4'
                                                }}>{`문자 메시지\n(오늘) ${IphoneTime()} `}</div>
                                                <ChatBubble
                                                    message={messageInput}
                                                    bubbleStyles={
                                                        {
                                                            text      : {
                                                                fontSize: 12,
                                                                color   : 'black'
                                                            },
                                                            chatbubble: {
                                                                borderRadius   : 20,
                                                                paddingLeft    : 14,
                                                                margin         : 10,
                                                                maxWidth       : 250,
                                                                backgroundColor: '#e5e5e6',
                                                            }
                                                        }
                                                    }
                                                />

                                            </div>
                                        </div>
                                    </Col>

                                </Row>
                                <Button className="btn-icon btn-3" size="xl" color="primary" type="button"
                                        style={{width: "15%", height: 54, margin: 10, fontSize: 17, float: "right"}}
                                        onClick={(e) => sendMessage()}>
                  <span className="btn-inner--icon">
                    <i className="ni ni-send text-white"/>
                  </span>
                                    <span className="btn-inner--text">발송하기</span>
                                </Button>

                                <Button className="btn-icon btn-3" size="xl" color="primary" type="button"
                                        style={{width: "15%", height: 54, margin: 10, fontSize: 17, float: "right",}}
                                        onClick={(e) => toggleMessageSchedule()}>
                  <span className="btn-inner--icon">
                    <i className="ni ni-time-alarm"/>
                  </span>
                                    <span className="btn-inner--text">예약 발송</span>
                                </Button>
                                <br></br>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default SendSms;
