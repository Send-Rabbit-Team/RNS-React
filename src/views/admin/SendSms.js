import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    Container,
    Row,
    Col,
    Button,
    Modal, Input, FormGroup, InputGroup, InputGroupText, InputGroupAddon, Badge,  CardBody,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
  Form
  } from "reactstrap";
  import Header from "components/Headers/Header.js";
  import React, {useState,useEffect} from "react";
  import { useParams } from 'react-router-dom';
  import axios from "axios";
  // SMS 템플릿
  import 'react-chat-elements/dist/main.css'
  // MessageBox component
  import { MessageBox } from 'react-chat-elements'
  import MessageRule from './modal/MessageRule'
  
  
  const SendSms = () => {
    //페이지네이션
    const params = useParams();
    const nowPage = isNaN(params.page) ? 1 : params.page
    
  
    const [pageData, setPageData] = useState({
      totalPage: 0,
      page: 1,
      size: 0,
      start: 0,
      end: 0,
      prev: false,
      next: false,
      pageList: []
    })

    // 발신자 번호
    const [senderNumber, setSenderNumber] = useState('01091908201');
    const [senderId, setSenderId] = useState(1);
  
    const [ContactNumberList, setContactNumberList] = useState([])
    const [contactGroupList, setContactGroupList] = useState([])
    const [selectIdList, setSelectIdList] = useState([]);
    const [selectNameList, setSelectNameList] = useState([]);
    const [selectContactList, setSelectContactList] = useState([]);
    const [selectContactGroupList, setSelectContactGroupList] = useState([]);
  

    const onSelectContactHandler=(value)=>{
      setSelectContactList([...selectContactList, value])
    }

    const onDeleteContactHandler=(v)=>{
      const newContactList = selectContactList.filter((item) => item !== v);
      setSelectContactList(newContactList)
    }

    const onSelectContactGrouptHandler=(value)=>{
      setSelectContactGroupList([...selectContactGroupList,value])
    }

    const onDeleteContactGroupHandler=(v)=>{
      const newContactGroupList = selectContactGroupList.filter((item) => item !== v);
      setSelectContactGroupList(newContactGroupList)
    }

  
  
    // 연락처 필터
    const [searchInput, setSearchInput] = useState();
    const [filter, setFilter] = useState(false);
    const [searchContactNumberList,setSearchContactNumberList] = useState([]);

  
  
    // 연락처 추가 Modal
    const [createModal, setCreateModal] = useState(false);
    const [newGroupId, setNewGroupId] = useState(null);
    const [newGroupName, setNewGroupName] = useState();
    const [newPhoneNumber, setNewPhoneNumber] = useState();
    const [newMemo, setNewMemo] = useState();
  
    // 연락처 수정 Modal
    const [editModal, setEditModal] = useState(false);
    const [editContactId, setEditContactId] = useState();
    const [editPhoneNumber, setEditPhoneNumber] =useState();
    const [editMemo, setEditMemo] = useState();
    const [editGroupId, setEditGroupId] = useState();
    const [editGroupName, setEditGroupName] =useState();
  
    // 연락처 format 수정 메소드
    const makeHyphen = (number) => {
      return number.slice(0,3) + "-" +
          number.slice(3,7) + "-" +
          number.slice(7,11)
    }
    
    const [messageContext, setMessageContext] = useState("메시지를 입력해주새요")
    const [isBlock, setIsBlock] = useState(false);
    const [isSendRule,setIsSendRule] = useState(false);
    const [isReceiver, setIsReceiver] = useState(false);
    const [blockNumber, setBlockNumber] = useState("01091908201");

    const [smsKTRate, setSmsKTRate] = useState(33);
    const [smsSKTRate, setSmsSKTRate] = useState(33);
    const [smsLGRate, setSmsLGRate] = useState(34);

    const [brokerRateWarn, setBrokerRateWarn] = useState(false);

    const messageWithBlockNumber = `${messageContext} \n\n\n무료수신거부: ${blockNumber}`




    const applySendRule= async(KT,SKT,LG)=>{
      await axios.patch(`/msg/rule/edit`,{
          "messageRules":[
              {
                  "brokerId":1,
                  "brokerRate":KT
              },
              {
                  "brokerId":2,
                  "brokerRate":SKT
              },
              {
                  "brokerId":3,
                  "brokerRate":LG
              }
          ]
      }).then((response) => {
        if (response.data.isSuccess) {
          window.alert('발송 설정을 변경했습니다.')
          window.location.reload()
        } else {
          window.alert('발송 설정을 변경하는데 실패했습니다.')
        }
      })
      .catch((error) => {
        console.log("발송 설정 변경하는데 실패했고, 다른 유형의 에러입니다. ",error)
        // window.location.reload()
      })
    }

    



    // 중계사 규칙 불러오기
    useEffect(async()=>{
      await axios.get(`/msg/rule/getAll`)
      .then((response) => {
        if (response.data.isSuccess) {
          response.data.result.map(messageRule=>{
            if(messageRule.brokerId == 1){
              setSmsKTRate(messageRule.brokerRate);
            } else if(messageRule.brokerId == 2){
              setSmsLGRate(messageRule.brokerRate)
            } else{
              setSmsSKTRate(messageRule.brokerRate);
            }
          })
        } else {
          window.alert(response.data.message)
        }
      })
      .catch((error) => {
        window.alert(error.response.data.message)
      })
    },[isSendRule])


    // 그룹 불러오기
    useState(async () => {
      await axios.get(`/group/getAll`)
          .then((response) => {
            if (response.data.isSuccess) {
              setContactGroupList(response.data.result)
            } else {
              window.alert(response.data.message)
            }
          })
          .catch((error) => {
            window.alert(error.response.data.message)
          })
    })

    // BlockNumber 불러오기
    useState(async () => {
      await axios.get(`/sender/block/${senderId}`)
          .then((response) => {
            if (response.data.isSuccess) {
              setBlockNumber(response.data.result)
            } else {
              window.alert(response.data.message)
            }
          })
          .catch((error) => {
            window.alert(error.response.data.message)
          })
    })

  
  
    // 연락처 모두 불러오기
    useState(async () => {
      await axios.get(`/contact/list/${nowPage}`)
          .then((response) => {
            if (response.data.isSuccess) {
                setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                setContactNumberList(response.data.result.dtoList)
                console.log('전체 연락처 불러오기 성공: ', response.data.result.dtoList)
            } else {
              window.alert(response.data.message)
              console.log('전체 연락처 불러오기 실패: ', response.data)
            }
          })
          .catch((error) => {
            console.log('그냥 에러: ', error)
            window.alert(error.response.data.message)
          })
       }
      )
  
    // 연락처 검색하기
    useEffect(
      async () => {
      await axios.get(`/contact/search/${nowPage}?phoneNumber=${searchInput}`)
          .then((response) => {
            if (response.data.isSuccess) {
                setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                setSearchContactNumberList(response.data.result.dtoList)
              console.log('검색 성공: ', response.data)
            } else {
              window.alert(response.data.message)
              console.log('검색 실패: ', response.data)
            }
          })
          .catch((error) => {
            console.log('그냥 에러: ', error)
            window.alert(error.response.data.message)
          })
       },[searchInput]
      )
    // 검색 컨트롤러
    const searchController = (value) => {
      console.log('value', value);
      if (value.length == 0 && filter==true){
        setFilter(false)
      } else if(value.length !=0 && filter==false){
        setFilter(true)
        setSearchInput(value)
      }
      if (filter == true){
        setSearchInput(value)
      }
    }

    // 중계사 규칙 변경 핸들러
    const onBrokerRateChangeHandler=(e)=>{
      const[value, broker] = [e.target.value,e.target.name]
      // console.log('브로커: ',broker)
      // console.log('값: ', value)

      if (broker == "KT"){
        setSmsKTRate(e.target.value)
      } else if(broker == "SKT"){
        setSmsSKTRate(e.target.value)
      } else {
        setSmsLGRate(e.target.value)
      }

      console.log("KT: ", smsKTRate)
      console.log("SKT: ", smsSKTRate)
      console.log("LG: ", smsLGRate)
      
      console.log("합: ", Number(smsKTRate)+Number(smsSKTRate)+Number(smsLGRate))
      if((smsKTRate+smsSKTRate+smsLGRate) != 100){
        setBrokerRateWarn(true)
      } else{
        setBrokerRateWarn(false)
        console.log("완료!")
      }
    }


    
  


  
    const searchContactNumber = searchContactNumberList.filter((p) => {
      return p.phoneNumber.includes(searchInput)
    })

    


    const contactGroupListComponent = contactGroupList.map((contactGroup)=>{
      return(
      <tr>
        <td>{contactGroup.name}</td>
        <td><a href="#"><i className="fas fa-plus" onClick={(e)=>onSelectContactGrouptHandler(contactGroup)}/></a></td>
      </tr>)
    })
    const contactNumberListComponent = ContactNumberList.map((contactNumber, index) => (
        <tr>
            <td>{makeHyphen(contactNumber.phoneNumber)}</td>
            <td><a href="#"><i className="fas fa-plus" onClick={(e)=>onSelectContactHandler(contactNumber)}/></a></td>
        </tr>
      )
    )
    
    const searchContactNumberListComponent = searchContactNumber.map((searchContactNumber, index) => (
      <tr>
        <td>{makeHyphen(searchContactNumber.phoneNumber)}</td>
        <td><a href="#"><i className="fas fa-plus" onClick={(e)=>onSelectContactHandler(e.target.value)}/></a></td>
      </tr>
    )
  )
  
  

  
  
  
    return (

      

      <>


      {/* 발송 설정 모달 */}
      <MessageRule isOpen={isSendRule}/>
      <Modal
          className="modal-dialog-centered"
          isOpen={isSendRule}
          size="sm"
      >
        
        <div className="modal-header">
          <h3 className="modal-title" id="modal-title-default">
            발송 설정
          </h3>
          <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={(e) => setIsSendRule(false)}
          ></button>
          <span aria-hidden={true}>×</span>
          </div>
          <div className="modal-body">
          <Form>
          <Row style={{
                  display: "flex",
                  flexDirection: "column"
                }}>
            <Col md="12" >
              <FormGroup style={{display: "flex", alignItems:"flex-end"}}>
                {/* KT */}
                
                <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>KT</p>
                <Input
                  style={{ marginLeft: "auto" , width:"55%"}}
                  id="KT"
                  name="KT"
                  placeholder={smsKTRate}
                  value={smsKTRate}
                  type="number"
                  onChange={(e)=> setSmsKTRate(e.target.value)}
                />
                 <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>%</p>
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup style={{display: "flex", alignItems:"flex-end"}}>
                  {/* SKT */}
                  <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>SKT</p>
                  <Input
                   style={{ marginLeft: "auto" , width:"55%"}}
                    id="SKT"
                    name="SKT"
                    placeholder={smsSKTRate}
                    value={smsSKTRate}
                    type="number"
                    onChange={(e)=> setSmsSKTRate(e.target.value)}
                  />
                   <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>%</p>
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup style={{display: "flex", alignItems:"flex-end"}}>
                {/* LGU+ */}
                <p style={{margin:9,paddingRight:20, paddingTop:5, fontSize:17}}>LG U+</p>
                <Input
                style={{ marginLeft: "auto" , width:"55%"}}
                  id="LGU+"
                  name="LGU+"
                  placeholder={smsLGRate}
                  type="number" 
                  value={smsLGRate}
                  onChange={(e)=> setSmsLGRate(e.target.value)}
                />
                 <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>%</p>
              </FormGroup>
            </Col>
            </Row>

            {(Number(smsKTRate)+Number(smsSKTRate)+Number(smsLGRate)) != 100 ?<p className="text-warning" style={{fontWeight: 'bold'}}>(중계사 비율의 합이 100%가 아닙니다.)</p>:null}
            <Button color="secondary" size="sm" type="button" style={{ width:150, height: 30, fontSize:16,float: "right", paddingTop:2}} onClick={(e)=>{applySendRule(Number(smsKTRate), Number(smsSKTRate),Number(smsLGRate))}}>
              완료
            </Button>
          </Form>
          </div>
      </Modal>
      



































      {/* 수신자 모달*/}
      <Modal
          className="modal-dialog-centered"
          isOpen={isReceiver}
          size="lg"
      >
        <div className="modal-header" style={{height:1}}>
      
          <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={(e) => setIsReceiver(false)}
          ></button>
          <span aria-hidden={true}>×</span>
          </div>


          <Row style={{
                  display: "flex",
                  flexDirection: "Row"
                }}>
        
        <Col sm={6} md={6}>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row>
                    {/* 연락처 검색 */}
                    <Col>
                      <InputGroup className="mb-0">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-zoom-split-in" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Search"
                          type="text"
                          onChange={(e) => {searchController(e.target.value)}}
                          value={searchInput}
                          onCh/>
                      </InputGroup>
                    </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead>
                  <tr>
                    {/* <th scope="col">No</th> */}
                    {/* <th scope="col">메모</th> */}
                    <th scope="col">전화번호</th>
                    {/* <th scope="col">그룹</th> */}
                    <th scope="col">추가</th>
                  </tr>
                </thead>
                <tbody>
                  {filter==true?searchContactNumberListComponent:contactNumberListComponent}
                </tbody>
              </Table>
              
              <CardBody className="py-2">
                <nav aria-label="...">

                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    
           
                    <PaginationItem className={pageData.prev ? "active" : "disabled"}>
                      <PaginationLink
                        href={"/admin/contact/" + (pageData.start-1).toString()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                
                    {pageData.pageList.map(item => (
                        <PaginationItem className={item == parseInt(nowPage) ? "active" : "inactive"}>
                          <PaginationLink
                              href={"/admin/contact/" + item}
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                    ))}

             
                    <PaginationItem className={pageData.next ? "active" : "disabled"} style={{paddingBottom:20}}>
                      <PaginationLink
                          href={"/admin/contact/" + (pageData.end+1).toString()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                    
                  </Pagination>
                </nav>
              </CardBody>
            </Card>
          </div>
        </Col>




        
        {/* 그룹 목록 */}
        <Col sm={6} md={6}>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row>
                   
                    <Col>
                      <InputGroup className="mb-0">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-zoom-split-in" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Search"
                          type="text"
                          // 검색 수정중
                          // onChange={(e) => {ㄴㄴㄴ}} 
                          // value={searchInput}
                          onCh/>
                      </InputGroup>
                    </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead>
                  <tr>
                    <th scope="col">그룹이름</th>
                    <th scope="col">추가</th>
                  </tr>
                </thead>
                <tbody>
                  {contactGroupListComponent}
                </tbody>
              </Table>
            </Card >
          </div>
        </Col>
        </Row>



        {/* 선택 수신자 목록 */}
        <Row style={{margin:15, width:"120%"}}>
        <div style={{ width:"80%" }}>
          <Card className="card-stats mb-4 mb-lg-0">
        <CardBody className="py-4">
        <CardTitle className="lead" style={{margin:0}}>수신자 목록</CardTitle>
          </CardBody>
          {selectContactList.map(v=>{
                    return(
                      <Button color="primary" type="button" style={{margin:2}} onClick={(e)=>onDeleteContactHandler(v)}>
                        <span>{makeHyphen(v.phoneNumber)}</span>
                        <Badge className="badge-black" color="black" style={{width:10}}>X</Badge>
                      </Button>
                    )
                  })}

          {selectContactGroupList.map(v=>{
                    return(
                      <Button color="info" type="button" style={{margin:2}} onClick={(e)=>onDeleteContactGroupHandler(v)}>
                        <span>{v.name}</span>
                        <Badge className="badge-black" color="black" style={{width:10}}>X</Badge>
                      </Button>
                    )
                  })}
          </Card>
          </div>
          
        </Row>
        

      </Modal>
    









        {/* 메인 페이지 */}
        <Header />
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row>
                      <Col>
                        <h3 className="mb-0" style={{paddingTop:10}}>SMS 발송 &nbsp;&nbsp;
                        </h3>
                      </Col>
                  </Row>
                </CardHeader>
                
                <CardFooter className="py-3" >
                    <Row >
                        <Col md="10">
                        <div className="d-flex justify-content-between" style={{paddingBottom:20, flexDirection: "row"}} align="center" >
                                      <Button color="secondary" size="lg" type="button" style={{ width:150, height: 60, fontSize:16}}>
                                      사진
                                      </Button>
                                      <Button color="secondary" size="lg" type="button" style={{ width:150, height: 60, fontSize:16}}>
                                      발신자
                                      </Button>
                                      <Button color="secondary" size="lg" type="button" style={{ width:150, height: 60, fontSize:16}} onClick={(e)=> isBlock==true?setIsBlock(false):setIsBlock(true)}>
                                      수신거부
                                      </Button>
                                      <Button color="secondary" size="lg" type="button" style={{ width:150, height: 60, fontSize:16}}>
                                      템플릿
                                      </Button>
                                      <Button color="secondary" size="lg" type="button" style={{ width:150, height: 60, fontSize:16}} onClick={(e)=> setIsSendRule(true)}>
                                      발송설정
                                      </Button>
                                      <Button color="secondary" size="lg" type="button" style={{ width:150, height: 60, fontSize:16}} onClick={(e)=> setIsReceiver(true)}>
                                      수신자
                                      </Button>
                                  </div>
                        </Col>
                                  
                             
                        <Col md="6">
                              <FormGroup >
                                
                                <InputGroup className="input-group-alternative" style={{boxShadow: '1px 2px 9px #8c8c8c'}}>
                                    <InputGroupAddon addonType="prepend">
                                        {/* 애드온 */}
                                    </InputGroupAddon>
                                    <Row style={{height:850}}>
                                        <Col md="50">
                                            <Input
                                                id="exampleFormControlTextarea2"
                                                style={{margin:22,boxSizing: "border-box", fontSize:30}}
                                                placeholder="제목을 입력하세요."
                                                cols="10"
                                                rows="1"
                                                type="textarea"
                                            />
                                            <hr class="hr hr-blurry" style={{marginLeft:50,width:500}}/>
                                     
                                            <Input
                                                id="exampleFormControlTextarea1"
                                                style={{margin:32,boxSizing: "border-box"}}
                                                placeholder="내용을 입력하세요."
                                                rows="25"
                                                cols="20"
                                                type="textarea"
                                                onChange={(e)=>setMessageContext(e.target.value)}
                                            />

                                            {isBlock==true? 
                                       
                                              <Button color="primary" type="button" style={{margin:30,boxSizing: "border-box", fontSize:15}}>
                                              <span style={{paddingRight:10}}>무료 수신 거부: {blockNumber}</span>
                                              <i className="fas fa-minus" />
                                            </Button>

                                            :null}
                                          
                                            
                                        </Col>
                                    </Row>
                                  </InputGroup>
                            </FormGroup>
                        </Col>






                      {/* 미리 보기 / Bubble */}
                        <Col md="6" >
                            <FormGroup style={{position: "relative"}}>
                                <InputGroup className="input-group-alternative" style={{boxShadow: '1px 2px 9px #8c8c8c'}}>
                                    <InputGroupAddon addonType="prepend">
                                        {/* 애드온 */}
                                    </InputGroupAddon>
                                    <Row style={{height:850}}>
                                      <Col>
                                        <div style={{height:816, paddingTop:60, margin:30,whiteSpace: "pre-wrap"}}>
                                          <MessageBox
                                            style={{whiteSpace: "pre-wrap"}}
                                            position={'left'}
                                            type={'text'}
                                            text={isBlock?messageWithBlockNumber:messageContext}
                                        />
                                        </div>
                                      </Col>
                                    </Row>
                                     <Row style={{margin:30}}>
                                    {selectContactList.map(v=>{
                                              return(
                                                <Button color="primary" type="button" style={{margin:2}} onClick={(e)=>onDeleteContactHandler(v)}>
                                                  <span>{makeHyphen(v.phoneNumber)}</span>
                                                  <Badge className="badge-black" color="black" style={{width:10}}>X</Badge>
                                                </Button>
                                              )
                                            })}
                                            
                                    {selectContactGroupList.map(v=>{
                                              return(
                                                <Button color="info" type="button" style={{margin:2}} onClick={(e)=>onDeleteContactGroupHandler(v)}>
                                                  <span>{v.name}</span>
                                                  <Badge className="badge-black" color="black" style={{width:10}}>X</Badge>
                                                </Button>
                                              )
                                            })}
                                    </Row>
                                </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                </CardFooter>
              </Card>



            </div>
          </Row>
          
        </Container>
      </>
    );
  };
  
  export default SendSms;
  