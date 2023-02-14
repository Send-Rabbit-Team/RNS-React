import {
    Card,
    CardFooter,
    CardHeader,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
    CardBody,
    Button,
    Input,
    InputGroup
} from "reactstrap";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SmsTemplate = () => {
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

    const [templateList, setTemplateList] = useState([]);

    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    let patchTemplateReq = {}

    const calculateByte = (msg) => {
        var l = 0;

        for (var idx = 0; idx < msg.length; idx++) {
            var c = escape(msg.charAt(idx));

            if (c.length == 1) l++;
            else if (c.indexOf("%u") != -1) l += 2;
            else if (c.indexOf("%") != -1) l += c.length / 3;
        }

        return l;
    }

    // 탬플릿 불러오기
    useState(async () => {
        await axios.get(`/templates/${nowPage}`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                    setTemplateList(response.data.result.dtoList)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    })

    // 탬플릿 생성하기
    const registerTemplate = async () => {
        newContent == "" ? await Swal.fire({
                title            : "탬플릿 내용을 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            })
            :
            await axios.post("/template/register", {
                "title"  : newTitle,
                "content": newContent
            })
                .then(async (response) => {
                    if (response.data.isSuccess) {
                        await Swal.fire({
                            title            : "탬플릿을 생성했습니다",
                            icon             : "success",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                        window.location.replace("/admin/template/sms/1")
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
                        title            : "탬플릿 생성에 실패했습니다",
                        icon             : "error",
                        showConfirmButton: false,
                        timer            : 1000
                    })
                })
    }

    // 탬플릿 수정하기
    const editTemplate = async (templateId) => {
        templateList.map((t) => {
            if (t.templateId === templateId) {
                patchTemplateReq = {
                    "templateId": templateId,
                    "title"     : t.title,
                    "content"   : t.content
                }
            }
        })
        patchTemplateReq.content == "" ?
            await Swal.fire({
                title            : "탬플릿 내용을 입력하세요",
                icon             : "warning",
                showConfirmButton: false,
                timer            : 1000
            }) : Swal.fire({
                title            : "탬플릿을 수정하시겠습니까?",
                icon             : "question",
                showDenyButton   : true,
                confirmButtonText: "네",
                denyButtonText   : "아니요",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await axios.patch("/template/edit", patchTemplateReq)
                        .then(async (response) => {
                            if (response.data.isSuccess) {
                                await Swal.fire({
                                    title            : "탬플릿을 수정했습니다",
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
                                title            : "탬플릿 수정에 실패했습니다",
                                icon             : "error",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                        })
                }
            })

    }

    // 탬플릿 삭제하기
    const deleteTemplate = async (templateId) => {
        Swal.fire({
            title            : "탬플릿을 삭제하시겠습니까?",
            text             : "탬플릿 삭제시 복구가 불가능합니다",
            icon             : "question",
            showDenyButton   : true,
            confirmButtonText: "네",
            denyButtonText   : "아니요",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.patch(`/template/delete/${templateId}`)
                    .then(async (response) => {
                        if (response.data.isSuccess) {
                            await Swal.fire({
                                title            : "탬플릿을 삭제했습니다",
                                icon             : "success",
                                showConfirmButton: false,
                                timer            : 1000
                            })
                            window.location.replace("/admin/template/sms/1")
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
                            title            : "탬플릿 삭제에 실패했습니다",
                            icon             : "error",
                            showConfirmButton: false,
                            timer            : 1000
                        })
                    })
            }

        })
    }


    return (
        <Row>
            <div className="col-md-3">
                <Card className="shadow">
                    <CardHeader className="border-0">
                        <h3 className="mb-0">탬플릿 생성</h3>
                    </CardHeader>
                    <div className="m-3">
                        <Card>
                            <CardBody>
                                <button
                                    className="close mb-3"
                                    onClick={(e) => {
                                        setNewTitle("");
                                        setNewContent("")
                                    }}
                                >
                                    <span aria-hidden={true} style={{fontSize: "25px"}}>×</span>
                                </button>
                                <InputGroup>
                                    <Input
                                        value={newTitle}
                                        className="mb-3"
                                        placeholder="탬플릿 제목"
                                        type="text"
                                        onChange={(e) => {
                                            setNewTitle(e.target.value)
                                        }}
                                    />
                                </InputGroup>

                                <Input
                                    value={newContent}
                                    className="mb-1"
                                    placeholder="탬플릿 내용을 입력하세요"
                                    rows="7"
                                    type="textarea"
                                    onChange={(e) => {
                                        setNewContent(e.target.value)
                                    }}
                                />
                                <p align="right">{newContent != null ? calculateByte(newContent) : 0}byte</p>
                                <Button
                                    block
                                    color="primary"
                                    onClick={registerTemplate}
                                >
                                    저장
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                    <CardFooter className="pb-4 mb-3"><br/></CardFooter>
                </Card>
            </div>

            <div className="col-md-9">
                <Card className="shadow">
                    <CardHeader className="border-0">
                        <h3 className="mb-0">탬플릿 관리</h3>
                    </CardHeader>
                    <Row>
                        {templateList.map((template) => (
                            <div className="col-md-4" key={template.templateId}>
                                <div className="m-3">
                                    <Card>
                                        <CardBody>
                                            <button
                                                className="close mb-3"
                                                onClick={(e) => {
                                                    deleteTemplate(template.templateId)
                                                }}
                                            >
                                                <span aria-hidden={true} style={{fontSize: "25px"}}>×</span>
                                            </button>
                                            <Input
                                                value={template.title}
                                                className="mb-3"
                                                placeholder="탬플릿 제목"
                                                type="text"
                                                onChange={(e) => {
                                                    setTemplateList(
                                                        templateList.map((t) =>
                                                            t.templateId === template.templateId ? {
                                                                ...t,
                                                                title: e.target.value
                                                            } : t
                                                        )
                                                    );
                                                }}
                                            />
                                            <Input
                                                value={template.content}
                                                className="mb-1"
                                                placeholder="탬플릿 내용을 입력하세요"
                                                rows="7"
                                                type="textarea"
                                                onChange={(e) => {
                                                    setTemplateList(
                                                        templateList.map((t) =>
                                                            t.templateId === template.templateId ? {
                                                                ...t,
                                                                content: e.target.value
                                                            } : t
                                                        )
                                                    );
                                                }}
                                            />
                                            <p align="right">{calculateByte(template.content)}byte</p>
                                            <Button
                                                block
                                                color="primary"
                                                onClick={(e) => {
                                                    editTemplate(template.templateId)
                                                }}
                                            >
                                                수정
                                            </Button>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </Row>


                    <CardFooter className="py-4">
                        <nav aria-label="...">

                            <Pagination
                                className="pagination justify-content-end mb-0"
                                listClassName="justify-content-end mb-0"
                            >
                                {/*prev*/}
                                <PaginationItem className={pageData.prev ? "active" : "disabled"}>
                                    <PaginationLink
                                        href={"/admin/template/sms/" + (pageData.start - 1).toString()}
                                        tabIndex="-1"
                                    >
                                        <i className="fas fa-angle-left"/>
                                        <span className="sr-only">Previous</span>
                                    </PaginationLink>
                                </PaginationItem>

                                {/*now*/}
                                {pageData.pageList.map(item => (
                                    <PaginationItem className={item == parseInt(nowPage) ? "active" : "inactive"}>
                                        <PaginationLink
                                            href={"/admin/template/sms/" + item}
                                        >
                                            {item}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                {/*next*/}
                                <PaginationItem className={pageData.next ? "active" : "disabled"}>
                                    <PaginationLink
                                        href={"/admin/template/sms/" + (pageData.end + 1).toString()}
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
    )

}
export default SmsTemplate;
