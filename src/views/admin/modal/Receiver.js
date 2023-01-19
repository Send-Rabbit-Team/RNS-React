import {
    Card,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Button,
    Modal, Input, InputGroup, InputGroupText, InputGroupAddon, Badge,  CardBody,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
  Form
  } from "reactstrap";
  import React, {useState,useEffect} from "react";
  import { useParams } from 'react-router-dom';
  import axios from "axios";


  const Receiver = (props,{selectContactChild,selectContactGroupChild})=>{

    //변수
    const [searchInput, setSearchInput] = useState();
    const [isReceiver, setIsReceiver] = useState(false);
    const [filter, setFilter] = useState(false);
    const [searchContactNumberList,setSearchContactNumberList] = useState([]);
    const [selectContactList, setSelectContactList] = useState([]);
    const [selectContactGroupChildList, setSelectContactGroupChildselectContactGroupChildList] = useState([]);
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
        return number.slice(0,3) + "-" +
            number.slice(3,7) + "-" +
            number.slice(7,11)
      }

    const searchContactNumber = searchContactNumberList.filter((p) => {
        return p.phoneNumber.includes(searchInput)
      })


    // 컴포넌트
    const searchContactNumberListComponent = searchContactNumber.map((searchContactNumber, index) => (
    <tr>
        <td>{makeHyphen(searchContactNumber.phoneNumber)}</td>
        <td><a href="#"><i className="fas fa-plus" onClick={(e)=>onSelectContactHandler(e.target.value)}/></a></td>
    </tr>
    )
    )
    const contactGroupListComponent = contactGroupList.map((contactGroup)=>{
        return(
        <tr>
          <td>{contactGroup.name}</td>
          <td><a href="#"><i className="fas fa-plus" onClick={(e)=>onSelectContactGroupChildselectContactGroupChildtHandler(contactGroup)}/></a></td>
        </tr>)
      })
      const contactNumberListComponent = ContactNumberList.map((contactNumber, index) => (
          <tr>
              <td>{makeHyphen(contactNumber.phoneNumber)}</td>
              <td><a href="#"><i className="fas fa-plus" onClick={(e)=>onSelectContactHandler(contactNumber)}/></a></td>
          </tr>
        )
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


    // 핸들러
      const onSelectContactHandler=(value)=>{
        setSelectContactList([...selectContactList, value]);
        selectContactChild(selectContactList);
        console.log("자식: ",selectContactList)
      }
  
      const onDeleteContactHandler=(v)=>{
        const newContactList = selectContactList.filter((item) => item !== v);
        setSelectContactList(newContactList)
      }
  
      const onSelectContactGroupChildselectContactGroupChildtHandler=(value)=>{
        setSelectContactGroupChildselectContactGroupChildList([...selectContactGroupChildList,value])
        selectContactGroupChild(selectContactGroupChildList)
      }
  
      const onDeleteContactGroupHandler=(v)=>{
        const newContactGroupList = selectContactGroupChildList.filter((item) => item !== v);
        setSelectContactGroupChildselectContactGroupChildList(newContactGroupList)
      }
  


    // axios
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

    return(
    props.isShowingReceiver?
        <Modal
        className="modal-dialog-centered"
        isOpen={true}
        size="lg"
    >
      <div className="modal-header" style={{height:1}}>
    
        <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={(e) => props.hide(false)}
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
                  <th scope="col">전화번호</th>
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

        {selectContactGroupChildList.map(v=>{
                  return(
                    <Button color="info" type="button" style={{margin:2}} onClick={(e)=>onDeleteContactGroupHandler(v)}>
                      <span>{v.name}</span>
                      <Badge className="badge-black" color="black" style={{width:10}}>X</Badge>
                    </Button>
                  )
                })}

                    {/* <Button color="primary" type="button" style={{margin:2}} onClick={(e)=>submitHandler(v)}>
                      <span>{makeHyphen(v.phoneNumber)}</span>
                      <Badge className="badge-black" color="black" style={{width:10}}>X</Badge>
                    </Button> */}
        </Card>
        </div>
      </Row>
      

    </Modal>:null
    )
  }
  export default Receiver;