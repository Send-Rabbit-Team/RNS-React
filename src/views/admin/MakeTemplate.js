import Header from "../../components/Headers/Header";
import {
    Card,
    CardFooter,
    CardHeader,
    Container,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
    CardBody,
    Button,
    Input,
    Form,
    UncontrolledDropdown,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
    FormGroup,
    InputGroup
} from "reactstrap";
import React, {useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

const MakeTemplate = () => {
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

    const [templateList, setTemplateList] = useState([]);

    const [newTitle, setNewTitle] = useState();
    const [newContent, setNewContent] = useState("");
    const [newTemplateType, setNewTemplateType] = useState("SMS");

    let patchTemplateReq = {}

    // 탬플릿 불러오기
    useState(async () => {
        await axios.get(`/templates/${nowPage}`)
            .then((response) => {
                if (response.data.isSuccess) {
                    setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
                    setTemplateList(response.data.result.dtoList)
                } else {
                    window.alert(response.data.message)
                }
            })
            .catch((error) => {
                window.alert(error.response.data.message)
            })
    })

    // 탬플릿 생성하기
    const registerTemplate = async () => {
        newTitle == "" ?  window.alert("탬플릿 제목을 입력하세요") :
            newContent == "" ? window.alert("탬플릿 내용을 입력하세요") :
                await axios.post("/template/register", {
                    "title" : newTitle,
                    "content" : newContent,
                    "templateType" : newTemplateType
                })
                    .then((response) => {
                        if (response.data.isSuccess) {
                            window.alert(response.data.message)
                            window.location.replace("/admin/template/1")
                        } else {
                            window.alert(response.data.message)
                        }
                    })
                    .catch((error) => {
                        window.alert(error.response.data.message)
                    })
    }

    // 탬플릿 수정하기
    const editTemplate = async (templateId) => {
        templateList.map((t) => {
            if (t.templateId === templateId) {
                patchTemplateReq = {
                    "templateId" : templateId,
                    "title" : t.title,
                    "content" : t.content,
                    "templateType" : t.templateType
                }
            }
        })
        patchTemplateReq.title == "" ?  window.alert("탬플릿 제목을 입력하세요") :
            patchTemplateReq.content == "" ?  window.alert("탬플릿 내용을 입력하세요") :
                await axios.patch("/template/edit", patchTemplateReq)
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

    // 탬플릿 삭제하기
    const deleteTemplate = async (templateId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            await axios.patch(`/template/delete/${templateId}`)
                .then((response) => {
                    if (response.data.isSuccess) {
                        window.alert(response.data.message)
                        window.location.replace("/admin/template/1")
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
            <Header />
            {/* Page content */}
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col-md-3">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">탬플릿 생성</h3>
                            </CardHeader>
                            <div className="m-3">
                                <Card>
                                    <CardBody>
                                        <UncontrolledDropdown className="mb-3">
                                            <DropdownToggle
                                                caret
                                                outline
                                                color="secondary"
                                                type="button"
                                                size="sm"
                                            >
                                                {newTemplateType == "SMS" ? "문자" : "알림톡"}
                                            </DropdownToggle>

                                            <DropdownMenu aria-labelledby="dropdownMenuButton">
                                                <DropdownItem onClick={(e) => setNewTemplateType("SMS")}>
                                                    문자
                                                </DropdownItem>

                                                <DropdownItem onClick={(e) => setNewTemplateType("KAKAO")}>
                                                    알림톡
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                        <button
                                            className="close mb-3"
                                            onClick={(e) => {setNewTitle(""); setNewContent("")}}
                                        >
                                            <span aria-hidden={true} style={{fontSize:"25px"}}>×</span>
                                        </button>
                                        <InputGroup>
                                            <Input
                                                value={newTitle}
                                                className="mb-3"
                                                placeholder="탬플릿 제목"
                                                type="text"
                                                onChange={(e) => {setNewTitle(e.target.value)}}
                                            />
                                        </InputGroup>

                                        <Input
                                            value={newContent}
                                            className="mb-1"
                                            placeholder="탬플릿 내용을 입력하세요"
                                            rows="7"
                                            type="textarea"
                                            onChange={(e) => {setNewContent(e.target.value)}}
                                        />
                                        <p align="right">{newContent != null ? newContent.length * 2 : 0}자</p>
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
                                                    <UncontrolledDropdown className="mb-3">
                                                        <DropdownToggle
                                                            caret
                                                            outline
                                                            color="secondary"
                                                            type="button"
                                                            size="sm"
                                                        >
                                                            {template.templateType == "SMS" ? "문자" : "알림톡"}
                                                        </DropdownToggle>

                                                        <DropdownMenu aria-labelledby="dropdownMenuButton">
                                                            <DropdownItem onClick={(e) =>
                                                                setTemplateList(
                                                                    templateList.map((t) =>
                                                                        t.templateId === template.templateId ? { ...t, templateType: "SMS" } : t
                                                                    )
                                                                )
                                                            }>
                                                                문자
                                                            </DropdownItem>

                                                            <DropdownItem onClick={(e) =>
                                                                setTemplateList(
                                                                    templateList.map((t) =>
                                                                        t.templateId === template.templateId ? { ...t, templateType: "KAKAO" } : t
                                                                    )
                                                                )
                                                            }>
                                                                알림톡
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                    <button
                                                        className="close mb-3"
                                                        onClick={(e) => {deleteTemplate(template.templateId)}}
                                                    >
                                                        <span aria-hidden={true} style={{fontSize:"25px"}}>×</span>
                                                    </button>
                                                    <Input
                                                        value={template.title}
                                                        className="mb-3"
                                                        placeholder="탬플릿 제목"
                                                        type="text"
                                                        onChange={(e) => {
                                                            setTemplateList(
                                                                templateList.map((t) =>
                                                                    t.templateId === template.templateId ? { ...t, title: e.target.value } : t
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
                                                                    t.templateId === template.templateId ? { ...t, content: e.target.value } : t
                                                                )
                                                            );
                                                        }}
                                                    />
                                                    <p align="right">{template.content.length * 2}자</p>
                                                    <Button
                                                        block
                                                        color="primary"
                                                        onClick={(e) => {editTemplate(template.templateId)}}
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
                                                href={"/admin/template/" + (pageData.start-1).toString()}
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
                                                    href={"/admin/template/" + item}
                                                >
                                                    {item}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        {/*next*/}
                                        <PaginationItem className={pageData.next ? "active" : "disabled"}>
                                            <PaginationLink
                                                href={"/admin/template/" + (pageData.end+1).toString()}
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
    )

}
export default MakeTemplate;
