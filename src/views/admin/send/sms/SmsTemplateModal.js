import {Button, Modal, Card, CardBody, Row, Col, CardHeader, CardFooter} from "reactstrap";
import React, {useState} from "react";
import axios from "axios";


const SmsTemplateModal = (props) => {
    const [templateList, setTemplateList] = useState([]);

    // 탬플릿 불러오기
    useState(async () => {
        await axios.get('/templates/all')
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
                        <div className="col-sm-4 mb-3">
                            <h4>{template.title}</h4>
                            <Button block outline className="lg" color="default" style={{textAlign : "left"}}
                                onClick={(e) => {props.setSelectTemplate(template.content); props.hide()}}
                            >
                                {template.content.split('\n').map( line => (
                                    <span>{line}<br/></span>
                                ))}
                                {/*<p>{template.content.map()}</p>*/}
                            </Button>
                        </div>
                    )) : (<p className="m-3">템플릿이 없습니다</p>)}

                </Row>
            </div>
        </Modal>
        ):null
    )

}
export default SmsTemplateModal
