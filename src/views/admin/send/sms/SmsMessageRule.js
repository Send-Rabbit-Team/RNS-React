import {
    Row,
    Col,
    Button,
    Modal, Input, FormGroup,
    Form
} from "reactstrap";
import React, {useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";

const SmsMessageRule = (props) => {

    const [smsKTRate, setSmsKTRate] = useState(33);
    const [smsSKTRate, setSmsSKTRate] = useState(33);
    const [smsLGRate, setSmsLGRate] = useState(34);

    const applySendRule = async (KT, SKT, LG) => {
        await axios.patch(`/msg/rule/edit`, {
            "messageRules": [
                {
                    "brokerId"  : 1,
                    "brokerRate": KT
                },
                {
                    "brokerId"  : 2,
                    "brokerRate": SKT
                },
                {
                    "brokerId"  : 3,
                    "brokerRate": LG
                }
            ]
        }).then(async (response) => {
            if (response.data.isSuccess) {
                await Swal.fire({
                    title            : '발송 설정을 변경했습니다.',
                    icon             : 'success',
                    showConfirmButton: false,
                    timer            : 1000,
                })
                props.hide()
            } else {
                await Swal.fire({
                    title            : response.data.message,
                    icon             : 'error',
                    showConfirmButton: false,
                    timer            : 1000,
                })
                console.log(response.data.message)
            }
        })
            .catch(async (error) => {
                await Swal.fire({
                    title            : '발송 설정을 변경하는데 오류가 발생했습니다.',
                    icon             : 'error',
                    showConfirmButton: false,
                    timer            : 1000,
                })
                console.log(error)
            })
    }

    useEffect(async () => {
        await axios.get(`/msg/rule/getAll`)
            .then((response) => {
                console.log(response)
                if (response.data.isSuccess) {
                    response.data.result.messageRules.map(messageRule => {
                        if (messageRule.brokerId == 1) {
                            setSmsKTRate(messageRule.brokerRate);
                        } else if (messageRule.brokerId == 2) {
                            setSmsLGRate(messageRule.brokerRate)
                        } else {
                            setSmsSKTRate(messageRule.brokerRate);
                        }
                    })
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        props.isShowingMessageRule ?
            <Modal
                className="modal-dialog-centered"
                isOpen={true}
                size="sm"
            >
                <div className="modal-header">
                    <h3 className="modal-title" id="modal-title-default">
                        발송 설정
                    </h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={(e) => props.hide()}
                    ></button>
                    <span aria-hidden={true}>×</span>
                </div>
                <div className="modal-body">
                    <Form>
                        <Row style={{
                            display      : "flex",
                            flexDirection: "column"
                        }}>
                            <Col md="12">
                                <FormGroup style={{display: "flex", alignItems: "flex-end"}}>
                                    {/* KT */}

                                    <p style={{margin: 9, paddingRight: 20, paddingTop: 5, fontSize: 17}}>KT</p>
                                    <Input
                                        style={{marginLeft: "auto", width: "55%"}}
                                        id="KT"
                                        name="KT"
                                        placeholder={smsKTRate}
                                        value={smsKTRate}
                                        type="number"
                                        onChange={(e) => setSmsKTRate(e.target.value)}
                                    />
                                    <p style={{margin: 9, paddingRight: 20, paddingTop: 5, fontSize: 17}}>%</p>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup style={{display: "flex", alignItems: "flex-end"}}>
                                    {/* SKT */}
                                    <p style={{margin: 9, paddingRight: 20, paddingTop: 5, fontSize: 17}}>SKT</p>
                                    <Input
                                        style={{marginLeft: "auto", width: "55%"}}
                                        id="SKT"
                                        name="SKT"
                                        placeholder={smsSKTRate}
                                        value={smsSKTRate}
                                        type="number"
                                        onChange={(e) => setSmsSKTRate(e.target.value)}
                                    />
                                    <p style={{margin: 9, paddingRight: 20, paddingTop: 5, fontSize: 17}}>%</p>
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup style={{display: "flex", alignItems: "flex-end"}}>
                                    {/* LGU+ */}
                                    <p style={{margin: 9, paddingRight: 20, paddingTop: 5, fontSize: 17}}>LG U+</p>
                                    <Input
                                        style={{marginLeft: "auto", width: "55%"}}
                                        id="LGU+"
                                        name="LGU+"
                                        placeholder={smsLGRate}
                                        type="number"
                                        value={smsLGRate}
                                        onChange={(e) => setSmsLGRate(e.target.value)}
                                    />
                                    <p style={{margin: 9, paddingRight: 20, paddingTop: 5, fontSize: 17}}>%</p>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {smsLGRate + smsKTRate + smsSKTRate === 100 ? (
                    <div className="modal-footer">
                        <Button color="primary" type="button"
                                onClick={(e) => {
                                    applySendRule(Number(smsKTRate), Number(smsSKTRate), Number(smsLGRate))
                                }}>
                            설정하기
                        </Button>
                    </div>
                ) : (
                    <p className="text-center text-danger">발송 비율의 합이 100이 아닙니다</p>
                )}


            </Modal> : null
    )

};

export default SmsMessageRule;
