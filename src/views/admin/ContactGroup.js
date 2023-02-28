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
import {useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"

const ContactGroup = () => {

    // 페이지네이션
    const params = useParams();
    const nowPage = isNaN(params.page) ? 1 : params.page
    const [pageData, setPageData] = useState({
        totalPage: 0,
        page     : 1,
        size     : 0,
        start    : 0,
        end      : 0,
        prev     : false,
        next     : false,
        pageList : []
    })

    // 그룹 조회
    const [contactGroupList, setContactGroupList] = useState([])

    // 그룹 생성
    const [isRegModal, setIsRegModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");

    // 그룹 수정
    const [isModModal, setIsModModal] = useState(false);
    const [editGroupId, setEditGroupId] = useState();
    const [editGroupName, setEditGroupName] = useState("");

    // 그룹에 포함된 연락처 목록
    const [contactList, setContactList] = useState([]);

    // 연락처 format 수정 메소드
    const makeHyphen = (number) => {
        return number.slice(0, 3) + "-" + number.slice(3, 7) + "-" + number.slice(7, 11)
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
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    })

    // 그룹에 속한 연락처 불러오기 api 연동
    const getGroupContact = async (grouId) => {
        await axios.get(`/contact/byGroup?groupId=${grouId}`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setContactList(response.data.result)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }

    // 그룹 생성 api 연동
    const registerContactGroup = async () => {
        newGroupName === "" ?
            await Swal.fire({
                title            : "그룹 이름을 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            })
            :
            await axios.post("/group/save", {
                "name": newGroupName
            })
                .then(async (response) => {
                    if (response.data.isSuccess) {
                        await Swal.fire({
                            title            : "그룹을 생성했습니다",
                            icon             : "success",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                        window.location.replace("/admin/group/1")
                    } else {
                        await Swal.fire({
                            title            : response.data.message,
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    }
                })
                .catch(async (error) => {
                    await Swal.fire({
                        title            : "그룹을 생성하는데 실패했습니다",
                        text             : "관리자에게 문의하세요",
                        icon             : "error",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                })
    }

    // 그룹 수정 api 연동
    const editContactGroup = async () => {
        editGroupName === "" ? Swal.fire({
                title            : "그룹 이름을 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) :
            await Swal.fire({
                title            : "그룹을 수정하시겠습니까?",
                icon             : "question",
                showDenyButton   : true,
                confirmButtonText: "네",
                denyButtonText   : "아니요",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.patch("/group/edit", {
                        "contactGroupId": editGroupId,
                        "name"          : editGroupName
                    })
                        .then(async (response) => {
                            if (response.data.isSuccess) {
                                await Swal.fire({
                                    title            : "그룹을 수정했습니다",
                                    icon             : "success",
                                    showConfirmButton: false,
                                    timer            : 1000
                                })
                                window.location.replace("/admin/group/1")
                            } else {
                                await Swal.fire({
                                    title            : response.data.message,
                                    icon             : "error",
                                    showConfirmButton: false,
                                    timer            : 1000
                                })
                            }
                        })
                        .catch(async (error) => {
                            await Swal.fire({
                                title            : "그룹을 수정하는데 실패했습니다",
                                text             : "관리자에게 문의하세요",
                                icon             : "error",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                        })
                }
            })
    }

    // 그룹 삭제 api 연동
    const deleteContactGroup = async (contactGroupId) => {
        Swal.fire({
            title            : "그룹을 삭제하시겠습니까?",
            text             : "그룹 삭제시 복구가 불가능합니다",
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : "아니요",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.patch(`/group/delete/${contactGroupId}`)
                    .then(async (response) => {
                        if (response.data.isSuccess) {
                            await Swal.fire({
                                title            : "그룹을 삭제했습니다",
                                icon             : "success",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                            window.location.replace("/admin/group/1")
                        } else {
                            await Swal.fire({
                                title            : response.data.message,
                                icon             : "error",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                        }
                    })
                    .catch(async (error) => {
                        await Swal.fire({
                            title            : "그룹을 삭제하는데 실패했습니다",
                            text             : "관리자에게 문의하세요",
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    })
            }
        })
    }

    // 연락처 그룹 연동 해제 api 연동
    const quitContactGroup = async (contactId) => {
        Swal.fire({
            title            : "그룹에서 삭제하시겠습니까?",
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : "아니요",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.patch(`/contact/quit/${contactId}`)
                    .then(async (response) => {
                        if (response.data.isSuccess) {
                            await Swal.fire({
                                title            : "그룹에서 삭제했습니다",
                                icon             : "success",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                            window.location.replace("/admin/group/1")
                        } else {
                            await Swal.fire({
                                title            : response.data.message,
                                icon             : "error",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                        }
                    })
                    .catch(async (error) => {
                        await Swal.fire({
                            title            : "그룹에서 삭제하는데 실패했습니다",
                            text             : "관리자에게 문의하세요",
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    })
            }
        })
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
                        onClick={() => {
                            setIsRegModal(false);
                            setIsModModal(false)
                        }}
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
                                    <i className="fas fa-users"/>
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
                                <th className="text-center" scope="col">No</th>
                                <th className="text-center" scope="col">메모</th>
                                <th className="text-center" scope="col">전화번호</th>
                                <th className="text-center" scope="col">그룹에서 삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {contactList.map((contact, index) => (
                                <tr>
                                    <th className="text-center" scope="row" key={contact.contactId}>{index + 1}</th>
                                    <td className="text-center">{contact.contactMemo}</td>
                                    <td className="text-center">{contact.phoneNumber != null ? makeHyphen(contact.phoneNumber) : null}</td>
                                    <td className="text-center"><a href="#"><i className="fas fa-trash"
                                                                               onClick={(e) => {
                                                                                   quitContactGroup(contact.contactId)
                                                                               }}/></a></td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    ) : null}

                </div>

                {/* modal footer */}
                <div className="modal-footer">
                    <Button color="primary" type="button"
                            onClick={isRegModal ? registerContactGroup : (isModModal ? editContactGroup : null)}>
                        {isRegModal ? "추가하기" : isModModal ? "수정하기" : null}
                    </Button>
                </div>
            </Modal>
            {/* modal end */}


            <Header/>


            {/* Page content */}
            <Container className="mt--7" fluid>

                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">수신자 그룹 목록 &nbsp;&nbsp;
                                    <a href="#"><i className="fas fa-plus-circle" onClick={(e) => {
                                        setIsRegModal(true)
                                    }}/></a>
                                </h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th className="text-center" scope="col">No</th>
                                    <th className="text-center" scope="col">그룹 이름</th>
                                    <th className="text-center" scope="col">그룹 생성일</th>
                                    <th className="text-center" scope="col">그룹 수정일</th>
                                    <th className="text-center" scope="col">삭제</th>
                                    <th className="text-center" scope="col">수정</th>
                                </tr>
                                </thead>
                                <tbody>
                                {contactGroupList.map((contactGroup, index) => (
                                    <tr>
                                        <th className="text-center" scope="row" key={contactGroup.groupId}>
                                            {(nowPage - 1) * pageData.size + index + 1}
                                        </th>
                                        <td className="text-center">{contactGroup.groupName}</td>
                                        <td className="text-center">{makeDate(contactGroup.createdAt)}</td>
                                        <td className="text-center">{makeDate(contactGroup.updatedAt)}</td>
                                        <td className="text-center"><a href="#"><i className="fas fa-trash"
                                                                                   onClick={(e) => {
                                                                                       deleteContactGroup(contactGroup.groupId)
                                                                                   }}/></a></td>
                                        <td className="text-center"><a href="#"><i className="ni ni-settings-gear-65"
                                                                                   onClick={(e) => {
                                                                                       setIsModModal(true);
                                                                                       setEditGroupId(contactGroup.groupId);
                                                                                       setEditGroupName(contactGroup.groupName);
                                                                                       getGroupContact(contactGroup.groupId);
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
                                                href={"/admin/group/" + (pageData.start - 1).toString()}
                                                tabIndex="-1"
                                            >
                                                <i className="fas fa-angle-left"/>
                                                <span className="sr-only">Previous</span>
                                            </PaginationLink>
                                        </PaginationItem>

                                        {/*now*/}
                                        {pageData.pageList.map(item => (
                                            <PaginationItem
                                                className={item == parseInt(nowPage) ? "active" : "inactive"}>
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
                                                href={"/admin/group/" + (pageData.end + 1).toString()}
                                            >
                                                <i className="fas fa-angle-right"/>
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
