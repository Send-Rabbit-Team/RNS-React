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

const KakaoTemplate = () => {
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

    const [newTitle, setNewTitle] = useState("");
    const [newSubTitle, setNewSubTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newButtonTitle, setNewButtonTitle] = useState("");
    const [newButtonUrl, setNewButtonUrl] = useState("");
    const [newButtonType, setNewButtonType] = useState("");

    let patchTemplateReq = {}

    // 탬플릿 불러오기
    useState(async () => {
        await axios.get(`/kakao/templates/${nowPage}`)
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
        newTitle == "" ?  window.alert("알림톡 제목을 입력하세요") :
            newContent == "" ? window.alert("알림톡 내용을 입력하세요") :
                newButtonType == "" ? window.alert("알림톡 버튼 종류를 선택하세요") :
                    await axios.post("/kakao/template/register", {
                        "title" : newTitle,
                        "subTitle" : newSubTitle,
                        "content" : newContent,
                        "description" : newDescription,
                        "buttonTitle" : newButtonTitle,
                        "buttonUrl" : newButtonUrl,
                        "buttonType" : newButtonType
                    })
                        .then((response) => {
                            if (response.data.isSuccess) {
                                window.alert(response.data.message)
                                window.location.replace("/admin/template/kakao/1")
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
                    "subTitle" : t.subTitle,
                    "content" : t.content,
                    "description" : t.description,
                    "buttonTitle" : t.buttonTitle,
                    "buttonUrl" : t.buttonUrl,
                    "buttonType" : t.buttonType
                }
            }
        })
        patchTemplateReq.title == "" ?  window.alert("알림톡 제목을 입력하세요") :
            patchTemplateReq.content == "" ?  window.alert("알림톡 내용을 입력하세요") :
                patchTemplateReq.buttonType == "" ? window.alert("알림톡 버튼 종류를 선택하세요") :
                    await axios.patch("/kakao/template/edit", patchTemplateReq)
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
            await axios.patch(`/kakao/template/delete/${templateId}`)
                .then((response) => {
                    if (response.data.isSuccess) {
                        window.alert(response.data.message)
                        window.location.replace("/admin/template/kakao/1")
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
        <Row>

            {/*탬플릿 생성*/}
            <div className="col-md-4">
                <Card className="shadow">
                    <CardHeader className="border-0">
                        <h3 className="mb-0">탬플릿 생성</h3>
                    </CardHeader>
                    <div className="m-3">
                        <Card>
                            <CardBody>
                                <button
                                    className="close mb-3"
                                    onClick={(e) => {setNewTitle(""); setNewContent("")}}
                                >
                                    <span aria-hidden={true} style={{fontSize:"25px"}}>×</span>
                                </button>
                                <InputGroup>
                                    <Input
                                        value={newTitle}
                                        className="mb-2"
                                        placeholder="알림톡 제목"
                                        type="text"
                                        onChange={(e) => {setNewTitle(e.target.value)}}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Input
                                        value={newSubTitle}
                                        className="mb-2"
                                        placeholder="알림톡 소제목"
                                        type="text"
                                        onChange={(e) => {setNewSubTitle(e.target.value)}}
                                    />
                                </InputGroup>

                                <Input
                                    value={newContent}
                                    className="mb-2"
                                    placeholder="알림톡 내용"
                                    rows="7"
                                    type="textarea"
                                    onChange={(e) => {setNewContent(e.target.value)}}
                                />
                                <Input
                                    value={newDescription}
                                    placeholder="알림톡 설명"
                                    rows="7"
                                    type="textarea"
                                    onChange={(e) => {setNewDescription(e.target.value)}}
                                />
                            </CardBody>
                            <CardFooter>
                                <InputGroup>
                                    <Input
                                        value={newButtonTitle}
                                        className="mb-2"
                                        placeholder="알림톡 버튼 이름"
                                        type="text"
                                        onChange={(e) => {setNewButtonTitle(e.target.value)}}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Input
                                        value={newButtonUrl}
                                        className="mb-2"
                                        placeholder="알림톡 버튼 링크"
                                        type="text"
                                        onChange={(e) => {setNewButtonUrl(e.target.value)}}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <Input
                                        value={newButtonType}
                                        className="mb-3"
                                        type="select"
                                        onChange={(e) => {setNewButtonType(e.target.value)}}>
                                        <option>알림톡 버튼 종류</option>
                                        <option value="DS">배송 조회</option>
                                        <option value="WL">웹 링크</option>
                                        <option value="AL">앱 링크</option>
                                        <option value="BK">봇 키워드</option>
                                        <option value="MD">메시지 전달</option>
                                        <option value="AC">채널 추가</option>
                                    </Input>
                                </InputGroup>
                                <Button
                                    block
                                    color="primary"
                                    onClick={registerTemplate}
                                >
                                    저장
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                    <CardFooter className="pb-4 mb-3"><br/></CardFooter>
                </Card>
            </div>

            {/*탬플릿 관리*/}
            <div className="col-md-8">
                <Card className="shadow">
                    <CardHeader className="border-0">
                        <h3 className="mb-0">탬플릿 관리</h3>
                    </CardHeader>
                    <Row>
                        {templateList.map((template) => (
                            <div className="col-md-6" key={template.templateId}>
                                <div className="m-3">
                                    <Card>
                                        <CardBody>
                                            <button
                                                className="close mb-3"
                                                onClick={(e) => {deleteTemplate(template.templateId)}}
                                            >
                                                <span aria-hidden={true} style={{fontSize:"25px"}}>×</span>
                                            </button>
                                            <Input
                                                value={template.title}
                                                className="mb-2"
                                                placeholder="알림톡 제목"
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
                                                value={template.subTitle}
                                                className="mb-2"
                                                placeholder="알림톡 소제목"
                                                type="text"
                                                onChange={(e) => {
                                                    setTemplateList(
                                                        templateList.map((t) =>
                                                            t.templateId === template.templateId ? { ...t, subTitle: e.target.value } : t
                                                        )
                                                    );
                                                }}
                                            />
                                            <Input
                                                value={template.content}
                                                className="mb-2"
                                                placeholder="알림톡 내용"
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
                                            <Input
                                                value={template.description}
                                                placeholder="알림톡 설명"
                                                rows="7"
                                                type="textarea"
                                                onChange={(e) => {
                                                    setTemplateList(
                                                        templateList.map((t) =>
                                                            t.templateId === template.templateId ? { ...t, description: e.target.value } : t
                                                        )
                                                    );
                                                }}
                                            />
                                        </CardBody>
                                        <CardFooter>
                                            <Input
                                                value={template.buttonTitle}
                                                className="mb-2"
                                                placeholder="알림톡 버튼 이름"
                                                type="text"
                                                onChange={(e) => {
                                                    setTemplateList(
                                                        templateList.map((t) =>
                                                            t.templateId === template.templateId ? { ...t, buttonTitle: e.target.value } : t
                                                        )
                                                    );
                                                }}
                                            />
                                            <Input
                                                value={template.buttonUrl}
                                                className="mb-2"
                                                placeholder="알림톡 버튼 링크"
                                                type="text"
                                                onChange={(e) => {
                                                    setTemplateList(
                                                        templateList.map((t) =>
                                                            t.templateId === template.templateId ? { ...t, buttonUrl: e.target.value } : t
                                                        )
                                                    );
                                                }}
                                            />
                                            <Input
                                                value={template.buttonType}
                                                className="mb-3"
                                                type="select"
                                                onChange={(e) => {
                                                    setTemplateList(
                                                        templateList.map((t) =>
                                                            t.templateId === template.templateId ? { ...t, buttonType: e.target.value } : t
                                                        )
                                                    );
                                                }}
                                            >
                                                <option>알림톡 버튼 종류</option>
                                                <option value="DS">배송 조회</option>
                                                <option value="WL">웹 링크</option>
                                                <option value="AL">앱 링크</option>
                                                <option value="BK">봇 키워드</option>
                                                <option value="MD">메시지 전달</option>
                                                <option value="AC">채널 추가</option>
                                            </Input>
                                            <Button
                                                block
                                                color="primary"
                                                onClick={(e) => {editTemplate(template.templateId)}}
                                            >
                                                수정
                                            </Button>
                                        </CardFooter>
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
                                        href={"/admin/template/kakao/" + (pageData.start-1).toString()}
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
                                            href={"/admin/template/kakao/" + item}
                                        >
                                            {item}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                {/*next*/}
                                <PaginationItem className={pageData.next ? "active" : "disabled"}>
                                    <PaginationLink
                                        href={"/admin/template/kakao/" + (pageData.end+1).toString()}
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
    )

}
export default KakaoTemplate;
