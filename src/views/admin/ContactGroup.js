/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
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
  Modal, Input, FormGroup, InputGroup, InputGroupText, InputGroupAddon,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import React, {useState} from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";

const ContactGroup = () => {

  // 페이지네이션
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

  // 그룹 조회
  const [contactGroupList, setContactGroupList] = useState([])

  // 그룹 생성
  const [isRegModal, setIsRegModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState();

  // 그룹 수정
  const [isModModal, setIsModModal] = useState(false);
  const [editGroupId, setEditGroupId] = useState();
  const [editGroupName, setEditGroupName] = useState();

  // 그룹에 포함된 연락처 목록
  const [contactList, setContactList] = useState([]);

  // 연락처 format 수정 메소드
  const makeHyphen = (number) => {
    return number.slice(0,3) + "-" + number.slice(3,7) + "-" + number.slice(7,11)
  }

  // 날짜 format 수정 메소드
  const makeDate = (dateList) => {
    return dateList[0] + "-" + dateList[1] + "-" + dateList[2] + " " + dateList[3] + ":" + dateList[4] + ":" + dateList[5]
  }

  // 그룹 조회 api 연동
  useState(async () => {
    await axios.get(`/group/list/${nowPage}`)
        .then((response) => {
          if (response.data.isSuccess) {
            setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
            setContactGroupList(response.data.result.dtoList)
          } else {
            window.alert(response.data.message)
          }
        })
        .catch((error) => {
          window.alert(error.response.data.message)
        })
  })

  // 그룹 생성 api 연동
  const registerContactGroup = async () => {
    newGroupName == null ?  window.alert("그룹 이름을 입력하세요") :
        await axios.post("/group/save", {
          "name" : newGroupName
        })
        .then((response) => {
          if (response.data.isSuccess) {
            window.alert(response.data.message)
            window.location.replace("/admin/group/1")
          } else {
            window.alert(response.data.message)
          }
        })
        .catch((error) => {
          window.alert(error.response.data.message)
        })
  }

  // 그룹 수정 api 연동
  const editContactGroup = async (contactGroupId) => {
    editGroupName == null ? window.alert("그룹 이름을 입력하세요") :
      await axios.patch('/group/edit', {
        "contactGroupId" : editGroupId,
        "name" : editGroupName
      })
          .then((response) => {
            if (response.data.isSuccess) {
              window.alert(response.data.message)
              window.location.replace("/admin/group/1")
            } else {
              window.alert(response.data.message)
            }
          })
          .catch((error) => {
            window.alert(error.response.data.message)
          })
  }

  // 그룹 삭제 api 연동
  const deleteContactGroup = async (contactGroupId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await axios.patch(`/group/delete/${contactGroupId}`)
          .then((response) => {
            if (response.data.isSuccess) {
              window.alert(response.data.message)
              window.location.replace("/admin/group/1")
            } else {
              window.alert(response.data.message)
            }
          })
          .catch((error) => {
            window.alert(error.response.data.message)
          })
    }

  }

  // 연락처 그룹 연동 해제 api 연동
  const quitContactGroup = async (contactId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await axios.patch(`/contact/quit/${contactId}`)
          .then((response) => {
            if (response.data.isSuccess) {
              window.alert(response.data.message)
              window.location.replace("/admin/group/1")
            } else {
              window.alert(response.data.message)
            }
          })
          .catch((error) => {
            window.alert(error.response.data.message)
          })
    }
  }

  return (
    <>

      {/* modal start */}
      <Modal
          className="modal-dialog-centered"
          isOpen={isRegModal || isModModal}
          size="lg"
      >

        {/* modal header */}
        <div className="modal-header">
          <h3 className="modal-title" id="modal-title-default">
            {isRegModal ? "수신자 그룹 추가" : isModModal ? "수신자 그룹 수정" : null}
          </h3>
          <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => {setIsRegModal(false); setIsModModal(false)}}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>

        {/* modal body */}
        <div className="modal-body">

          {/* input : 그룹 이름 입력 */}
          <FormGroup className="mb-3">
            <InputGroup className="input-group-alternative">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fas fa-users" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                  value={isModModal ? editGroupName : null}
                  className="form-control-alternative"
                  placeholder="그룹 이름을 입력하세요"
                  type="text"
                  onChange={(e) => (isRegModal ? setNewGroupName(e.target.value) : (isModModal ? setEditGroupName(e.target.value) : null))}
              />
            </InputGroup>
          </FormGroup>

          {/* 그룹에 포함된 연락처 목록 */}
          {isRegModal ? null : isModModal ? (
              <Table className="align-items-center mb-3" responsive>
                <thead className="thead-light">
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">메모</th>
                  <th scope="col">전화번호</th>
                  <th scope="col">그룹에서 삭제</th>
                </tr>
                </thead>
                <tbody>
                {contactList.map((contact, index) => (
                    <tr>
                      <th scope="row" key={contact.id}>
                        {(nowPage-1)*pageData.size + index + 1}
                      </th>
                      <td>{contact.memo}</td>
                      <td>{contact.phoneNumber != null ? makeHyphen(contact.phoneNumber) : null}</td>
                      <td><a href="#"><i className="fas fa-trash" onClick={(e) => {quitContactGroup(contact.id)}}/></a></td>
                    </tr>
                ))}
                </tbody>
              </Table>
          ) : null}

        </div>

        {/* modal footer */}
        <div className="modal-footer">
          <Button color="primary" type="button" onClick={isRegModal ? registerContactGroup : (isModModal ? editContactGroup : null)}>
            {isRegModal ? "추가하기" : isModModal ? "수정하기" : null}
          </Button>
        </div>
      </Modal>
      {/* modal end */}


      <Header />


      {/* Page content */}
      <Container className="mt--7" fluid>

        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">수신자 그룹 목록 &nbsp;&nbsp;
                  <a href="#"><i className="fas fa-plus-circle" onClick={(e) => {setIsRegModal(true)}}/></a>
                </h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">그룹 이름</th>
                    <th scope="col">그룹 연락처 수</th>
                    <th scope="col">그룹 생성일</th>
                    <th scope="col">그룹 수정일</th>
                    <th scope="col">삭제</th>
                    <th scope="col">수정</th>
                  </tr>
                </thead>
                <tbody>
                {contactGroupList.map((contactGroup, index) => (
                    <tr>
                      <th scope="row" key={contactGroup.id}>
                        {(nowPage-1)*pageData.size + index + 1}
                      </th>
                      <td>{contactGroup.name}</td>
                      <td>{contactGroup.contactDTOList.length}</td>
                      <td>{makeDate(contactGroup.createdAt)}</td>
                      <td>{makeDate(contactGroup.updatedAt)}</td>
                      <td><a href="#"><i className="fas fa-trash" onClick={(e) => {deleteContactGroup(contactGroup.id)}}/></a></td>
                      <td><a href="#"><i className="ni ni-settings-gear-65" onClick={(e) => {
                        setIsModModal(true);
                        setEditGroupId(contactGroup.id);
                        setEditGroupName(contactGroup.name);
                        setContactList(contactGroup.contactDTOList);
                      }
                      }/></a></td>
                    </tr>
                ))}
                </tbody>
              </Table>


              {/* card footer */}
              <CardFooter className="py-4">
                <nav aria-label="...">

                  {/* pagination */}
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    {/*prev*/}
                    <PaginationItem className={pageData.prev ? "active" : "disabled"}>
                      <PaginationLink
                        href={"/admin/group/" + (pageData.start-1).toString()}
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
                              href={"/admin/group/" + item}
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/*next*/}
                    <PaginationItem className={pageData.next ? "active" : "disabled"}>
                      <PaginationLink
                          href={"/admin/group/" + (pageData.end+1).toString()}
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

export default ContactGroup;
