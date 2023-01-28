import {Button, Modal, Card, CardBody, Row, Col, CardHeader, CardFooter} from "reactstrap";
import React, {useState} from "react";
import axios from "axios";

const KakaoTemplateModal = (props) => {
    const [templateList, setTemplateList] = useState([]);

    // 탬플릿 불러오기
    useState(async () => {
        await axios.get('/kakao/templates/all')
            .then((response) => {
                if (response.data.isSuccess) {
                    setTemplateList(response.data.result)
                }
                else {
                    window.alert(response.data.message)
                }
            })
            .catch((error) => {
                window.alert(error.response.data.message)
            })
    })

    return (
        props.isShowingTemplate?(
        <Modal
            className="modal-dialog-centered"
            size="lg"
            isOpen={true}
        >
            <div className="modal-header">
                <h3 className="modal-title">탬플릿 불러오기</h3>
                <button
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={(e) => props.hide()}
                >
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body">
                <Row>
                    {templateList != null ? templateList.map((template) => (
                        <div className="col-lg-6 mb-3">
                            <Button block className="lg p-0" style={{textAlign : "left"}}
                                onClick={(e) => {
                                    props.setMessageTitle(template.title)
                                    props.setMessageSubTitle(template.subTitle)
                                    props.setMessageContext(template.content)
                                    props.setMessageDescription(template.description)
                                    props.setButtonTitle(template.buttonTitle)
                                    props.setButtonUrl(template.buttonUrl)
                                    props.setButtonType(template.buttonType)
                                    props.hide()
                                }}
                            >
                                <Card className="m-0">
                                    <CardHeader className="bg-yellow">알림톡 도착</CardHeader>
                                    <CardBody>
                                        <h2 className="card-title">{template.title}</h2>
                                        <h5 className="card-subtitle mb-2 text-muted">{template.subTitle}</h5>
                                        <br/>
                                        <p className="card-text">{template.content}</p>
                                        <p className="card-text"><small className="text-muted">{template.description}</small></p>
                                    </CardBody>
                                    <CardFooter>
                                        <Button block style={{backgroundColor : "whitesmoke"}}>{template.buttonTitle}</Button>
                                    </CardFooter>
                                </Card>
                            </Button>
                        </div>
                    )) : (<p className="m-3">탬플릿이 없습니다</p>)}

                </Row>
            </div>
        </Modal>
        ):null
    )

}
export default KakaoTemplateModal
