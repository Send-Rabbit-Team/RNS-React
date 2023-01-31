import {Row, Col, Button, Modal, Input, FormGroup, Label} from "reactstrap";
import React, {useState, useEffect} from "react";
import axios from "axios";

const KakaoMessageRule = (props) => {

    const [kakaoCNSId, setKakaoCNSId] = useState();
    const [kakaoKEId, setKakaoKEId] = useState();

    const [kakaoCNSRate, setKakaoCNSRate] = useState();
    const [kakaoKERate, setKakaoKERate] = useState();


    // 발송 규칙 생성
    const createKakaoMsgRule = async () => {
        await axios.post('/kakao/msg/rule/create',
            [
                {
                    "kakaoBrokerId"  : 1,
                    "kakaoBrokerName": "CNS",
                    "kakaoBrokerRate": kakaoCNSRate
                },
                {
                    "kakaoBrokerId"  : 2,
                    "kakaoBrokerName": "KE",
                    "kakaoBrokerRate": kakaoKERate
                },
            ]
        ).then((response) => {
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

    // 발송 규칙 수정
    const editKakaoMsgRule = async () => {
        await axios.patch('/kakao/msg/rule/edit',
            [{
                "kakaoMessageRuleId": kakaoCNSId,
                "kakaoBrokerId"     : 1,
                "kakaoBrokerName"   : "CNS",
                "kakaoBrokerRate"   : kakaoCNSRate
            },
                {
                    "kakaoMessageRuleId": kakaoKEId,
                    "kakaoBrokerId"     : 2,
                    "kakaoBrokerName"   : "KE",
                    "kakaoBrokerRate"   : kakaoKERate
                },
            ]
        ).then((response) => {
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
                    response.data.result.map(messageRule => {
                        if (messageRule.kakaoBrokerId == 1) {
                            setKakaoCNSId(messageRule.kakaoMessageRuleId)
                            setKakaoCNSRate(messageRule.kakaoBrokerRate);
                        } else {
                            setKakaoKEId(messageRule.kakaoMessageRuleId)
                            setKakaoKERate(messageRule.kakaoBrokerRate)
                        }
                    })
                } else {
                    setKakaoCNSRate(50);
                    setKakaoKERate(50);
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
                    <Row className="mb-4">
                        <Col sm="3">
                            <p>LG CNS</p>
                        </Col>
                        <Col sm="8">
                            <Input
                                type="number"
                                max="100"
                                defaultValue={kakaoCNSRate}
                                value={kakaoCNSRate}
                                onChange={(e) => setKakaoCNSRate(e.target.value)}
                            ></Input>
                        </Col>
                        <Col sm="1" className="pl-0">
                            <p>%</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="3">
                            <p>Kakao Enterprise</p>
                        </Col>
                        <Col sm="8">
                            <Input
                                type="number"
                                max="100"
                                defaultValue={kakaoKERate}
                                value={kakaoKERate}
                                onChange={(e) => setKakaoKERate(e.target.value)}
                            ></Input>
                        </Col>
                        <Col sm="1" className="pl-0">
                            <p>%</p>
                        </Col>
                    </Row>
                </div>

                    {(Number(kakaoCNSRate) + Number(kakaoKERate) != 100) ? (
                            <p className="text-warning mb-5" style={{fontWeight : 'bold'}} align="center">
                                중계사 비율의 합이 100%가 아닙니다.
                            </p>
                    ) : (
                        <div className="modal-footer">
                            <Button color="primary" onClick={(e) => {
                                kakaoCNSId && kakaoKEId ? editKakaoMsgRule() : createKakaoMsgRule()
                            }}>
                                설정하기
                            </Button>
                        </div>
                    )}

            </Modal> : null
    )
};

export default KakaoMessageRule;
