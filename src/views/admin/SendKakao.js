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
import 'react-chat-elements/dist/main.css'
import MessageRule from './modal/MessageRule'
import Receiver from "./modal/Receiver";
import KakaoTemplateModal from "./modal/KakaoTemplateModal";
import ImageUpload from "./modal/ImageUpload";
import {Image} from "react-bootstrap";
import MessageSchedule from "./modal/MessageSchedule";
import iphonekakao from '../../assets/img/brand/iphonekakao.png';
import { ChatBubble, Message } from 'react-chat-ui';
import styled from "styled-components";

const SendKakao = () => {

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
  const [senderMemo, setSenderMemo] = useState();

  // 수신자 모달 -> 메인페이지 데이타 전달
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
  const [messageTitle, setMessageTitle] = useState("")
  const [messageSubtitle, setMessageSubtitle] = useState("")
  const [messageContext, setMessageContext] = useState("")
  const [messageDescription, setMessageDescription] = useState("")
  const [buttonTitle, setButtonTitle] = useState("알림톡 버튼")
  const [buttonUrl, setButtonUrl] = useState("")
  const [buttonType, setButtonType] = useState("")

  const [isTitle, setIstitle] = useState(false);
  const [isSubtitle, setIsSubtitle] = useState(false);
  const [isDescription, setIsDescription] = useState(false);
  const [isButton, setIsButton] = useState(false);
  const [message, setMessage] = useState("");

  const IphoneTime = ()=>{
    let now = new Date();
    let hour = now.getHours();
    let hourMod = hour<=12?hour:hour-12
    let min = now.getMinutes();
    console.log(hour)
    let PA = now.getHours() < 12 ? "오전" : "오후";
    return PA+' '+hourMod+'시 '+min+'분'
  }


  var messageInput = new Message({
    id: 1,
    message: message,
    senderName: "youngjoo"
  });

  useEffect(()=>{
    messageInput = new Message({
      id: 1,
      message: message,
    });
  },[message])

   // CSS
   const TitleCss = styled.text`
   font-size: 20px;
   font-weight:bold;
   border:0px;
   `;
   const SubtitleCss = styled.text`
   font-size: 10px;
   font-weight:bold;
   border:0px;
   `;

   const BodyCss = styled.text`
   font-size: 13px;
   font-weight:500;
   border:0px;
   `;

   const DescriptionCss = styled.text`
   font-size: 13px;
   border:0px;
   color:grey;
   `;

   const ButtonCss = {
    width:"100%", 
    padding:"8px 12px", 
    borderRadius:5, 
    fontSize:14, 
    fontWeight:500, 
    lineWeight:1.5, 
    backgroundColor:'#f5f5f5',
    position:'relative'
   }

   const ImageCss = {
    width:"125%",
    paddingRight:27,
    marginLeft:-14,
   }

  // 모두
  const messageWithAll =
    <body style={{margin: 0}}>
      <Image src="https://img.etnews.com/photonews/2107/1432751_20210708160744_846_0001.jpg" style={ImageCss}></Image>
      <br/><br/>
      <TitleCss>{messageTitle}</TitleCss>
      <br/>
      <SubtitleCss>{messageSubtitle}</SubtitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
      <br/>
      <DescriptionCss>{messageDescription}</DescriptionCss>
      <br/><br/>
      <Button style={ButtonCss} href="#pablo">{buttonTitle}</Button>
    </body>

const messageWithTSD =
    <>
      <TitleCss>{messageTitle}</TitleCss>
      <br/>
      <SubtitleCss>{messageSubtitle}</SubtitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
      <br/>
      <DescriptionCss>{messageDescription}</DescriptionCss>
    </>

const messageWithTSB =
    <>
      <TitleCss>{messageTitle}</TitleCss>
      <br/>
      <SubtitleCss>{messageSubtitle}</SubtitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
      <br/><br/>
      <Button style={ButtonCss} href="#pablo">{buttonTitle}</Button>
    </>

const messageWithSDB =
    <>
      <SubtitleCss>{messageSubtitle}</SubtitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
      <br/>
      <DescriptionCss>{messageDescription}</DescriptionCss>
      <br/><br/>
      <Button style={ButtonCss} href="#pablo">{buttonTitle}</Button>
    </>

const messageWithTS =
    <>
      <TitleCss>{messageTitle}</TitleCss>
      <br/>
      <SubtitleCss>{messageSubtitle}</SubtitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
    </>

const messageWithTD =
    <>
      <TitleCss>{messageTitle}</TitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
      <br/>
      <DescriptionCss>{messageDescription}</DescriptionCss>
    </>

const messageWithTB =
    <>
      <TitleCss>{messageTitle}</TitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
      <br/><br/>
      <Button style={ButtonCss} href="#pablo">{buttonTitle}</Button>
    </>

const messageWithSD =
    <>
      <SubtitleCss>{messageSubtitle}</SubtitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
      <br/>
      <DescriptionCss>{messageDescription}</DescriptionCss>
    </>

const messageWithSB =
    <>
      <SubtitleCss>{messageSubtitle}</SubtitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
      <br/><br/>
      <Button style={ButtonCss} href="#pablo">{buttonTitle}</Button>
    </>

const messageWithDB =
    <>
      <BodyCss>{messageContext}</BodyCss>
      <br/>
      <DescriptionCss>{messageDescription}</DescriptionCss>
      <br/><br/>
      <Button style={ButtonCss} href="#pablo">{buttonTitle}</Button>
    </>

const messageWithTitle =
    <>
      <TitleCss>{messageTitle}</TitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
    </>
const messageWithSubtitle =
    <>
      <SubtitleCss>{messageSubtitle}</SubtitleCss>
      <br/>
      <BodyCss>{messageContext}</BodyCss>
    </>
const messageWithDescription =
    <>
      <BodyCss>{messageContext}</BodyCss>
      <br/>
      <DescriptionCss>{messageDescription}</DescriptionCss>
    </>

const messageWithBlock=
    <>
      <BodyCss>{messageContext}</BodyCss>
      <br/><br/>
      <Button style={ButtonCss} href="#pablo">{buttonTitle}</Button>
    </>

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

    isButton ? setMessageByte(l+29) : setMessageByte(l)
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

    await axios.post('/message/send/kakao',{
      "kakaoMessageDto":{
        "from": senderMemo,
        "title": messageTitle,
        "subtitle": messageSubtitle,
        "content": messageContext,
        "description":messageDescription,
        "image":selectImage,
        "kakaoButtonDtoList":[
          {
            buttonTitle: buttonTitle,
            buttonType:buttonType,
            buttonUrl: buttonUrl
          }
        ]
      },
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



  // 미리보기 출력 텍스트
  useEffect(()=>
  {
    if(isTitle && isSubtitle && isDescription && isButton){
      setMessage(messageWithAll)
    } else if(isTitle && isSubtitle && isDescription){
      setMessage(messageWithTSD)
    } else if(isTitle && isSubtitle && isButton){
      setMessage(messageWithTSB)
    } else if(isSubtitle && isDescription && isButton){
      setMessage(messageWithSDB)
    } else if(isTitle && isSubtitle){
      setMessage(messageWithTS)
    } else if(isTitle && isDescription){
      setMessage(messageWithTD)
    } else if(isTitle && isButton){
      setMessage(messageWithTB)
    } else if(isSubtitle && isDescription){
      setMessage(messageWithSD)
    } else if(isSubtitle && isButton){
      setMessage(messageWithSB)
    } else if(isDescription && isButton){
      setMessage(messageWithDB)
    } else if(isTitle){
      setMessage(messageWithTitle)
    } else if(isSubtitle){
      setMessage(messageWithSubtitle)
    } else if(isDescription){
      setMessage(messageWithDescription)
    } else if(isButton){
      setMessage(messageWithBlock)
    } else {
      setMessage(messageContext)}
  }
  ,[messageTitle,messageSubtitle, messageDescription,buttonTitle,isButton,messageContext])


  const onChangeTitleHandler=(v)=> {
    console.log("messageTitle: ",messageTitle)
    if(isTitle){
      setMessageTitle(v)
    } else {
      setIstitle(true)
      setMessageTitle(v)
    }
  }

  const onChangeSubtitleHandler=(v)=> {
    if(isSubtitle){
      setMessageSubtitle(v)
    } else {
      setIsSubtitle(true)
      setMessageSubtitle(v)
    }
  }

  const onChangeDescriptionHandler=(v)=> {
    if(isDescription){
      setMessageDescription(v)
    } else {
      setIsDescription(true)
      setMessageDescription(v)
    }
  }

  const onChangeButtonHandler=(v)=> {
    if(isDescription){
      setButtonTitle(v)
    } else {
      setIsDescription(true)
      setMessageDescription(v)
    }
  }

  return (
    <>
      {/* 발송 설정 모달 */}
      <MessageRule isShowingMessageRule={isShowingMessageRule} hide={toggleMessageRule} />
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

                        <span className="btn-inner--icon">
                          <i className="ni ni-album-2" />
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
                          style={{ width: 150, height: 60, fontSize: 16 }}
                        >
                          <span className="btn-inner--icon">
                            <i className="fas fa-phone" />
                          </span>
                        <span className="btn-inner--text">발신자</span>
                        </DropdownToggle>

                        <DropdownMenu aria-labelledby="dropdownMenuButton">
                          {senderNumberList.map(sn => (
                            <DropdownItem onClick={(e) => {
                              setSenderMemo(sn.memo)
                              setSenderNumber(sn.phoneNumber)
                            }}>
                              {"[" + sn.memo + "] " + makeHyphen(sn.phoneNumber)}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>

                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => {
                        isButton == true ? setIsButton(false) : setIsButton(true)
                      }}>
                        <span className="btn-inner--icon">
                          <i className="ni ni-chat-round" />
                        </span>
                        <span className="btn-inner--text">버튼</span>
                      </Button>
                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleTemplate()}>
                      <span className="btn-inner--icon">
                          <i className="ni ni-caps-small" />
                        </span>
                        <span className="btn-inner--text">템플릿</span>
                      </Button>
                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleMessageRule()}>
                      <span className="btn-inner--icon">
                          <i className="ni ni-time-alarm" />
                        </span>
                        <span className="btn-inner--text">발송설정</span>
                      </Button>
                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleReceiver()}>
                      <span className="btn-inner--icon">
                          <i className="ni ni-circle-08" />
                        </span>
                        <span className="btn-inner--text">수신자</span>
                      </Button>
                    </div>
                  </Col>



                  <Col sm="6">
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
                                    <Badge className="badge-md m-1" color="primary">{v.phoneNumber}</Badge>
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
                          알림톡 제목
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
                          알림톡 소제목
                        </label>
                        <Input
                            value={messageSubtitle}
                            rows="1"
                            type="textarea"
                            onChange={(e)=>{onChangeSubtitleHandler(e.target.value)}}
                        ></Input>
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 내용
                        </label>
                        <Input
                            value={messageContext}
                            rows="5"
                            type="textarea"
                            onChange={(e)=>{setMessageContext(e.target.value)}}
                        ></Input>
                        <p align="right">{messageType}&nbsp;{messageByte}byte</p>
                        {/* 부가 정보 합산 바이트 */}
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">
                          부가정보
                          알림톡 설명
                        </label>
                        <Input
                            value={messageDescription}
                            rows="5"
                            type="textarea"
                            onChange={(e)=>{onChangeDescriptionHandler(e.target.value)}}

                        ></Input>
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 버튼 이름
                        </label>
                        <Input
                            value={buttonTitle}
                            rows="1"
                            type="textarea"
                            onChange={(e)=>{setButtonTitle(e.target.value)}}
                        ></Input>
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 버튼 링크
                        </label>
                        <Input
                            value={buttonUrl}
                            rows="1"
                            type="textarea"
                            onChange={(e)=>{setButtonUrl(e.target.value)}}
                        ></Input>
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 버튼 종류
                        </label>
                        <Input
                            value={buttonType}
                            rows="1"
                            type="select"
                            onChange={(e)=>{setButtonType(e.target.value)}}
                        >
                          <option>선택</option>
                          <option value="DS">배송 조회</option>
                          <option value="WL">웹 링크</option>
                          <option value="AL">앱 링크</option>
                          <option value="BK">봇 키워드</option>
                          <option value="MD">메시지 전달</option>
                          <option value="AC">채널 추가</option>
                        </Input>
                      </FormGroup>
                    </CardBody>
                  </Col>




                  {/* 메시지 미리보기  */}
                  <Col sm="6" style={{paddingLeft:80}}>
                    <div style={{
                      backgroundImage: `url(${iphonekakao})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "80%",
                      height: "100%",
                    }}>
                      <div style={{ height: 220 }}></div>
                      <div style={{ height: 550, whiteSpace: "pre-wrap", width: 300, margin: 30}}>
                        {/* <div style={{textAlign:"center", fontSize:10,fontWeight:"bold", color:'#b1b1b4'}}>{`문자 메시지\n(오늘) ${IphoneTime()} `}</div> */}
                        <ChatBubble
                          message={messageInput}
                          bubbleStyles={
                            {
                              text: {
                                fontSize: 12,
                                color:'black'
                              },
                              chatbubble: {
                                borderTop: '40px solid #F7E600',
                                borderRadius: 20,
                                paddingLeft:14,
                                margin:10,
                                width:250,
                                backgroundColor: 'white',
                              }
                            }
                          }
                        />

                      </div>
                    </div>
                  </Col>

                </Row>
                <Button className="btn-icon btn-3" size="xl" color="primary" type="button" style={{ width: "15%", height: 54, margin: 10, fontSize: 17, float: "right"}} onClick={(e)=> sendMessage()}>
                  <span className="btn-inner--icon">
                    <i className="ni ni-send text-white" />
                  </span>
                  <span className="btn-inner--text">발송하기</span>
                </Button>

                <Button className="btn-icon btn-3" size="xl" color="primary" type="button" style={{ width: "15%", height: 54, margin: 10, fontSize: 17, float: "right", }} onClick={(e) => toggleMessageSchedule()}>
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

export default SendKakao;
