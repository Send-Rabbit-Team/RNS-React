import {
    Row,
    Col,
    Button,
    Modal, Input, FormGroup,
  Form
  } from "reactstrap";
  import React, {useState,useEffect} from "react";
  import axios from "axios";

  const MessageRule = (props) =>{
    
    const [smsKTRate, setSmsKTRate] = useState(33);
    const [smsSKTRate, setSmsSKTRate] = useState(33);
    const [smsLGRate, setSmsLGRate] = useState(34);

    const applySendRule= async(KT,SKT,LG)=>{
        await axios.patch(`/msg/rule/edit`,{
            "messageRules":[
                {
                    "brokerId":1,
                    "brokerRate":KT
                },
                {
                    "brokerId":2,
                    "brokerRate":SKT
                },
                {
                    "brokerId":3,
                    "brokerRate":LG
                }
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
                setSmsKTRate(messageRule.brokerRate);
              } else if(messageRule.brokerId == 2){
                setSmsLGRate(messageRule.brokerRate)
              } else{
                setSmsSKTRate(messageRule.brokerRate);
              }
            })
          } else {
            // 에러핸들링
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
                {/* KT */}
                
                <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>KT</p>
                <Input
                  style={{ marginLeft: "auto" , width:"55%"}}
                  id="KT"
                  name="KT"
                  placeholder={smsKTRate}
                  value={smsKTRate}
                  type="number"
                  onChange={(e)=> setSmsKTRate(e.target.value)}
                />
                 <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>%</p>
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup style={{display: "flex", alignItems:"flex-end"}}>
                  {/* SKT */}
                  <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>SKT</p>
                  <Input
                   style={{ marginLeft: "auto" , width:"55%"}}
                    id="SKT"
                    name="SKT"
                    placeholder={smsSKTRate}
                    value={smsSKTRate}
                    type="number"
                    onChange={(e)=> setSmsSKTRate(e.target.value)}
                  />
                   <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>%</p>
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup style={{display: "flex", alignItems:"flex-end"}}>
                {/* LGU+ */}
                <p style={{margin:9,paddingRight:20, paddingTop:5, fontSize:17}}>LG U+</p>
                <Input
                style={{ marginLeft: "auto" , width:"55%"}}
                  id="LGU+"
                  name="LGU+"
                  placeholder={smsLGRate}
                  type="number" 
                  value={smsLGRate}
                  onChange={(e)=> setSmsLGRate(e.target.value)}
                />
                 <p style={{margin:9, paddingRight:20, paddingTop:5, fontSize:17}}>%</p>
              </FormGroup>
            </Col>
            </Row>

            {(Number(smsKTRate)+Number(smsSKTRate)+Number(smsLGRate)) != 100 ?<p className="text-warning" style={{fontWeight: 'bold'}}>(중계사 비율의 합이 100%가 아닙니다.)</p>:null}
            <Button color="secondary" size="sm" type="button" style={{ width:150, height: 30, fontSize:13,float: "right", paddingTop:2}} onClick={(e)=>{applySendRule(Number(smsKTRate), Number(smsSKTRate),Number(smsLGRate))}}>
              완료
            </Button>
          </Form>
          </div>
      </Modal>:null
    )
    
  };

  export default MessageRule;