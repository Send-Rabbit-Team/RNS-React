import {Button, Modal, Card, CardBody, Row, CardTitle} from "reactstrap";
import React, {useEffect, useState} from "react";
import axios from "axios";


const SmsTemplateModal = (props) => {
    const [templateList, setTemplateList] = useState([]);

    // 탬플릿 불러오기
    useEffect(async () => {
        await axios.get('/templates/all')
            .then((response) => {
                if (response.data.isSuccess) {
                    console.log(response.data.result)
                    setTemplateList(response.data.result)
                }
                else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error.response.data.message)
            })
    }, [])

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
                            <Button block className="lg p-0"
                                onClick={(e) => {
                                    props.setSelectTemplateTitle(template.title);
                                    props.setSelectTemplateContent(template.content);
                                    props.hide()}}
                            >
                                <Card>
                                    <CardBody className="text-left">
                                        <CardTitle>{template.title}</CardTitle>
                                        {template.content.split('\n').map( line => (
                                            <span style={{fontWeight : "normal"}}>{line}<br/></span>
                                        ))}
                                    </CardBody>
                                </Card>
                            </Button>
                        </div>
                    )) : null }

                </Row>
            </div>
        </Modal>
        ):null
    )

}
export default SmsTemplateModal
