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
    Modal, Input, FormGroup, InputGroup, InputGroupText, InputGroupAddon, Col
} from "reactstrap";
import Header from "components/Headers/Header.js";
import React, {useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"

const SenderNumber = () => {

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

    // 발신자 전화번호 조회
    const [senderNumberList, setSenderNumberList] = useState([])

    // 발신자 전화번호 추가 모달
    const [isRegModal, setIsRegModal] = useState(false);

    // 차단번호 모달
    const [isBlockModal, setIsBlockModal] = useState(false);

    // 인증번호 입력 창
    const [isForm, setIsForm] = useState(false);

    // 인증번호 확인 여부
    const [isAccessNumCheck, setIsAccessNumCheck] = useState(false);

    // 발신자 전화번호 추가
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newMemo, setNewMemo] = useState("");
    const [accessNum, setAccessNum] = useState("");

    // 연락처 format 수정 메소드
    const makeHyphen = (number) => {
        return number.slice(0, 3) + "-" + number.slice(3, 7) + "-" + number.slice(7, 11)
    }

    //발신자 전화번호 목록 불러오기
    useState(async () => {
        await axios.get(`/sender/${nowPage}`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                    setSenderNumberList(response.data.result.dtoList)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    })

    // 차단번호 받기
    const [blockNumberList, setBlockNumberList] = useState([]);
    const getBlockNumber = async (senderNumber) => {
        await axios.get('/blocks', {
            params: {
                "senderNumber": senderNumber
            }
        })
            .then((response) => {
                if (response.data.isSuccess) {
                    setBlockNumberList(response.data.result.receiveNumbers)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 인증번호 받기
    const authPhone = async () => {
        newPhoneNumber === "" ? await Swal.fire({
                title            : "전화번호를 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) :
            await axios.post("/sms/send", {"to": newPhoneNumber})
                .then(async (response) => {
                    if (response.data.isSuccess) {
                        await Swal.fire({
                            title            : "인증문자를 발송했습니다",
                            icon             : "success",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                        setIsForm(true)
                    } else {
                        await Swal.fire({
                            title            : response.data.message,
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    }
                }).catch(async (error) => {
                    await Swal.fire({
                        title            : error.response.data.message,
                        icon             : "error",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                })
    }

    // 인증번호 확인
    const authAccessNum = async () => {
        accessNum === "" ? await Swal.fire({
                title            : "인증번호를 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) :
            await axios.post("/sms/valid", {
                "phoneNumber": newPhoneNumber,
                "authToken"  : accessNum
            }).then(async (response) => {
                if (response.data.isSuccess) {
                    setIsForm(false)
                    setIsAccessNumCheck(true)
                    await Swal.fire({
                        title            : "성공적으로 인증되었습니다",
                        icon             : "success",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                } else {
                    await Swal.fire({
                        title            : response.data.message,
                        icon             : "error",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                }
            }).catch(async (error) => {
                await Swal.fire({
                    title            : error.response.data.message,
                    icon             : "error",
                    showConfirmButton: false,
                    timer            : 1000
                })
            })
    }

    // 발신자 번호 추가하기
    const registerSenderNumber = async () => {
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
                !isAccessNumCheck ? await Swal.fire({
                        title            : "전화번호를 인증하세요",
                        icon             : "warning",
                        showConfirmButton: false,
                        timer            : 1000
                    }) :
                    await axios.post("/sender/register", {
                        "memo"       : newMemo,
                        "phoneNumber": newPhoneNumber
                    })
                        .then(async (response) => {
                            if (response.data.isSuccess) {
                                await Swal.fire({
                                    title            : "발신번호를 저장했습니다",
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
                                title            : "발신번호를 저장하는데 실패했습니다",
                                text             : "관리자에게 문의하세요",
                                icon             : "error",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                        })
    }

    // 발신자 번호 삭제하기
    const deleteSenderNumber = async (senderNumberId) => {
        Swal.fire({
            title            : "발신번호를 삭제하시겠습니까?",
            text             : "발신번호 삭제시 복구가 불가능합니다",
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : "아니요",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.patch(`/sender/delete/${senderNumberId}`)
                    .then(async (response) => {
                        if (response.data.isSuccess) {
                            await Swal.fire({
                                title            : "발신번호를 삭제했습니다",
                                icon             : "success",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                            window.location.replace("/admin/sender/1")
                        } else {
                            await Swal.fire({
                                title            : response.data.message,
                                icon             : "error",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                            console.log(response.data.message)
                        }
                    })
                    .catch(async (error) => {
                        await Swal.fire({
                            title            : "발신번호를 삭제하는데 실패했습니다",
                            text             : "관리자에게 문의하세요",
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                        console.log(error)
                    })
            }
        })
    }

    return (
        <>
            {/* modal */}
            <Modal
                className="modal-dialog-centered"
                isOpen={isRegModal}
            >

                {/*modal header*/}
                <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                        발신자 전화번호 추가
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setIsRegModal(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                {/*modal body*/}
                <div className="modal-body">

                    {/*input memo*/}
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

                    {/*input phoneNumber*/}
                    <FormGroup>
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
                            <Button color="primary" outline type="button" onClick={authPhone}>
                                인증
                            </Button>
                        </InputGroup>
                    </FormGroup>

                    {/*input accessNum*/}
                    <FormGroup style={{display: isForm ? null : "none"}}>
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="fas fa-lock"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input
                                className="form-control-alternative"
                                placeholder="인증번호를 입력하세요"
                                type="text"
                                onChange={(e) => {
                                    setAccessNum(e.target.value)
                                }}
                            />
                            <Button color="primary" outline type="button" onClick={authAccessNum}>
                                확인
                            </Button>
                        </InputGroup>
                    </FormGroup>

                </div>

                {/*modal footer*/}
                <div className="modal-footer">
                    <Button color="primary" type="button" onClick={registerSenderNumber}>
                        추가하기
                    </Button>
                </div>
            </Modal>

            <Modal
                className="modal-dialog-centered"
                isOpen={isBlockModal}
            >

                {/*modal header*/}
                <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                        차단 번호 목록
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setIsBlockModal(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                {/*modal body*/}
                <div className="modal-body">
                    {/*table*/}
                    <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                        <tr>
                            <th scope="col" className="text-center">No</th>
                            <th scope="col" className="text-center">차단 번호</th>
                        </tr>
                        </thead>
                        <tbody>
                        {blockNumberList.map((blockNumber, index) => (
                            <tr>
                                <th scope="row" className="text-center" key={index}>
                                    {index + 1}
                                </th>
                                <td className="text-center">{blockNumber}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>

                {/*modal footer*/}
                <div className="modal-footer">
                    <Button color="primary" type="button" onClick={(e) => setIsBlockModal(false)}>
                        닫기
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
                                <h3 className="mb-0">발신자 전화번호 목록 &nbsp;&nbsp;
                                    <a href="#"><i className="fas fa-plus-circle" onClick={(e) => {
                                        setIsRegModal(true)
                                    }}/></a>
                                </h3>
                            </CardHeader>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th className="text-center" scope="col">No</th>
                                    <th className="text-center" scope="col">메모</th>
                                    <th className="text-center" scope="col">전화번호</th>
                                    <th className="text-center" scope="col">차단번호</th>
                                    <th className="text-center" scope="col">차단한 연락처</th>
                                    <th className="text-center" scope="col">삭제</th>
                                </tr>
                                </thead>
                                <tbody>
                                {senderNumberList.map((senderNumber, index) => (
                                    <tr>
                                        <th className="text-center" scope="row" key={senderNumber.id}>
                                            {(nowPage - 1) * pageData.size + index + 1}
                                        </th>
                                        <td className="text-center">{senderNumber.memo}</td>
                                        <td className="text-center">{senderNumber.phoneNumber != null ? makeHyphen(senderNumber.phoneNumber) : null}</td>
                                        <td className="text-center">{senderNumber.blockNumber != null ? makeHyphen(senderNumber.blockNumber) : null}</td>
                                        <td className="text-center">
                                            <a href="#">
                                                <i className="fas fa-eye"
                                                   onClick={(e) => {
                                                       setIsBlockModal(true);
                                                       getBlockNumber(senderNumber.phoneNumber);
                                                   }}/>
                                            </a>
                                        </td>
                                        <td className="text-center">
                                            <a href="#">
                                                <i className="fas fa-trash" onClick={(e) => {
                                                    deleteSenderNumber(senderNumber.id)
                                                }}/>
                                            </a>
                                        </td>
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
                                                href={"/admin/sender/" + (pageData.start - 1).toString()}
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
                                                    href={"/admin/sender/" + item}
                                                >
                                                    {item}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        {/*next*/}
                                        <PaginationItem className={pageData.next ? "active" : "disabled"}>
                                            <PaginationLink
                                                href={"/admin/sender/" + (pageData.end + 1).toString()}
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

export default SenderNumber;
