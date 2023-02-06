import {Row, Col, Button, Modal, Input, FormGroup, Label} from "reactstrap";
import React, {useState, useEffect} from "react";
import axios from "axios";

const KakaoMessageRule = (props) => {

    const [kakaoMessageRule, setKakaoMessageRule] = useState([])

    // 발송 규칙 수정
    const editKakaoMsgRule = async () => {
        await axios.patch('/kakao/msg/rule/edit', kakaoMessageRule)
            .then((response) => {
            if (response.data.isSuccess) {
                window.alert('발송 설정을 변경했습니다.')
                window.location.reload()
            } else {
                window.alert('발송 설정을 변경하는데 실패했습니다.')
            }
        })
            .catch((error) => {
                console.log("발송 설정 변경하는데 실패했고, 다른 유형의 에러입니다. ", error)
            })
    }

    //발송 규칙 불러오기
    useEffect(async () => {
        await axios.get('/kakao/msg/rule/get')
            .then((response) => {
                if (response.data.isSuccess) {
                    setKakaoMessageRule(response.data.result);
                }
            })
            .catch((error) => {
                window.alert(error.response.data.message)
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
                    {kakaoMessageRule.map((item) => (
                        <Row className="mb-4" key={item.kakaoMessageRuleId}>
                            <Col sm="3" className="pl-4">
                                <p>{item.kakaoBrokerName}</p>
                            </Col>
                            <Col sm="8">
                                <Input
                                    type="number"
                                    max="100"
                                    defaultValue={item.kakaoBrokerRate}
                                    value={item.kakaoBrokerRate}
                                    onChange={(e) => {
                                        setKakaoMessageRule(
                                            kakaoMessageRule.map((k) =>
                                                k.kakaoMessageRuleId === item.kakaoMessageRuleId ? {...k, kakaoBrokerRate:e.target.value} : k
                                            )
                                        )}}
                                ></Input>
                            </Col>
                            <Col sm="1" className="pl-0">
                                <p>%</p>
                            </Col>
                        </Row>
                    ))}
                </div>


                <div className="modal-footer">
                    <Button color="primary" onClick={(e) => {editKakaoMsgRule()}}>
                        설정하기
                    </Button>
                </div>

            </Modal> : null
    )
};

export default KakaoMessageRule;
