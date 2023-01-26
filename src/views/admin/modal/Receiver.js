import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
  Modal, Input, InputGroup, InputGroupText, InputGroupAddon, Badge, CardBody,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";

const Receiver = ({ isShowingReceiver, hide, selectContactChild, selectContactGroupChild, selectContactListParent, selectContactGroupListParent }) => {

  //변수
  const [searchContactInput, setSearchContactInput] = useState();
  const [searchContactGroupInput, setSearchContactGroupInput] = useState();

  // 검색
  const [contactfilter, setContactFilter] = useState(false);
  const [contactGroupFilter, setContactGroupFilter] = useState(false);
  const [searchContactList, setSearchContactList] = useState([]);


  const [selectContactList, setSelectContactList] = useState([]);
  const [selectContactGroupList, setSelectContactGroupList] = useState([]);

 

  const [ContactNumberList, setContactNumberList] = useState([])
  const [contactGroupList, setContactGroupList] = useState([])
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

  const params = useParams();
  const nowPage = isNaN(params.page) ? 1 : params.page

  // 함수
  const makeHyphen = (number) => {
    return number.slice(0, 3) + "-" +
      number.slice(3, 7) + "-" +
      number.slice(7, 11)
  }

  const searchContactNumber = searchContactList.filter((p) => {
    return p.phoneNumber.includes(searchContactInput)
  })

  const searchContactGroup = contactGroupList.filter((p) => {
    return p.name.includes(searchContactGroupInput)
  })

  const searchContactController = (value) => {
    console.log('value', value);
    if (value.length == 0 && contactfilter == true) {
      setContactFilter(false)
    } else if (value.length != 0 && contactfilter == false) {
      setContactFilter(true)
      setSearchContactInput(value)
    }
    if (contactfilter == true) {
      setSearchContactInput(value)
    }
  }

  const searchContactGroupController = (value) => {
    console.log('value', value);
    if (value.length == 0 && contactGroupFilter == true) {
      setContactGroupFilter(false)
    } else if (value.length != 0 && contactGroupFilter == false) {
      setContactGroupFilter(true)
      setSearchContactGroupInput(value)
    }
    if (contactGroupFilter == true) {
      setSearchContactGroupInput(value)
    }
  }

  const isFound = (contact) => selectContactList.some(existContact => {
    console.log(existContact)
    if (existContact.phoneNumber == contact) {
      return true;
    }

    return false;
  });
  

  // 컴포넌트
  const searchContactListComponent = searchContactNumber.map((searchContactNumber, index) => (
    <tr>
      <td>{makeHyphen(searchContactNumber.phoneNumber)}</td>
      {console.log("123123: ",typeof(searchContactNumber.phoneNumber))}
      {
        isFound(searchContactNumber.phoneNumber)==false?
        <td><a href="#"><i className="fas fa-plus" onClick={(e) => onSelectContactHandler(searchContactNumber)} /></a></td>:
        <td><a href="#"><i className="fas fa-minus" onClick={(e) => onDeleteContactHandler(searchContactNumber)} /></a></td>
      }
    </tr>
  )
  )

  const searchContactGroupListComponent = searchContactGroup.map((searchContactGroup, index) => (
    <tr>
      <td>{searchContactGroup.name}</td>
      <td><a href="#"><i className="fas fa-plus" onClick={(e) => onSelectContactGroupHandler(e.target.value)} /></a></td>
    </tr>
  )
  )

  const contactGroupListComponent = contactGroupList.map((contactGroup) => {
    return (
      <tr>
        <td>{contactGroup.name}</td>
        <td><a href="#"><i className="fas fa-plus" onClick={(e) => onSelectContactGroupHandler(contactGroup)} /></a></td>
      </tr>)
  })

  

  const contactNumberListComponent = ContactNumberList.map((contactNumber, index) => (
    
    <tr>
      <td>{makeHyphen(contactNumber.phoneNumber)}</td>
      {
        isFound(contactNumber.phoneNumber)==false?
        <td><a href="#"><i className="fas fa-plus" onClick={(e) => onSelectContactHandler(contactNumber)} /></a></td>:
        <td><a href="#"><i className="fas fa-minus" onClick={(e) => onDeleteContactHandler(contactNumber)} /></a></td>
      }
    </tr>
  )
  )


  






  // 핸들러
  const onSelectContactHandler = (value) => {
    setSelectContactList([...selectContactList, value]);
    selectContactChild([...selectContactList, value]);
    console.log(selectContactList)
  }

  const onDeleteContactHandler = (v) => {
    const newContactList = selectContactList.filter((item) => item !== v);
    setSelectContactList(newContactList)
    selectContactChild(newContactList)
  }

  const onSelectContactGroupHandler = (value) => {
    setSelectContactGroupList([...selectContactGroupList, value])
    selectContactGroupChild([...selectContactGroupList, value]);
  }

  const onDeleteContactGroupHandler = (v) => {
    const newContactGroupList = selectContactGroupList.filter((item) => item !== v);
    setSelectContactGroupList(newContactGroupList)
    selectContactGroupChild(newContactGroupList)
  }



  // axios
  // 연락처 모두 불러오기
  useState(async () => {
    await axios.get(`/contact/list`)
      .then((response) => {
        if (response.data.isSuccess) {
          setContactNumberList(response.data.result.contacts)
          console.log('전체 연락처 불러오기 성공: ', response.data.result.contacts)
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
      await axios.get(`/contact/search/${nowPage}?phoneNumber=${searchContactInput}`)
        .then((response) => {
          if (response.data.isSuccess) {
            setPageData(pageData => ({ ...pageData, ...response.data.result, page: nowPage }))
            setSearchContactList(response.data.result.dtoList)
          } else {
            window.alert(response.data.message)
          }
        })
        .catch((error) => {
          window.alert(error.response.data.message)
        })
    }, [searchContactInput]
  )


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

  return (
    isShowingReceiver ?
      <Modal
        className="modal-dialog-centered"
        isOpen={true}
        size="lg"
      >
        <div className="modal-header" style={{ height: 1 }}>

          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={(e) => hide(false)}
          ></button>
          <span aria-hidden={true}>×</span>
        </div>

        
        <Row style={{
          display: "flex",
          flexDirection: "Row"
        }}>

          <Col sm={6} md={6}>
            <div className="col">
              <Card className="shadow" style={{height:400}}>
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
                          placeholder="연락처 검색하기"
                          type="text"
                          onChange={(e) => {searchContactController(e.target.value) }}
                          value={searchContactInput}
                          onCh />
                      </InputGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush">
                  <thead>
                    <tr>
                      <th scope="col" style={{fontSize:13,paddingLeft:50}}>전화번호</th>
                      <th scope="col" style={{fontSize:13,float: "right", paddingRight:66}}>추가</th>
                    </tr>
                  </thead>
                  </Table>

                <Table className="align-items-center table-flush" responsive>
                 
           
                  <tbody style={{overflowY: "scroll"}}>
                    {contactfilter == true ? searchContactListComponent : contactNumberListComponent}
                  </tbody>
                </Table>

              </Card>
            </div>
          </Col>

          {/* 그룹 목록 */}
          <Col sm={6} md={6}>
            <div className="col">
              <Card className="shadow" style={{height:400}}>
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
                          placeholder="그룹 검색하기"
                          type="text"
                          onChange={(e) => {searchContactGroupController(e.target.value)}} 
                          value={searchContactGroupInput}
                          onCh />
                      </InputGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush">
                  <thead>
                    <tr>
                      <th scope="col" style={{fontSize:13, paddingLeft:50}}>그룹</th>
                      <th scope="col" style={{fontSize:13, float: "right", paddingRight:62}}>추가</th>
                    </tr>
                  </thead>
                  </Table>
                <Table className="align-items-center table-flush" responsive>
               
                  <tbody style={{overflowY: "scroll"}}>
                  {contactGroupFilter == true ? searchContactGroupListComponent : contactGroupListComponent} 
                  </tbody>
                </Table>
              </Card >
            </div>
          </Col>
        </Row>

        {/* 선택 수신자 목록 */}
        <Row style={{ margin: 15, width: "120%" }}>
          <div style={{ width: "80%" }}>
            <Card className="card-stats mb-4 mb-lg-0">
              <CardBody className="py-4">
                <CardTitle className="lead" style={{ margin: 0 }}>수신자 목록</CardTitle>
              </CardBody>
              {selectContactList.map(v => {
                return (
                  <Button color="primary" type="button" style={{ margin: 2 }} onClick={(e) => onDeleteContactHandler(v)}>
                    <span>{makeHyphen(v.phoneNumber)}</span>
                    <Badge className="badge-black" color="black" style={{ width: 10 }}>X</Badge>
                  </Button>
                )
              })}

              {selectContactGroupList.map(v => {
                return (
                  <Button color="info" type="button" style={{ margin: 2 }} onClick={(e) => onDeleteContactGroupHandler(v)}>
                    <span>{v.name}</span>
                    <Badge className="badge-black" color="black" style={{ width: 10 }}>X</Badge>
                  </Button>
                )
              })}
            </Card>
            <br></br>
            <Button color="secondary" size="sm" type="button" style={{ margin:10,width:150, height: 30, fontSize:14,float: "right", paddingTop:2}} onClick={(e)=>{hide()}}>
              완료
            </Button>
          </div>
          
        </Row>
        


      </Modal> : null
  )
}
export default Receiver;