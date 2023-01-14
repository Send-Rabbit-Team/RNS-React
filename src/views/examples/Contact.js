import {
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button,
  Modal, Input, FormGroup, InputGroup, InputGroupText, InputGroupAddon
} from "reactstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Header from "components/Headers/Header.js";
import React, {useState} from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";


const ContactNumber = () => {

  const params = useParams();
  const nowPage = isNaN(params.page) ? 1 : params.page
  const dummyKey = 19;

  console.log('params.page: ',params)

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
  const [ContactNumberList, setContactNumberList] = useState([])

  // 연락처 추가 Modal
  const [createModal, setCreateModal] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [isAccessNumCheck, setIsAccessNumCheck] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState();
  const [newMemo, setNewMemo] = useState();
  const [accessNum, setAccessNum] = useState();

  // 연락처 수정 Modal
  const [editModal, setEditModal] = useState(false);
  const [editPhoneNumber, setEditPhoneNumber] =useState();
  const [editMemo, setEditMemo] = useState();
  const [editGroupId, setEditGroupId] = useState();
  const [editGroupName, setEditGroupName] =useState();

  const makeHyphen = (number) => {
    return number.slice(0,3) + "-" +
        number.slice(3,7) + "-" +
        number.slice(7,11)
  }

  useState(async () => {
    await axios.get(`/sender/list/${nowPage}`)
        .then((response) => {
          if (response.data.isSuccess) {
            setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
            setContactNumberList(response.data.result.dtoList)
          } else {
            window.alert(response.data.message)
          }
        })
        .catch((error) => {
          window.alert(error.response.data.message)
        })
  })

  const registerContactNumber = async () => {
    newPhoneNumber == null ?  window.alert("전화번호를 입력하세요") :
        !isAccessNumCheck ? window.alert("전화번호를 인증하세요") :
          await axios.post("/contact/create", {
            "memo" : newMemo,
            "phoneNumber" : newPhoneNumber
          })
          .then((response) => {
            if (response.data.isSuccess) {
              window.alert(response.data.message)
              window.location.reload()
            } else {
              window.alert(response.data.message)
            }
          })
          .catch((error) => {
            window.alert(error.response.data.message)
          })
  }

  const deleteContactNumber = async (ContactNumberId) => {
    await axios.patch(`/contact/delete/${ContactNumberId}`)
        .then((response) => {
          if (response.data.isSuccess) {
            window.alert(response.data.message)
            window.location.replace("/admin/contact/1")
          } else {
            window.alert(response.data.message)
          }
        })
        .catch((error) => {
          window.alert(error.response.data.message)
        })
  }

  // 그룹 정보 불러오기
  const getGroupInfo = async(groupId)=>{
    await axios.get(`/group/${groupId}`)
    .then(
      (response)=>{
        if (response.data.isSuccess){
          console.log('그룹 정보 받아오기 성공: ',response.data);
          setEditGroupName(response.data.result.name);
        } else{
          console.log('그룹 정보 받아오기 실패: ', response.data);
        }
      }
    )
  }

  // 연락처 수정 컨트롤러
  const editConatactController = async (ContactNumberId)=>{
    // 기존 연락처 정보 받아오기
    await axios.get(`/contact/${ContactNumberId}`)
    .then(
      (response) => {
      if (response.data.isSuccess) {
        console.log('연락처 정보 받아오기 성공: ',response.data)
        setEditPhoneNumber(response.data.result.phoneNumber);
        setEditGroupId(response.data.result.groupId);
        getGroupInfo(response.data.result.groupId);
        setEditMemo(response.data.result.memo);
      } else {
        console.log('연락처 정보 받아오기 실패: ',response.data)
      }})
      // Modal 활성화
      setEditModal(true);
  }

  // 연락처 수정 메소드
  const editContactNumber = async () => {
    editPhoneNumber == null ?  window.alert("전화번호를 입력하세요") :
          console.log();
          await axios.patch("/contact/edit", {
            "contactId": dummyKey,
            "contactGroupId": editGroupId,
            "phoneNumber" : editPhoneNumber,
            "memo" : editMemo,
          })
          .then((response) => {
            if (response.data.isSuccess) {
              window.alert('연락처를 수정했습니다.')
              window.location.reload()
            } else {
              window.alert('연락처를 수정하는데 실패했습니다.')
            }
          })
          .catch((error) => {
            console.log(error)
            // window.alert('완전 다른 에러: ',error)
            window.location.reload()
          })
  }


  console.log('수정된 그룹 아이디 값: ',editGroupId);

  return (
    <>
      

      {/* 연락처 추가 */}
      <Modal
          className="modal-dialog-centered"
          isOpen={createModal}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="modal-title-default">
            연락처 추가
          </h3>
          <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setCreateModal(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
          <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-mobile-alt" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                    className="form-control-alternative"
                    placeholder="전화번호를 입력하세요"
                    type="text"
                    onChange={(e) => {setNewPhoneNumber(e.target.value)}}
                />
              </InputGroup>
          </FormGroup>

          <FormGroup className="mb-3">
            <InputGroup className="input-group-alternative">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-edit" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                  className="form-control-alternative"
                  placeholder="메모를 입력하세요"
                  type="text"
                  onChange={(e) => {setNewMemo(e.target.value)}}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative" alignRight>
              <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-circle-08" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                    className="form-control-alternative"
                    placeholder="그룹을 선택하세요"
                    type="text"
                    onChange={(e) => {setNewMemo(e.target.value)}}
                />
              <DropdownButton 
                variant="outline-secondary"
                id="input-group-dropdown-2"
                title=""
                align="end"
              >
                <Dropdown.Item >그룹 1</Dropdown.Item>
                <Dropdown.Item >그룹 2</Dropdown.Item>
                <Dropdown.Item >그룹 3</Dropdown.Item>
              </DropdownButton>
            </InputGroup>
          </FormGroup>

        </div>
        <div className="modal-footer">
          <Button color="primary" type="button" onClick={registerContactNumber}>
            저장하기
          </Button>
        </div>
      </Modal>





      {/* 연락처 수정 */}
      <Modal
          className="modal-dialog-centered"
          isOpen={editModal}
      >
        <div className="modal-header">
          <h3 className="modal-title" id="modal-title-default">
            연락처 수정
          </h3>
          <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setEditModal(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
          <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-mobile-alt" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                    className="form-control-alternative"
                    value={editPhoneNumber}
                    type="text"
                    onChange={(e) => {setEditPhoneNumber(e.target.value)}}
                />
              </InputGroup>
          </FormGroup>

          <FormGroup className="mb-3">
            <InputGroup className="input-group-alternative">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-edit" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                  className="form-control-alternative"
                  value={editMemo}
                  type="text"
                  onChange={(e) => {setEditMemo(e.target.value)}}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <InputGroup className="input-group-alternative" alignRight>
              <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-circle-08" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                    className="form-control-alternative"
                    value={editGroupName}
                    type="text"
                    onChange={(e) => {setNewMemo(e.target.value)}}
                />
         
              <DropdownButton 
                variant="outline-secondary"
                id="input-group-dropdown-2"
                title=""
                align="end"
                onSelect={(eventKey)=> setEditGroupId(eventKey)}
              >
                  <Dropdown.Item eventKey={1}>그룹 1</Dropdown.Item>
                  <Dropdown.Item eventKey={2}>그룹 2</Dropdown.Item>
                  <Dropdown.Item eventKey={3}>그룹 3</Dropdown.Item>
  
              </DropdownButton>
   
            </InputGroup>
          </FormGroup>

        </div>
        <div className="modal-footer">
          <Button color="primary" type="button" onClick={editContactNumber}>
            수정하기
          </Button>
        </div>
      </Modal>





      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">연락처 목록 &nbsp;&nbsp;
                  <a href="#"><i className="fas fa-plus-circle" onClick={(e) => {setCreateModal(true)}}/></a>
                </h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">전화번호</th>
                    <th scope="col">그룹</th>
                    <th scope="col">메모</th>
                    
                    <th scope="col">삭제</th>
                    <th scope="col">수정</th>
                  </tr>
                </thead>
                <tbody>




                  {/* Dummy Conatact */}
                    <tr>
                      <th scope="row" key={dummyKey}>
                        1
                      </th>
                      <td>010-9190-8201</td>
                      <td>카카오 엔터프라이즈</td>
                      <td>메모입니다.</td>
                      <td><a href="#"><i className="fas fa-trash" onClick={(e) => {deleteContactNumber(dummyKey)}}/></a></td>
                      <td><a href="#"><i className="ni ni-settings-gear-65" onClick={(e) => {editConatactController(dummyKey)}}/></a></td>
                    </tr>


                
                {ContactNumberList.map((ContactNumber, index) => (
                    <tr>
                      <th scope="row" key={ContactNumber.id}>
                        {(nowPage-1)*pageData.size + index + 1}
                      </th>
                      <td>{ContactNumber.memo}</td>
                      <td>{makeHyphen(ContactNumber.phoneNumber)}</td>
                      <td>{makeHyphen(ContactNumber.blockNumber)}</td>
                      <td><a href="#"><i className="fas fa-trash" onClick={(e) => {deleteContactNumber(ContactNumber.id)}}/></a></td>
                      <td><a href="#"><i className="ni ni-settings-gear-65" onClick={(e) => {deleteContactNumber(ContactNumber.id)}}/></a></td>
                    </tr>
                ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    {/*prev*/}
                    <PaginationItem className={pageData.prev ? "active" : "disabled"}>
                      <PaginationLink
                        href={"/admin/sender/" + (pageData.start-1).toString()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {/*now*/}
                    {pageData.pageList.map(item => (
                        <PaginationItem className={item == parseInt(nowPage) ? "active" : "inactive"}>
                          <PaginationLink
                              href={"/admin/sender/" + item}
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/*next*/}
                    <PaginationItem className={pageData.next ? "active" : "disabled"}>
                      <PaginationLink
                          href={"/admin/sender/" + (pageData.end+1).toString()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>

                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default ContactNumber;
