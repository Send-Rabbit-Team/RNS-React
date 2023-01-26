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
  InputGroup,
  InputGroupAddon,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import React, {useEffect, useState} from "react";
import axios from "axios";
import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements'
import MessageRule from './modal/MessageRule'
import Receiver from "./modal/Receiver";
import TemplateModal from "./modal/TemplateModal";
import ImageUpload from "./modal/ImageUpload";
import {Image} from "react-bootstrap";
import MessageSchedule from "./modal/MessageSchedule";
import iphone from '../../assets/img/brand/iphone.jpg';


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

  const { isShowingMessageRule, toggleMessageRule } = useModalMessageRule();
  const { isShowingReceiver, toggleReceiver } = useModalReceiver();
  const { isShowingTemplate, toggleTemplate } = useModalTemplate();
  const { isShowingImageUpload, toggleImageUpload } = useModalImageUpload();
  const { isShowingMessageSchedule, toggleMessageSchedule } = useModalMessageSchedule();

  // 발신자 번호 변수
  const [senderNumber, setSenderNumber] = useState();
  const [blockNumber, setBlockNumber] = useState();
  const [senderMemo, setSenderMemo] = useState();

  // 수신자 모달 -> 메인페이지 데이타 전달
  const [ContactNumberList, setContactNumberList] = useState([])
  const [contactGroupList, setContactGroupList] = useState([])
  const [selectIdList, setSelectIdList] = useState([]);
  const [selectNameList, setSelectNameList] = useState([]);
  const [selectContactList, setSelectContactList] = useState([]);
  const [selectContactGroupList, setSelectContactGroupList] = useState([]);

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

  // 수신거부
  const messageWithBlockNumber = `${messageContext} \n\n\n무료수신거부: ${blockNumber}`
  const messageWithTitle = `${messageTitle} \n\n\n${messageContext}`
  const messageWithBlockerNumberAndTitle = `${messageTitle} \n\n\n${messageContext} \n\n\n무료수신거부: ${blockNumber}`

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
    var l= 0;

    for(var idx=0; idx < messageContext.length; idx++) {
      var c = escape(messageContext.charAt(idx));

      if( c.length==1 ) l ++;
      else if( c.indexOf("%u")!=-1 ) l += 2;
      else if( c.indexOf("%")!=-1 ) l += c.length/3;
    }

    isBlock ? setMessageByte(l+29) : setMessageByte(l)
  });

  // SenderNumber 불러오기
  const [senderNumberList, setSenderNumberList] = useState([]);
  useState(async () => {
    await axios.get('/sender/all')
      .then((response) => {
        if (response.data.isSuccess) {
          setSenderNumberList(response.data.result)
        } else {
          window.alert(response.data.message)
        }
      })
      .catch((error) => {
        window.alert(error.response.data.message)
      })
  })

  // 메시지 전송
  const sendMessage = async()=>{

    await axios.post('/message/send',{
      "message":{
        "from": senderMemo,
        "subject": messageTitle, // 예나가 주제를 구현하고 추가하는 부분
        "content": messageContext,
        "image": selectImage,
        "messageType":"SMS"
      },
      "count":10000,
      "senderNumber":senderNumber,
      "receivers":selectContactList.map(contact=>contact.phoneNumber)
    }).then((response) => {
        if (response.data.isSuccess) {
          console.log("시간: ",response)
          window.alert(response.data.message)
        } else {
          window.alert(response.data.message)
        }
      })
      .catch((error) => {
        window.alert(error.response.data.message)
      })
  }

  // 테스트 중
  const selectContactGroupChild = (data) => {
    setSelectContactGroupList([...data])
  }

  const selectContactChild = (data) => {
    setSelectContactList([...data])
  }

  useEffect(()=>
  {
      console.log('I am In!')
      if(isBlock && isTitle){
        console.log('I am messageWithBlockerNumberAndTitle')
        setMessage(messageWithBlockerNumberAndTitle)
      } else if(isBlock){
        console.log('I am messageWithBlockNumber')
        setMessage(messageWithBlockNumber)
      } else if(isTitle){
        console.log('I am messageWithTitle')
        console.log(messageWithTitle)
        setMessage(messageWithTitle)
      } else {
        console.log('I am messageContext')
        setMessage(messageContext)
      }
  }
  ,[messageTitle,isBlock,messageContext])

  const onChangeTitleHandler=(v)=> {
    console.log("messageTitle: ",messageTitle)
    if(isTitle){
      setMessageTitle(v)
    } else {
      setIstitle(true)
      setMessageTitle(v)
    }
  }


  return (
    <>
      {/* 발송 설정 모달 */}
      <MessageRule isShowingMessageRule={isShowingMessageRule} hide={toggleMessageRule} />
      <TemplateModal
          isShowingTemplate={isShowingTemplate}
          hide={toggleTemplate}
          selectTemplate={selectTemplate}
          setSelectTemplate={getSelectTemplate}
      />
      <ImageUpload
          isShowingImageUpload={isShowingImageUpload}
          hide={toggleImageUpload}
          selectImage={selectImage}
          setSelectImage={getSelectImage}
      />
      <Receiver
        isShowingReceiver={isShowingReceiver}
        selectContactChild={selectContactChild}
        selectContactGroupChild={selectContactGroupChild}
        hide={toggleReceiver}
        selectContactListParent={selectContactList}
        selectContactGroupListParent={selectContactGroupList}
      />
      <MessageSchedule
          isShowingMessageSchedule={isShowingMessageSchedule}
          hide={toggleMessageSchedule}
          setCron={getCron}
      />

      {/* 메인 페이지 */}
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row>
                  <Col>
                    <h3 className="mb-0" style={{ paddingTop: 10 }}>SMS 발송 &nbsp;&nbsp;
                    </h3>
                  </Col>
                </Row>
              </CardHeader>

              <CardFooter className="py-3" >
                <Row >
                  <Col sm="10">
                    <div className="d-flex justify-content-between" style={{ paddingBottom: 20, flexDirection: "row" }} align="center" >
                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleImageUpload()}>
                        사진
                      </Button>

                      {/*발신자 드롭다운*/}
                      <UncontrolledDropdown>
                        <DropdownToggle
                          size="lg"
                          caret
                          color="secondary"
                          type="button"
                          style={{ width: 150, height: 60, fontSize: 16 }}
                        >
                          발신자
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

                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => {
                        blockNumber == null ? window.alert("발신번호를 선택하세요") :
                        isBlock == true ? setIsBlock(false) : setIsBlock(true)
                      }}>
                        수신거부
                      </Button>
                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleTemplate()}>
                        템플릿
                      </Button>
                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleMessageRule()}>
                        발송설정
                      </Button>
                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleReceiver()}>
                        수신자
                      </Button>
                    </div>
                  </Col>



                  <Col sm="8">
                    <CardBody style={{ boxShadow: '1px 2px 9px #8c8c8c' }}>
                      <FormGroup>
                        <label className="form-control-label">
                          발신자
                        </label>
                        <Container>
                          <Row>
                            <Badge className="badge-md m-1" color="primary">{senderNumber != null ? senderMemo + " (" + makeHyphen(senderNumber) + ")" : null}</Badge>
                          </Row>
                        </Container>
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">
                          수신자
                        </label>
                        <Container>
                          <Row>
                            {selectContactList.map(v => (
                                    <Badge className="badge-md m-1" color="primary">{makeHyphen(v.phoneNumber)}</Badge>
                                )
                            )}
                            {selectContactGroupList.map(v => (
                                    <Badge className="badge-md m-1" color="info">{v.name}</Badge>
                                )
                            )}
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
                            value={messageTitle}
                            rows="1"
                            type="textarea"
                            onChange={(e)=>{onChangeTitleHandler(e.target.value)}}
                        ></Input>
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">
                          메시지 내용
                        </label>
                        <Input
                            value={messageContext}
                            rows="10"
                            type="textarea"
                            onChange={(e)=>{setMessageContext(e.target.value)}}
                        ></Input>
                        <p align="right">{messageType}&nbsp;{messageByte}byte</p>
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">
                          수신차단번호
                        </label>
                        <Container>
                          {isBlock?
                              <Row>
                                <Badge className="badge-md" color="primary">{blockNumber != null ? makeHyphen(blockNumber) : null}</Badge>
                              </Row>
                              :null}
                        </Container>
                      </FormGroup>
                    </CardBody>
                  </Col>



                  <Col sm="4">
                    <div style={{
                      backgroundImage: `url(${iphone})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "100%",
                      height: "100%"
                    }}>
                      <div style={{height: 120}}></div>
                      <div style={{ height: 816, whiteSpace: "pre-wrap", width: 290, margin: 30, }}>
                        <MessageBox
                            style={{ whiteSpace: "pre-wrap" }}
                            position={'left'}
                            type={'text'}
                            text={message}
                        />
                      </div>
                    </div>
                  </Col>


                  {/* 미리 보기 / Bubble */}
                  <Col sm="6" >
                    <FormGroup style={{ position: "relative" }}>
                      <InputGroup className="input-group-alternative" style={{ boxShadow: '1px 2px 9px #8c8c8c' }}>
                        <InputGroupAddon addonType="prepend">
                          {/* 애드온 */}
                        </InputGroupAddon>
                        <Row style={{ height: 850 }}>
                          <Col>
                            <div style={{ height: 816, paddingTop: 60, margin: 30, whiteSpace: "pre-wrap", width: 500 }}>
                              <MessageBox
                                style={{ whiteSpace: "pre-wrap" }}
                                position={'left'}
                                type={'text'}
                                text={message}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row style={{ margin: 30 }}>

                          {/* 수신자 불러오기 */}
                          {selectContactList.map(v => {
                            return (
                              <Button color="primary" type="button" style={{ margin: 2 }}>
                                <span>{makeHyphen(v.phoneNumber)}</span>

                              </Button>
                            )
                          })}
                          {selectContactGroupList.map(v => {
                            return (
                              <Button color="info" type="button" style={{ margin: 2 }}>
                                <span>{v.name}</span>
                              </Button>
                            )
                          })}
                        </Row>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Button className="btn-icon btn-3" size="xl" color="primary" type="button" style={{ width: "15%", height: 54, margin: 10, fontSize: 22, float: "right"}} onClick={(e)=> sendMessage()}>
                  <span className="btn-inner--icon">
                    <i className="ni ni-send text-white" />
                  </span>
                  <span className="btn-inner--text">발송하기</span>
                </Button>

                <Button className="btn-icon btn-3" size="xl" color="primary" type="button" style={{ width: "15%", height: 54, margin: 10, fontSize: 22, float: "right", }} onClick={(e) => toggleMessageSchedule()}>
                  <span className="btn-inner--icon">
                    <i className="ni ni-time-alarm" />
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
