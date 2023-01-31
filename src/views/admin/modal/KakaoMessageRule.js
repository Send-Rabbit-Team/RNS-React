import {
    Row,
    Col,
    Button,
    Modal, Input, FormGroup,
  Form
  } from "reactstrap";
  import React, {useState,useEffect} from "react";
  import axios from "axios";

  const KakaoMessageRule = (props) =>{

    const [kakaoCNSRate, setKakaoCNSRate] = useState(50);
    const [kakaoKERate, setKakaoKERate] = useState(50);

    const applySendRule= async(CNS, KE)=>{
        await axios.patch(`/msg/rule/edit`,{
            "messageRules":[
                {
                    "brokerId":1,
                    "brokerRate":CNS
                },
                {
                    "brokerId":2,
                    "brokerRate":KE
                },
            ]
        }).then((response) => {
          if (response.data.isSuccess) {
            window.alert('발송 설정을 변경했습니다.')
            window.location.reload()
          } else {
            window.alert('발송 설정을 변경하는데 실패했습니다.')
          }
        })
        .catch((error) => {
          console.log("발송 설정 변경하는데 실패했고, 다른 유형의 에러입니다. ",error)
          // window.location.reload()
        })
      }

      useEffect(async()=>{
        await axios.get(`/msg/rule/getAll`)
        .then((response) => {
          if (response.data.isSuccess) {
            response.data.result.map(messageRule=>{
              if(messageRule.brokerId == 1){
                setKakaoCNSRate(messageRule.brokerRate);
              } else {
                setKakaoKERate(messageRule.brokerRate)
              }
            })
          } else {
            window.alert(response.data.message)
          }
        })
        .catch((error) => {
          window.alert(error.response.data.message)
        })
      },[])

    return(
    props.isShowingMessageRule?
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
                  display: "flex",
                  flexDirection: "column"
                }}>

            <Col md="12" >
              <FormGroup style={{display: "flex", alignItems:"flex-end"}}>
                {/* CNS */}

                <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>KT</p>
                <Input
                  style={{ marginLeft: "auto" , width:"55%"}}
                  placeholder={kakaoCNSRate}
                  value={kakaoCNSRate}
                  type="number"
                  onChange={(e)=> setKakaoCNSRate(e.target.value)}
                />
                 <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>%</p>
                </FormGroup>
            </Col>

            <Col md="12">
                <FormGroup style={{display: "flex", alignItems:"flex-end"}}>
                  {/* KE */}
                  <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>SKT</p>
                  <Input
                   style={{ marginLeft: "auto" , width:"55%"}}
                    placeholder={kakaoKERate}
                    value={kakaoKERate}
                    type="number"
                    onChange={(e)=> setKakaoKERate(e.target.value)}
                  />
                   <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>%</p>
                </FormGroup>
            </Col>

            </Row>

            {(Number(kakaoCNSRate)+Number(kakaoKERate) != 100) ? <p className="text-warning" style={{fontWeight: 'bold'}}>(중계사 비율의 합이 100%가 아닙니다.)</p>:null}
            <Button color="secondary" size="sm" type="button" style={{ width:150, height: 30, fontSize:13,float: "right", paddingTop:2}} onClick={(e)=>{applySendRule(Number(kakaoCNSRate), Number(kakaoKERate))}}>
              완료
            </Button>
          </Form>
          </div>
      </Modal>:null
    )

  };

  export default KakaoMessageRule;
