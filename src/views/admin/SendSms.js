import {
  Card,
  CardHeader,
  CardFooter,
  Container,
  Row,
  Col,
  Button,
  Input, FormGroup, InputGroup, InputGroupAddon, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import Header from "components/Headers/Header.js";
import React, { useState } from "react";
import axios from "axios";
import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements'
import MessageRule from './modal/MessageRule'
import Receiver from "./modal/Receiver";
import useModal from "utils/useModal";


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

  const { isShowingMessageRule, toggleMessageRule } = useModalMessageRule();
  const { isShowingReceiver, toggleReceiver } = useModalReceiver();

  // 발신자 번호 변수
  const [senderNumber, setSenderNumber] = useState();
  const [blockNumber, setBlockNumber] = useState();

  // 수신자 모달 -> 메인페이지 데이타 전달
  const [ContactNumberList, setContactNumberList] = useState([])
  const [contactGroupList, setContactGroupList] = useState([])
  const [selectIdList, setSelectIdList] = useState([]);
  const [selectNameList, setSelectNameList] = useState([]);
  const [selectContactList, setSelectContactList] = useState([]);
  const [selectContactGroupList, setSelectContactGroupList] = useState([]);


  const onDeleteContactGroupHandler = (v) => {
    const newContactGroupList = selectContactGroupList.filter((item) => item !== v);
    setSelectContactGroupList(newContactGroupList)
  }

  // 연락처 format 수정 메소드
  const makeHyphen = (number) => {
    return number.slice(0, 3) + "-" +
      number.slice(3, 7) + "-" +
      number.slice(7, 11)
  }

  // 미리보기화면
  const [messageContext, setMessageContext] = useState("메시지를 입력해주새요")
  const [isBlock, setIsBlock] = useState(false);

  // 미리보기 화면에서 수신자 제거
  const onDeleteContactHandler = (v) => {
    const newContactList = selectContactList.filter((item) => item !== v);
    setSelectContactList(newContactList)
  }

  // 수신거부
  const messageWithBlockNumber = `${messageContext} \n\n\n무료수신거부: ${blockNumber}`

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

  // 테스트 중
  const selectContactGroupChild = (data) => {
    setSelectContactGroupList([...data])
  }

  const selectContactChild = (data) => {
    setSelectContactList([...data])
  }

  return (
    <>
      {/* 발송 설정 모달 */}
      <MessageRule isShowingMessageRule={isShowingMessageRule} hide={toggleMessageRule} />
      <Receiver 
        isShowingReceiver={isShowingReceiver} 
        selectContactChild={selectContactChild} 
        selectContactGroupChild={selectContactGroupChild} 
        hide={toggleReceiver}
        selectContactListParent={selectContactList}
        selectContactGroupListParent={selectContactGroupList}
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
                  <Col md="10">
                    <div className="d-flex justify-content-between" style={{ paddingBottom: 20, flexDirection: "row" }} align="center" >
                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }}>
                        사진
                      </Button>
                      <UncontrolledDropdown>
                        <DropdownToggle
                            size="lg"
                            caret
                            color="secondary"
                            type="button"
                            style={{ width:150, height: 60, fontSize:16}}
                        >
                          발신자
                        </DropdownToggle>

                        <DropdownMenu aria-labelledby="dropdownMenuButton">
                          {senderNumberList.map(sn => (
                              <DropdownItem onClick={(e) => {
                                setSenderNumber(makeHyphen(sn.phoneNumber))
                                setBlockNumber(makeHyphen(sn.blockNumber))
                              }}>
                                { "[" + sn.memo + "] " + makeHyphen(sn.phoneNumber)}
                              </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                      <Button color="secondary" size="lg" type="button" style={{ width:150, height: 60, fontSize:16}} onClick={(e)=>
                      {blockNumber==null ? window.alert("발신번호를 선택하세요") :
                          isBlock==true?setIsBlock(false):setIsBlock(true)}}>
                        수신거부
                      </Button>
                      <Button color="secondary" size="lg" type="button" style={{ width: 150, height: 60, fontSize: 16 }}>
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


                  <Col md="6">
                    <FormGroup >
                      <InputGroup className="input-group-alternative" style={{ boxShadow: '1px 2px 9px #8c8c8c' }}>
                        <InputGroupAddon addonType="prepend">
                          {/* 애드온 */}
                        </InputGroupAddon>
                        <Row style={{ height: 850 }}>
                          <Col md="50">
                            <Input
                              id="exampleFormControlTextarea2"
                              style={{ margin: 22, boxSizing: "border-box", fontSize: 30 }}
                              placeholder="제목을 입력하세요."
                              cols="10"
                              rows="1"
                              type="textarea"
                            />
                            <hr class="hr hr-blurry" style={{ marginLeft: 50, width: 500 }} />

                            <Input
                              id="exampleFormControlTextarea1"
                              style={{ margin: 32, boxSizing: "border-box" }}
                              placeholder="내용을 입력하세요."
                              rows="25"
                              cols="20"
                              type="textarea"
                              onChange={(e) => setMessageContext(e.target.value)}
                            />

                            {/* 수신 거부 */}
                            {isBlock == true ?
                              <Button color="primary" type="button" style={{ margin: 30, boxSizing: "border-box", fontSize: 15 }}>
                                <span style={{ paddingRight: 10 }}>무료 수신 거부: {blockNumber}</span>
                                <i className="fas fa-minus" />
                              </Button> : null}
                          </Col>
                        </Row>
                      </InputGroup>
                    </FormGroup>
                  </Col>


                  {/* 미리 보기 / Bubble */}
                  <Col md="6" >
                    <FormGroup style={{ position: "relative" }}>
                      <InputGroup className="input-group-alternative" style={{ boxShadow: '1px 2px 9px #8c8c8c' }}>
                        <InputGroupAddon addonType="prepend">
                          {/* 애드온 */}
                        </InputGroupAddon>
                        <Row style={{ height: 850 }}>
                          <Col>
                            <div style={{ height: 816, paddingTop: 60, margin: 30, whiteSpace: "pre-wrap" ,width:500}}>
                              <MessageBox
                                style={{ whiteSpace: "pre-wrap" }}
                                position={'left'}
                                type={'text'}
                                text={isBlock ? messageWithBlockNumber : messageContext}
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
            <Button className="btn-icon btn-3" size="xl" color="primary" type="button" style={{ width:"15%", height:54,margin:10, fontSize:22,float: "right", }}>
          <span className="btn-inner--icon">
            <i className="ni ni-send text-white" />
          </span>
          <span className="btn-inner--text">발송하기</span>
        </Button>

        <Button className="btn-icon btn-3" size="xl" color="primary" type="button" style={{ width:"15%", height:54,margin:10, fontSize:22,float: "right", }}>
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
