import {
    Card,
    CardHeader,
    CardFooter,
    Pagination,
    PaginationItem,
    PaginationLink,
    Table,
    Container,
    Row, Button, Modal,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Col,
    InputGroupAddon, Input, InputGroup,
    UncontrolledPopover,
    PopoverBody
} from "reactstrap";
import Header from "components/Headers/Header.js";
import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom';
import axios from "axios";
import {Doughnut, Pie, Bar} from "react-chartjs-2";
import Swal from "sweetalert2";
import {Image} from "react-bootstrap";

const MessageResult = () => {

    // 페이지네이션
    const params = useParams();
    const nowPage = isNaN(params.page) ? 1 : params.page
    const nowType = params.type === ":type" ? "all" : params.type
    const nowKeyword = params.keyword

    // console.log("nowPage : " + nowPage)
    // console.log("nowType : " + nowType)
    // console.log("nowKeyword : " + nowKeyword)

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

    // 현재 화면에 띄울 리스트
    useEffect(() => {
        if (nowType === "all") {
            getAllMessageResult()
        } else if (nowType === "filter") {
            getFilterMessageResult()
        } else {
            getSearchMessageResult()
        }
    }, [nowType])

    // 검색
    const [searchInput, setSearchInput] = useState("")
    const [searchType, setSearchType] = useState("")

    // 메시지 결과 리스트
    const [messageResultList, setMessageResultList] = useState([])
    const [messageResultInfoList, setMessageResultInfoList] = useState([])

    // 모달
    const [isInfoModal, setIsInfoModal] = useState(false);
    const [isContentModal, setIsContentModal] = useState(false);

    // 메시지 내용
    const [message, setMessage] = useState({});

    // 연락처 format 수정 메소드
    const makeHyphen = (number) => {
        return number.slice(0, 3) + "-" + number.slice(3, 7) + "-" + number.slice(7, 11)
    }

    // 날짜 format 수정 메소드
    const makeDate = (date) => {
        return date.split("T")[0] + " " + date.split("T")[1]
    }

    // 전체 메시지 결과 조회
    const getAllMessageResult = async () => {
        await axios.get(`/message/result/${nowPage}`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                    setMessageResultList(response.data.result.dtoList)
                    console.log(response.data.result.dtoList)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 메시지 종류에 따른 메시지 결과 조회
    const getFilterMessageResult = async (messageType) => {
        await axios.get(`/message/result/filter/type/${nowPage}`, {
            params: {
                "type": nowKeyword
            }
        })
            .then((response) => {
                if (response.data.isSuccess) {
                    setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                    setMessageResultList(response.data.result.dtoList)
                    console.log(response.data.result.dtoList)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 메시지 검색에 따른 메시지 결과 조회
    const getSearchMessageResult = async () => {
        await axios.get(`/message/result/search/${nowPage}`, {
            params: {
                "type"   : nowType,
                "keyword": nowKeyword
            }
        })
            .then((response) => {
                if (response.data.isSuccess) {
                    setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                    setMessageResultList(response.data.result.dtoList)
                    console.log(response.data.result.dtoList)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 메시지 이미지 조회
    const [messageImages, setMessageImages] = useState([]);
    const getMessageImage = async (messageId) => {
        await axios.get("/message/images", {
            params : {
                "messageId" : messageId
            }
        }).then((response) => {
            if (response.data.isSuccess) {
                setMessageImages(response.data.result.images)
            } else {
                setMessageImages([])
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // 메시지 상세 결과 조회
    const [payPoint, setPayPoint] = useState(0);
    const [refundPoint, setRefundPoint] = useState(0);
    const getMessageResultInfo = async (messageId) => {
        await axios.get(`/message/result/info/${messageId}`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setMessageResultInfoList(response.data.result.messageResultRes)
                    setBrokerData(response.data.result.broker)
                    setMessageStatusData(response.data.result.messageStatus)
                    setPayPoint(response.data.result.payPoint)
                    setRefundPoint(response.data.result.refundPoint)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 브로커 차트 정보 저장
    const [brokerChartLabels, setBrokerChartLabels] = useState([]);
    const [brokerChartData, setBrokerChartData] = useState([]);
    const setBrokerData = (brokers) => {
        const labels = []
        const data = []
        for (const broker in brokers) {
            labels.push(broker)
            data.push(brokers[broker])
        }
        setBrokerChartLabels(labels)
        setBrokerChartData(data)
    }

    // 메시지 상태 차트 정보 저장
    const [messageStatusData, setMessageStatusData] = useState({});

    // 브로커 차트 데이터
    const brokerChart = {
        labels  : brokerChartLabels,
        datasets: [
            {
                data           : brokerChartData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderWidth    : 1,
            },
        ],
    };

    // 메시지 상태 차트 데이터
    const messageStatusChart = {
        labels  : ["발송 성공", "발송 실패", "발송 중", "재발송"],
            datasets: [
            {
                data           : [
                    messageStatusData["SUCCESS"],
                    messageStatusData["FAIL"],
                    messageStatusData["PENDING"],
                    messageStatusData["RESEND"]
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                ],
                borderWidth    : 1,
            },
        ],
    };

    return (
        <>
            {/*modal*/}
            <Modal
                className="modal-dialog-centered"
                isOpen={isInfoModal}
                size="xl"
            >
                <UncontrolledPopover placement="bottom" target="invoice_popover">
                    <PopoverBody>
                        <h5 className="text-uppercase text-muted">사용 당근: &nbsp;
                            <span className="h2 font-weight-bold">{payPoint + refundPoint}</span>
                        </h5>
                        <h5 className="text-uppercase text-muted">환불 당근: &nbsp;
                            <span className="h2 font-weight-bold">{refundPoint}</span>
                        </h5>
                        <hr className="mt-1 mb-1"/>
                        <h5 className="text-uppercase text-muted">최종 사용: &nbsp;
                            <span className="h2 font-weight-bold">{payPoint}</span>
                        </h5>
                    </PopoverBody>
                </UncontrolledPopover>

                {/*modal header*/}
                <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                        메시지 발송 결과 상세 &nbsp;&nbsp;
                        <a href="#" className="text-lg"><i className="fas fa-comment-dollar" id="invoice_popover"/></a>
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setIsInfoModal(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>

                {/*modal body*/}
                <div className="modal-body">

                    {/*chart*/}
                    <Row className="m-3">
                        <Col lg={6}>
                            <Doughnut
                                data={brokerChart}
                                options={{
                                    title: {
                                        display: true,
                                        text   : "중계사 정보"
                                    }
                                }}
                            ></Doughnut>
                        </Col>
                        <Col lg={6}>
                            <Pie
                                data={messageStatusChart}
                                options={{
                                    title: {
                                        display: true,
                                        text   : "메시지 상태"
                                    }
                                }}
                            ></Pie>
                        </Col>
                    </Row>

                    {/*table*/}
                    <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                        <tr>
                            <th scope="col" className="text-center">No</th>
                            <th scope="col" className="text-center">발송 일시</th>
                            <th scope="col" className="text-center">수신자</th>
                            <th scope="col" className="text-center">그룹</th>
                            <th scope="col" className="text-center">중계사</th>
                            <th scope="col" className="text-center">상태</th>
                            <th scope="col" className="text-center">설명</th>
                        </tr>
                        </thead>
                        <tbody>
                        {messageResultInfoList.map((messageResultInfo, index) => (
                            <tr>
                                <th scope="row" className="text-center" key={messageResultInfo.id}>
                                    {index + 1}
                                </th>
                                <td className="text-center">{makeDate(messageResultInfo.createdAt)}</td>
                                <td className="text-center">{messageResultInfo.memo} ({makeHyphen(messageResultInfo.contactPhoneNumber)})</td>
                                <td className="text-center">{messageResultInfo.contactGroup}</td>
                                <td className="text-center">{messageResultInfo.brokerName}</td>
                                {messageResultInfo.messageStatus === "SUCCESS" ? (
                                    <td className="text-center text-success">발송 성공</td>
                                ) : messageResultInfo.messageStatus === "FAIL" ? (
                                    <td className="text-center text-warning">발송 실패</td>
                                ) : messageResultInfo.messageStatus === "PENDING" ? (
                                    <td className="text-center text-primary">발송 중</td>
                                ) : messageResultInfo.messageStatus === "RESEND" ? (
                                    <td className="text-center text-yellow">재발송</td>
                                ) : (
                                    <td className="text-center">{messageResultInfo.messageStatus}</td>
                                )}
                                <td className="text-center">{messageResultInfo.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>

                {/*modal footer*/}
                <div className="modal-footer">
                    <Button color="primary" type="button" onClick={(e) => setIsInfoModal(false)}>
                        닫기
                    </Button>
                </div>
            </Modal>

            <Modal
                className="modal-dialog-centered"
                isOpen={isContentModal}
            >
                <div className="modal-body">
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setIsContentModal(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                    <b>{message.title}</b>
                    <br/>
                    {message.content != null ? message.content.split('\n').map(line => (
                        <span>{line}<br/></span>
                    )) : null}
                    {messageImages.length !== 0 ? (
                        <Row className="mt-3">
                            {messageImages.map((item, index) => (
                                <div className="col-sm-3" key={index}>
                                    <Image className="d-block w-100 m-1"
                                           src={item}/>
                                </div>
                            ))}
                        </Row>
                    ) : null}
                </div>
            </Modal>

            <Header/>
            {/* Page content */}
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row>
                                    <Col>
                                        <h3 className="mb-0">메시지 발송 결과 목록</h3>
                                    </Col>
                                    <Col>

                                        {/*search*/}
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <Input
                                                    type="select"
                                                    onClick={(e) => setSearchType(e.target.value)}
                                                >
                                                    <option value="">검색 유형</option>
                                                    <option value="SENDER">발신자 번호</option>
                                                    <option value="RECEIVER">수신자 번호</option>
                                                    <option value="MEMO">수신자 메모</option>
                                                    <option value="MESSAGE">메시지 내용</option>
                                                </Input>
                                            </InputGroupAddon>
                                            <Input
                                                className="pl-3"
                                                type="text"
                                                onChange={(e) => setSearchInput(e.target.value)}
                                            />
                                            <InputGroupAddon addonType="append">
                                                <Button
                                                    color="primary"
                                                    type="button"
                                                    onClick={async (e) => {
                                                        searchType === "" ? await Swal.fire({
                                                                title            : "검색 유형을 선택하세요",
                                                                icon             : "warning",
                                                                showConfirmButton: false,
                                                                timer            : 1000
                                                            }) :
                                                            searchInput === "" ? await Swal.fire({
                                                                    title            : "검색 내용을 입력하세요",
                                                                    icon             : "warning",
                                                                    showConfirmButton: false,
                                                                    timer            : 1000
                                                                }) :
                                                                window.location.replace(`/admin/result/sms/${searchType}/${searchInput}/1`)
                                                    }}
                                                >검색
                                                </Button>
                                            </InputGroupAddon>

                                        </InputGroup>
                                    </Col>
                                </Row>
                            </CardHeader>
                            {/*table*/}
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col" className="text-center">No</th>
                                    <th scope="col" className="text-center">발송 일시</th>
                                    <th scope="col" className="text-center">발신자 번호</th>
                                    <th scope="col" className="text-center">내용</th>
                                    <th scope="col" className="text-center">
                                        <UncontrolledDropdown>
                                            <DropdownToggle
                                                nav="true"
                                                type="text"
                                            >
                                                메시지 유형 ▼
                                            </DropdownToggle>

                                            <DropdownMenu aria-labelledby="dropdownMenuButton">
                                                <DropdownItem onClick={(e) => {
                                                    window.location.replace("/admin/result/sms/all/:keyword/1")
                                                }}>
                                                    None
                                                </DropdownItem>

                                                <DropdownItem onClick={(e) => {
                                                    window.location.replace("/admin/result/sms/filter/SMS/1")
                                                }}>
                                                    SMS
                                                </DropdownItem>

                                                <DropdownItem onClick={(e) => {
                                                    window.location.replace("/admin/result/sms/filter/LMS/1")
                                                }}>
                                                    LMS
                                                </DropdownItem>

                                                <DropdownItem onClick={(e) => {
                                                    window.location.replace("/admin/result/sms/filter/MMS/1")
                                                }}>
                                                    MMS
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </th>
                                    <th scope="col" className="text-center">발송 결과</th>
                                </tr>
                                </thead>
                                <tbody>
                                {messageResultList.map((messageResult, index) => (
                                    <tr>
                                        <th scope="row" className="text-center" key={messageResult.messageId}>
                                            {(nowPage - 1) * pageData.size + index + 1}
                                        </th>
                                        <td className="text-center">{makeDate(messageResult.createdAt)}</td>
                                        <td className="text-center">{makeHyphen(messageResult.senderNumber)}</td>
                                        <td style={{textOverflow: "ellipsis", overflow: "hidden", maxWidth: "250px"}}>
                                            <a className="text-dark" href="#" onClick={(e) => {
                                                setIsContentModal(true)
                                                setMessage(messageResult)
                                                getMessageImage(messageResult.messageId)
                                            }}>
                                                <b>{messageResult.title}</b>
                                                &nbsp;
                                                {messageResult.content}
                                            </a>
                                        </td>
                                        <td className="text-center">{messageResult.messageType}</td>
                                        <td className="text-center">
                                            <a href="#">
                                                <i className="fas fa-eye"
                                                   onClick={(e) => {
                                                       setIsInfoModal(true);
                                                       getMessageResultInfo(messageResult.messageId);
                                                   }}/>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>


                            {/*pagination*/}
                            <CardFooter className="py-4">
                                <nav aria-label="...">

                                    <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                    >
                                        {/*prev*/}
                                        <PaginationItem className={pageData.prev ? "active" : "disabled"}>
                                            <PaginationLink
                                                href={`/admin/result/sms/${nowType}/${nowKeyword}/` + (pageData.start - 1).toString()}
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
                                                    href={`/admin/result/sms/${nowType}/${nowKeyword}/` + item}
                                                >
                                                    {item}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        {/*next*/}
                                        <PaginationItem className={pageData.next ? "active" : "disabled"}>
                                            <PaginationLink
                                                href={`/admin/result/sms/${nowType}/${nowKeyword}/` + (pageData.end + 1).toString()}
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

export default MessageResult;
