import {Modal, Form, Button, Row, Card, CardBody, CardHeader, CardImg} from "reactstrap"
import React, {useState} from "react";
import {forEach} from "react-bootstrap/ElementChildren";

const ImageUpload = (props) => {
    const [imgFile, setImgFile] = useState(null);	//파일
    const [imgBase64, setImgBase64] = useState([]); // 파일 base64

    const handleChangeFile = (event) => {
        setImgFile(event.target.files);
        for (var i = 0; i < event.target.files.length; i++) {
            if (event.target.files[i]) {
                let reader = new FileReader();
                reader.readAsDataURL(event.target.files[i]); // 1. 파일을 읽어 버퍼에 저장합니다.
                reader.onloadend = () => {
                    // 2. 읽기가 완료되면 아래코드가 실행됩니다.
                    const base64 = reader.result;
                    if (base64) {
                        var base64Sub = base64.toString()
                        setImgBase64(imgBase64 => [...imgBase64, base64Sub]);
                    }
                }
            }
        }
    }

    const removeFile = (item) => {
        setImgBase64(imgBase64.filter(e => e !== item));
    };

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
                            multiple
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
                    {imgBase64.map((item, index) => (
                        <div className="col-sm-3" key={index}>
                            <Card className="m-1">
                                <CardBody className="p-2">
                                    <button
                                        className="close mb-1"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={(e) => removeFile(item)}
                                    >
                                        <span aria-hidden={true}>×</span>
                                    </button>
                                    <CardImg
                                        className="d-block w-100"
                                        src={item}/>
                                </CardBody>
                            </Card>
                        </div>
                    ))}
                </Row>
            </div>
            <div className="modal-footer">
                <Button type="button" color="primary" onClick={(e) => {
                    props.setSelectImage(imgBase64)
                    props.hide()
                }}>첨부하기</Button>
            </div>
        </Modal>
            ):null
    )

}
export default ImageUpload
