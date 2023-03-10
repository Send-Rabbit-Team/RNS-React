import {
    Card,
    CardHeader,
    CardBody,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Container,
    Row,
    Col,
    Button,
    Modal, Input, FormGroup, InputGroup, InputGroupText, InputGroupAddon
} from "reactstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Header from "components/Headers/Header.js";
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"


const ContactNumber = () => {

    //페이지네이션
    const params = useParams();
    const nowPage = isNaN(params.page) ? 1 : params.page
    console.log("nowPage: ", nowPage)

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

    const [ContactNumberList, setContactNumberList] = useState([])
    const [contactGroupList, setContactGroupList] = useState([])


    // 연락처 필터
    const [searchInput, setSearchInput] = useState();
    const [filter, setFilter] = useState(false);
    const [searchContactNumberList, setSearchContactNumberList] = useState([]);
    console.log("searchInput: ", searchInput)


    // 연락처 추가 Modal
    const [createModal, setCreateModal] = useState(false);
    const [newGroupId, setNewGroupId] = useState(null);
    const [newGroupName, setNewGroupName] = useState();
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newMemo, setNewMemo] = useState("");

    // 연락처 수정 Modal
    const [editModal, setEditModal] = useState(false);
    const [editContactId, setEditContactId] = useState();
    const [editPhoneNumber, setEditPhoneNumber] = useState("");
    const [editMemo, setEditMemo] = useState("");
    const [editGroupId, setEditGroupId] = useState();
    const [editGroupName, setEditGroupName] = useState();

    // 연락처 format 수정 메소드
    const makeHyphen = (number) => {
        return number.slice(0, 3) + "-" +
            number.slice(3, 7) + "-" +
            number.slice(7, 11)
    }

    // 연락처 모두 불러오기
    useState(async () => {
            await axios.get(`/contact/list/${nowPage}`)
                .then((response) => {
                    if (response.data.isSuccess) {
                        setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                        setContactNumberList(response.data.result.dtoList)
                    } else {
                        console.log(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
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
                    } else {
                        console.log(response.data.message)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }, [searchInput]
    )

    // 모든 그룹 조회하기
    useState(async () => {
            await axios.get(`/group/getAll`)
                .then((response) => {
                    if (response.data.isSuccess) {
                        setContactGroupList([...response.data.result])
                    } else {
                        console.log(response.data.message)
                    }
                }).catch((error) => {
                    console.log(error)
                })
        }
    )

    // 검색 컨트롤러
    const searchController = (value) => {
        console.log("value", value);
        if (value.length == 0 && filter == true) {
            setFilter(false)
        } else if (value.length != 0 && filter == false) {
            setFilter(true)
            setSearchInput(value)
        }

        if (filter == true) {
            setSearchInput(value)
        }
    }

    // [수정] 그룹 선택 컨트롤러
    const editDropDownSelectController = (key) => {
        if (key == "(그룹 없음)") {
            setEditGroupId("null")
            setEditGroupName("(그룹없음)")
        } else {
            setEditGroupId(JSON.parse(key).id)
            setEditGroupName(JSON.parse(key).name)
        }
    }

    // [추가] 그룹 선택 컨트롤러
    const newDropDownSelectController = (key) => {
        console.log("key: ", key)
        if (key == "(그룹 없음)") {
            setNewGroupId(null)
            setNewGroupName("(그룹없음)")

        } else {
            setNewGroupId(JSON.parse(key).id)
            setNewGroupName(JSON.parse(key).name)
        }

    }

    // 연락처 추가 메소드
    const registerContactNumber = async () => {
        newMemo === "" ? await Swal.fire({
                title            : "전화번호 메모를 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) :
            newPhoneNumber === "" ? await Swal.fire({
                    title            : "전화번호를 입력하세요",
                    icon             : "warning",
                    showConfirmButton: false,
                    timer            : 1000
                }) :
                await axios.post("/contact/create", {
                    "contactGroupId": newGroupId,
                    "memo"          : newMemo,
                    "phoneNumber"   : newPhoneNumber
                })
                    .then(async (response) => {
                        if (response.data.isSuccess) {
                            await Swal.fire({
                                title            : "연락처를 저장했습니다",
                                icon             : "success",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                            window.location.reload()
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
                            title            : "연락처를 저장하는데 실패했습니다",
                            text             : "관리자에게 문의하세요",
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    })
    }

    // 연락처 삭제 메소드
    const deleteContactNumber = async (ContactNumberId) => {
        Swal.fire({
            title            : "연락처를 삭제하시겠습니까?",
            text             : "연락처 삭제시 복구가 불가능합니다",
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : "아니요",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.patch(`/contact/delete/${ContactNumberId}`)
                    .then(async (response) => {
                        if (response.data.isSuccess) {
                            await Swal.fire({
                                title            : "연락처를 삭제했습니다",
                                icon             : "success",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                            window.location.replace("/admin/contact/1")
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
                            title            : "연락처를 삭제하는데 실패했습니다",
                            text             : "관리자에게 문의하세요",
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    })
            }
        })
    }

    // 그룹 정보 불러오기
    const getGroupInfo = async (groupId) => {
        await axios.get(`/group/${groupId}`)
            .then(
                (response) => {
                    if (response.data.isSuccess) {
                        setEditGroupName(response.data.result.name);
                    } else {
                        console.log(response.data.message)
                    }
                }
            ).catch((error) => {
                console.log(error)
            })
    }

    // 연락처 수정 컨트롤러
    const editConatactController = async (ContactNumberId) => {
        // 기존 연락처 정보 받아오기
        await axios.get(`/contact/${ContactNumberId}`)
            .then(
                (response) => {
                    if (response.data.isSuccess) {
                        setEditContactId(ContactNumberId)
                        setEditPhoneNumber(response.data.result.phoneNumber);
                        setEditGroupId(response.data.result.groupId);
                        getGroupInfo(response.data.result.groupId);
                        setEditMemo(response.data.result.memo);
                    } else {
                        console.log(response.data.message)
                    }
                }).catch((error) => {
                console.log(error)
            })
        // Modal 활성화
        setEditModal(true);
    }

    // 연락처 수정 메소드
    const editContactNumber = async () => {
        editMemo === "" ? await Swal.fire({
            title            : "전화번호 메모를 입력하세요",
            icon             : "warning",
            showConfirmButton: false,
            timer            : 1000
        }) : editPhoneNumber === "" ? await Swal.fire({
            title            : "전화번호를 입력하세요",
            icon             : "warning",
            showConfirmButton: false,
            timer            : 1000
        }) : await Swal.fire({
            title            : "연락처를 수정하시겠습니까?",
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : `아니요`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.patch("/contact/edit", {
                    "contactId"     : editContactId,
                    "contactGroupId": editGroupId,
                    "phoneNumber"   : editPhoneNumber,
                    "memo"          : editMemo,
                })
                    .then(async (response) => {
                        if (response.data.isSuccess) {
                            await Swal.fire({
                                title            : "연락처를 수정했습니다",
                                icon             : "success",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                            window.location.reload()
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
                            title            : "연락처를 수정하는데 실패했습니다",
                            text             : "관리자에게 문의하세요",
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    })
            }
        })
    }


    const searchContactNumber = searchContactNumberList.filter((p) => {
        return p.phoneNumber.includes(searchInput)
    })


    const contactNumberListComponent = ContactNumberList.map((ContactNumber, index) => (
            console.log("ContactNumber: ", ContactNumber),
                <tr>
                    <th className="text-center" scope="row" key={ContactNumber.id}>
                        {(nowPage - 1) * pageData.size + index + 1}
                    </th>
                    <td className="text-center">{ContactNumber.contactMemo}</td>
                    <td className="text-center">{makeHyphen(ContactNumber.phoneNumber)}</td>
                    <td className="text-center">{ContactNumber.groupName}</td>
                    <td className="text-center"><a href="#"><i className="fas fa-trash" onClick={(e) => {
                        deleteContactNumber(ContactNumber.contactId)
                    }}/></a></td>
                    <td className="text-center"><a href="#"><i className="ni ni-settings-gear-65" onClick={(e) => {
                        editConatactController(ContactNumber.contactId)
                    }}/></a></td>
                </tr>
        )
    )

    const searchContactNumberListComponent = searchContactNumber.map((searchContactNumber, index) => (
            <tr>
                <th className="text-center" scope="row" key={searchContactNumber.id}>
                    {(nowPage - 1) * pageData.size + index + 1}
                </th>
                <td className="text-center">{searchContactNumber.memo}</td>
                <td className="text-center">{makeHyphen(searchContactNumber.phoneNumber)}</td>
                <td className="text-center">{searchContactNumber.groupName}</td>
                <td className="text-center"><a href="#"><i className="fas fa-trash" onClick={(e) => {
                    deleteContactNumber(searchContactNumber.id)
                }}/></a></td>
                <td className="text-center"><a href="#"><i className="ni ni-settings-gear-65" onClick={(e) => {
                    editConatactController(searchContactNumber.id)
                }}/></a></td>
            </tr>
        )
    )


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
                                    <i className="fa fa-edit"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                className="form-control-alternative"
                                placeholder="메모를 입력하세요"
                                type="text"
                                onChange={(e) => {
                                    setNewMemo(e.target.value)
                                }}
                            />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-mobile-alt"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                className="form-control-alternative"
                                placeholder="전화번호를 입력하세요"
                                type="text"
                                onChange={(e) => {
                                    setNewPhoneNumber(e.target.value)
                                }}
                            />
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <InputGroup className="input-group-alternative" alignRight>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-circle-08"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                className="form-control-alternative"
                                placeholder="그룹을 선택하세요"
                                value={newGroupName != null ? newGroupName : ""}
                                type="text"
                            />
                            <DropdownButton
                                variant="outline-secondary"
                                id="input-group-dropdown-2"
                                title=""
                                align="end"
                                onSelect={(contactGroup) => newDropDownSelectController((contactGroup))}
                            >
                                <Dropdown.Item eventKey="(그룹 없음)" className="text-lead text-light">(그룹
                                    없음)</Dropdown.Item>
                                {contactGroupList.map(
                                    contactGroup => {
                                        return <Dropdown.Item
                                            eventKey={JSON.stringify(contactGroup)}>{contactGroup.name}</Dropdown.Item>
                                    }
                                )}
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
                                    <i className="fa fa-edit"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                className="form-control-alternative"
                                value={editMemo}
                                type="text"
                                onChange={(e) => {
                                    setEditMemo(e.target.value)
                                }}
                            />
                        </InputGroup>
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-mobile-alt"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                className="form-control-alternative"
                                value={editPhoneNumber}
                                type="text"
                                onChange={(e) => {
                                    setEditPhoneNumber(e.target.value)
                                }}
                            />
                        </InputGroup>
                    </FormGroup>

                    <FormGroup>
                        <InputGroup className="input-group-alternative" alignRight>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-circle-08"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                className="form-control-alternative"
                                value={editGroupName}
                                type="text"
                                onChange={(e) => {
                                    setNewMemo(e.target.value)
                                }}
                            />

                            <DropdownButton
                                variant="outline-secondary"
                                id="input-group-dropdown-2"
                                title=""
                                align="end"
                                onSelect={(contactGroup) => editDropDownSelectController((contactGroup))}
                            >

                                <Dropdown.Item eventKey="(그룹 없음)" className="text-lead text-light">(그룹
                                    없음)</Dropdown.Item>
                                {contactGroupList.map(
                                    contactGroup => {
                                        return <Dropdown.Item
                                            eventKey={JSON.stringify(contactGroup)}>{contactGroup.name}</Dropdown.Item>
                                    }
                                )}
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


            <Header/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row>
                                    <Col>
                                        <h3 className="mb-0" style={{paddingTop: 10}}>연락처 목록 &nbsp;&nbsp;
                                            <a href="#"><i className="fas fa-plus-circle" onClick={(e) => {
                                                setCreateModal(true)
                                            }}/></a>
                                        </h3>
                                    </Col>
                                    {/* 연락처 검색 */}
                                    <Col>
                                        <InputGroup className="mb-0">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-zoom-split-in"/>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                placeholder="Search"
                                                type="text"
                                                onChange={(e) => {
                                                    searchController(e.target.value)
                                                }}
                                                value={searchInput}
                                                onCh/>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th className="text-center" scope="col">No</th>
                                    <th className="text-center" scope="col">메모</th>
                                    <th className="text-center" scope="col">전화번호</th>
                                    <th className="text-center" scope="col">그룹</th>
                                    <th className="text-center" scope="col">삭제</th>
                                    <th className="text-center" scope="col">수정</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filter == true ? searchContactNumberListComponent : contactNumberListComponent}
                                </tbody>
                            </Table>

                            <CardBody className="py-4">
                                <nav aria-label="...">
                                    <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                    >
                                        {/*prev*/}
                                        <PaginationItem className={pageData.prev ? "active" : "disabled"}>
                                            <PaginationLink
                                                href={"/admin/contact/" + (pageData.start - 1).toString()}
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
                                                    href={"/admin/contact/" + item}
                                                >
                                                    {item}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        {/*next*/}
                                        <PaginationItem className={pageData.next ? "active" : "disabled"}>
                                            <PaginationLink
                                                href={"/admin/contact/" + (pageData.end + 1).toString()}
                                            >
                                                <i className="fas fa-angle-right"/>
                                                <span className="sr-only">Next</span>
                                            </PaginationLink>
                                        </PaginationItem>

                                    </Pagination>
                                </nav>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default ContactNumber;
