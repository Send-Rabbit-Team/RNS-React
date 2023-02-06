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
    Col,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import React, {useState} from "react";
import {useParams} from 'react-router-dom';
import axios from "axios";

const MessageReserve = () => {

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

    // 메시지 결과 리스트
    const [reserveList, setReserveList] = useState([])
    const [reserveReceiverList, setReserveReceiverList] = useState([])

    // 모달
    const [isReceiverModal, setIsReceiverModal] = useState(false);
    const [isContentModal, setIsContentModal] = useState(false);

    const [messageContent, setMessageContent] = useState("");

    // 연락처 format 수정 메소드
    const makeHyphen = (number) => {
        return number.slice(0, 3) + "-" + number.slice(3, 7) + "-" + number.slice(7, 11)
    }

    // 날짜 format 수정 메소드
    const makeDate = (date) => {
        return date.split("T")[0] + " " + date.split("T")[1]
    }

    // 예약 메시지 조회
    useState(async () => {
        await axios.get(`/message/result/${nowPage}`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                    setReserveList(response.data.result.dtoList)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    })

    // 예약 메시지 수신자 조회
    const getMessageResultInfo = async (messageId) => {
        await axios.get(`/message/result/info/${messageId}`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setReserveReceiverList(response.data.result.messageResultRes)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // 예약 메시지 취소
    const cancelReservedMessage = async (messageId) => {
        await axios.get(`/message/reserve/${messageId}`)
            .then((response) => {
                if (response.data.isSuccess) {
                    window.alert("메시지 예약이 취소됐습니다.")
                    window.location.reload()
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            {/*수신자 목록 조회 모달*/}
            <Modal
                className="modal-dialog-centered"
                isOpen={isReceiverModal}
                size="xl"
            >
                <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                         예약 발송 수신자 목록
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setIsReceiverModal(false)}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    {/*table*/}
                    <Table className="align-items-center table-flush" responsive>
                        <thead className="thead-light">
                        <tr>
                            <th scope="col" className="text-center">No</th>
                            <th scope="col" className="text-center">수신자 메모</th>
                            <th scope="col" className="text-center">수신자 번호</th>
                            <th scope="col" className="text-center">수신자 그룹</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reserveReceiverList.map((messageResultInfo, index) => (
                            <tr>
                                <th scope="row" className="text-center" key={messageResultInfo.id}>
                                    {index + 1}
                                </th>
                                <td className="text-center">{messageResultInfo.memo}</td>
                                <td className="text-center">{makeHyphen(messageResultInfo.contactPhoneNumber)}</td>
                                <td className="text-center">{messageResultInfo.contactGroup}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
                <div className="modal-footer">
                    <Button color="primary" type="button" onClick={(e) => setIsReceiverModal(false)}>
                        닫기
                    </Button>
                </div>
            </Modal>

            {/*메시지 내용 조회 모달*/}
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
                    {messageContent.split('\n').map( line => (
                        <span>{line}<br/></span>
                    ))}
                </div>
            </Modal>

            <Header/>

            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row>
                                    <Col>
                                        <h3 className="mb-0">메시지 예약 발송 목록</h3>
                                    </Col>
                                </Row>
                            </CardHeader>

                            {/*메시지 예약 발송 목록 테이블*/}
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col" className="text-center">No</th>
                                    <th scope="col" className="text-center">예약 일시</th>
                                    <th scope="col" className="text-center">예약 상태</th>
                                    <th scope="col" className="text-center">발신자 번호</th>
                                    <th scope="col">내용</th>
                                    <th scope="col" className="text-center">메시지 유형</th>
                                    <th scope="col" className="text-center">수신자 목록</th>
                                    <th scope="col" className="text-center">예약 취소</th>
                                </tr>
                                </thead>
                                <tbody>
                                {reserveList.map((message, index) => (
                                    <tr>
                                        <th scope="row" className="text-center" key={message.messageId}>
                                            {(nowPage - 1) * pageData.size + index + 1}
                                        </th>
                                        <td className="text-center">매일 09시 58분</td>
                                        <td className="text-center text-success">발송 완료</td>
                                        <td className="text-center">{makeHyphen(message.senderNumber)}</td>
                                        <td style={{textOverflow:"ellipsis", overflow:"hidden", maxWidth:"250px"}}>
                                            <a className="text-dark" href="#" onClick={(e) => {
                                                setIsContentModal(true)
                                                setMessageContent(message.content)
                                            }}>
                                                {message.content}
                                            </a>
                                        </td>
                                        <td className="text-center">{message.messageType}</td>
                                        <td className="text-center"><a href="#"><i className="fas fa-eye" onClick={(e) => {
                                            setIsReceiverModal(true);
                                            getMessageResultInfo(message.messageId);
                                        }}/></a></td>
                                        <td className="text-center"><a href="#">
                                            <i className="fas fa-history" onClick={(e) => cancelReservedMessage(message.messageId)}/>
                                        </a></td>
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
                                                href={"/admin/reserve/sms/" + (pageData.start - 1).toString()}
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
                                                    href={"/admin/reserve/sms/" + item}
                                                >
                                                    {item}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        {/*next*/}
                                        <PaginationItem className={pageData.next ? "active" : "disabled"}>
                                            <PaginationLink
                                                href={"/admin/reserve/sms/" + (pageData.end + 1).toString()}
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

export default MessageReserve;
