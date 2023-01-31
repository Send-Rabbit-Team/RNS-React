import {Modal, Form, Button, Row, Card, CardBody, CardImg} from "reactstrap"
import React from "react";

const ImageUpload = (props) => {
    const handleChangeFile = (event) => {
        if (event.target.files[0]) {
            let reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
            reader.onloadend = () => {
                // 2. 읽기가 완료되면 아래코드가 실행됩니다.
                const base64 = reader.result;
                if (base64) {
                    var base64Sub = base64.toString()
                    props.setSelectImage(base64Sub);
                }
            }
        }

    }

    return (
        props.isShowingImageUpload?(
        <Modal
            className="modal-dialog-centered"
            size="lg"
            isOpen={true}
        >
            <div className="modal-header">
                <h3 className="modal-title">이미지 첨부하기</h3>
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
                <Form>
                    <div className="custom-file m-1">
                        <input
                            accept="image/*"
                            className=" custom-file-input"
                            type="file"
                            onChange={handleChangeFile}
                        ></input>
                        <label className=" custom-file-label">
                            Select file
                        </label>
                    </div>
                </Form>
                <Row className="mt-3">
                    {props.selectImage ? (
                        <div className="col-sm-3">
                            <Card className="m-1">
                                <CardBody className="p-2">
                                    <button
                                        className="close mb-1"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={props.removeSelectImage}
                                    >
                                        <span aria-hidden={true}>×</span>
                                    </button>
                                    <CardImg
                                        className="d-block w-100"
                                        src={props.selectImage}/>
                                </CardBody>
                            </Card>
                        </div>
                    ) : null}

                </Row>
            </div>
            <div className="modal-footer">
                <Button type="button" color="primary" onClick={(e) => {
                    props.hide()
                }}>첨부하기</Button>
            </div>
        </Modal>
            ):null
    )

}
export default ImageUpload
