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
} from "reactstrap";
import Header from "components/Headers/Header.js";
import React, {useEffect, useState} from "react";
import axios from "axios";
import 'react-chat-elements/dist/main.css'
import Receiver from "../Receiver";
import KakaoTemplateModal from "./KakaoTemplateModal";
import KakaoImageUpload from "./KakaoImageUpload";
import {Image} from "react-bootstrap";
import MessageSchedule from "../MessageSchedule";
import iphonekakao from '../../../../assets/img/brand/iphonekakao.png';
import { ChatBubble, Message } from 'react-chat-ui';
import KakaoMessageRule from "./KakaoMessageRule";
import Swal from "sweetalert2";

const SendKakao = () => {
  var memberType = localStorage.getItem("member_type")

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
  const [selectImage, setSelectImage] = useState(null);
  const getSelectImage = (data) => {
    setSelectImage(data)
  }
  const removeSelectImage = () => {
    setSelectImage(null)
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
  const [buttonTitle, setButtonTitle] = useState("")
  const [buttonUrl, setButtonUrl] = useState("")
  const [buttonType, setButtonType] = useState("")

  const [message, setMessage] = useState("");

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
    paddingRight:40,
    marginLeft:-14,
   }


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

    buttonTitle && buttonUrl && buttonType ? setMessageByte(l+29) : setMessageByte(l)
  });

  // 기업 정보 불러오기
  const [companyName, setCompanyName] = useState();
  const [companyKakaoBizId, setCompanyKakaoBizId] = useState();
  useEffect(async () => {
    await axios.get("/userinfo")
        .then((response) => {
          if (response.data.isSuccess) {
            setCompanyName(response.data.result.companyName)
            setCompanyKakaoBizId(response.data.result.kakaoBizId)
          } else {
            console.log(response.data.message)
          }
        })
        .catch((error) => {
          console.log(error.response.data.message)
        })
  })

  // 메시지 전송
  const sendMessage = async()=>{

    await axios.post('/message/send/kakao',{
      "kakaoMessageDto":{
        "from": companyKakaoBizId,
        "title": messageTitle,
        "subtitle": messageSubtitle,
        "content": messageContext,
        "description":messageDescription,
        "image":selectImage,
        "buttonTitle": buttonTitle,
        "buttonType" : buttonType,
        "buttonUrl"  : buttonUrl,
      },
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

        <p style={{fontSize:"14px"}}>{messageContext}</p>

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




  const redirect=async()=>{
    await Swal.fire({
      title: '기업 회원만 이용 가능합니다',
      text:'기업 아이디로 로그인 하세요',
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    } )
    window.location.replace("/admin/sms")
  }

  if (memberType === "COMPANY" )
  return (
    <>
      {/* 발송 설정 모달 */}
      <KakaoMessageRule isShowingMessageRule={isShowingMessageRule} hide={toggleMessageRule} />
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
                    <h3 className="mb-0" style={{ paddingTop: 10 }}>알림톡 발송 &nbsp;&nbsp;
                    </h3>
                  </Col>
                </Row>
              </CardHeader>

              <CardFooter className="py-3" >
                <Row>
                    <div className="d-flex justify-content-between" style={{ paddingBottom: 20, flexDirection: "row" }} align="center" >

                      <Col sm="3">
                        <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleImageUpload()}>
                          <span className="btn-inner--icon">
                            <i className="ni ni-album-2" />
                          </span>
                          <span className="btn-inner--text">사진</span>
                        </Button>
                      </Col>

                      <Col sm="3">
                        <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleTemplate()}>
                        <span className="btn-inner--icon">
                            <i className="ni ni-caps-small" />
                          </span>
                          <span className="btn-inner--text">템플릿</span>
                        </Button>
                      </Col>

                      <Col sm="3">
                        <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleMessageRule()}>
                        <span className="btn-inner--icon">
                            <i className="ni ni-time-alarm" />
                          </span>
                          <span className="btn-inner--text">발송설정</span>
                        </Button>
                      </Col>

                      <Col sm="3">
                        <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }} onClick={(e) => toggleReceiver()}>
                        <span className="btn-inner--icon">
                            <i className="ni ni-circle-08" />
                          </span>
                          <span className="btn-inner--text">수신자</span>
                        </Button>
                      </Col>

                    </div>
                </Row>


                <Row>
                  <Col sm="6">
                    <CardBody style={{ boxShadow: '1px 2px 9px #8c8c8c' }}>

                      <FormGroup>
                        <label className="form-control-label">
                          발신자
                        </label>
                        <Container>
                          <Row>
                            <Badge className="badge-md m-1" color="primary">{companyName + "(" + companyKakaoBizId + ")"}</Badge>
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
                            {selectImage ? (
                                <div className="col-sm-3">
                                  <Image className="d-block w-100 m-1"
                                         src={selectImage}/>
                                </div>
                                ) : null }
                          </Row>
                        </Container>
                      </FormGroup>

                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 제목
                        </label>
                        <Input
                            defaultValue={messageTitle}
                            type="text"
                            onChange={(e)=>{setMessageTitle(e.target.value)}}
                        ></Input>
                      </FormGroup>


                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 소제목
                        </label>
                        <Input
                            defaultValue={messageSubtitle}
                            type="text"
                            onChange={(e)=>{setMessageSubtitle(e.target.value)}}
                        ></Input>
                      </FormGroup>

                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 내용
                        </label>
                        <Input
                            defaultValue={messageContext}
                            rows="5"
                            type="textarea"
                            onChange={(e)=>{setMessageContext(e.target.value)}}
                        ></Input>
                        <p align="right">{messageByte}byte</p>
                        {/* 부가 정보 합산 바이트 */}
                      </FormGroup>

                      <FormGroup>
                        <label className="form-control-label">
                          부가정보
                          알림톡 설명
                        </label>
                        <Input
                            defaultValue={messageDescription}
                            rows="5"
                            type="textarea"
                            onChange={(e)=>{setMessageDescription(e.target.value)}}

                        ></Input>
                      </FormGroup>

                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 버튼 이름
                        </label>
                        <Input
                            defaultValue={buttonTitle}
                            type="text"
                            onChange={(e)=>{setButtonTitle(e.target.value)}}
                        ></Input>
                      </FormGroup>

                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 버튼 링크
                        </label>
                        <Input
                            defaultValue={buttonUrl}
                            type="text"
                            onChange={(e)=>{setButtonUrl(e.target.value)}}
                        ></Input>
                      </FormGroup>

                      <FormGroup>
                        <label className="form-control-label">
                          알림톡 버튼 종류
                        </label>
                        <Input
                            defaultValue={buttonType}
                            type="select"
                            onChange={(e)=>{setButtonType(e.target.value)}}
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
                      <div style={{ height: 250 }}></div>
                      <div style={{ height: 550, whiteSpace: "pre-wrap", width: 350, margin: 30}}>
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
                                width:300,
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
  else {
    redirect()
    }
};

export default SendKakao;
