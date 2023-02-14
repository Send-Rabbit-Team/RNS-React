import {Row, Col, Button, Modal, Input, FormGroup, Label} from "reactstrap";
import React, {useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";

const KakaoMessageRule = (props) => {

    const [kakaoMessageRule, setKakaoMessageRule] = useState([])
    const [isSum, setIsSum] = useState();

    useEffect(() => {
        let sum = 0;
        kakaoMessageRule.map(kmr => {
            sum += parseInt(kmr.kakaoBrokerRate);
        })
        if (sum === 100)
            setIsSum(true)
        else
            setIsSum(false)
    }, [kakaoMessageRule, isSum])

    // 발송 규칙 수정
    const editKakaoMsgRule = async () => {
        await axios.patch('/kakao/msg/rule/edit', kakaoMessageRule)
            .then(async (response) => {
            if (response.data.isSuccess) {
                await Swal.fire({
                    title            : "발송 설정을 변경했습니다",
                    icon             : "success",
                    showConfirmButton: true,
                    timer            : 1000
                })
                props.hide()
            } else {
                await Swal.fire({
                    title            : response.data.message,
                    icon             : "error",
                    showConfirmButton: true,
                    timer            : 1000
                })
            }
        })
            .catch(async (error) => {
                await Swal.fire({
                    title            : "발송 설정 변경에 실패했습니다",
                    icon             : "error",
                    showConfirmButton: true,
                    timer            : 1000
                })
            })
    }

    //발송 규칙 불러오기
    useEffect(async () => {
        await axios.get('/kakao/msg/rule/get')
            .then((response) => {
                if (response.data.isSuccess) {
                    setKakaoMessageRule(response.data.result);
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
                                        )
                                    }}
                                ></Input>
                            </Col>
                            <Col sm="1" className="pl-0">
                                <p>%</p>
                            </Col>
                        </Row>
                    ))}
                </div>

                {isSum ? (
                    <div className="modal-footer">
                        <Button color="primary" onClick={(e) => {editKakaoMsgRule()}}>
                            설정하기
                        </Button>
                    </div>
                ) : (
                    <p className="text-center text-danger">발송 비율의 합이 100이 아닙니다</p>
                )}


            </Modal> : null
    )
};

export default KakaoMessageRule;
