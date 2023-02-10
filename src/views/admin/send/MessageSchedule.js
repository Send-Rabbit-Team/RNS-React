import {Modal, FormGroup, Button, Input, Row, Col } from "reactstrap"
import React, {useEffect, useState} from "react";

const MessageSchedule = (props) => {
    const [checked, setChecked] = useState("");

    const week = [
       'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'
    ]

    const month = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const [dayMin, setDayMin] = useState("30");
    const [dayHour, setDayHour] = useState("10");

    const [weekMin, setWeekMin] = useState("30");
    const [weekHour, setWeekHour] = useState("10");
    const [weekSelect, setWeekSelect] = useState([]);

    const [monthChecked, setMonthChecked] = useState();
    const [monthDay, setMonthDay] = useState("1");
    const [monthPeriod, setMonthPeriod] = useState("1");
    const [monthWeek, setMonthWeek] = useState("MON");
    const [monthNum, setMonthNum] = useState("1");
    const [monthMin, setMonthMin] = useState("30");
    const [monthHour, setMonthHour] = useState("10");

    const [yearChecked, setYearChecked] = useState();
    const [yearMonth, setYearMonth] = useState("1");
    const [yearDay, setYearDay] = useState("1");
    const [yearNum, setYearNum] = useState("1");
    const [yearWeek, setYearWeek] = useState("MON");
    const [yearMin, setYearMin] = useState("30");
    const [yearHour, setYearHour] = useState("10");

    useEffect(() => {
        if (checked === "day") {
            props.setCron("0 " + dayMin + " " + dayHour + " * * ?")
            props.setCronText("매일 " + dayHour + "시 " + dayMin + "분")
        }
        if (checked === "week") {
            props.setCron("0 " + weekMin + " " + weekHour + " ? * " + weekSelect)
            props.setCronText("매주 " + weekSelect + " " + weekHour + "시 " + weekMin + "분")
        }
        if (checked === "month") {
            if (monthChecked === 1) {
                props.setCron("0 " + monthMin + " " + monthHour + " " + monthDay + " 1/" + monthPeriod + " ?")
                props.setCronText("매월 " + monthDay + "일 " + monthHour + "시 " + monthMin + " 분 " + monthPeriod + "개월 마다")
            }
            if (monthChecked === 2) {
                props.setCron("0 " + monthMin + " " + monthHour + " ? 1/" + monthPeriod + " " + monthWeek + "#" + monthNum)
                props.setCronText("매월 " + monthNum + "째주 " + monthWeek + " " + monthHour + "시 " + monthMin + "분 " + monthPeriod + "개월 마다")
            }

        }
        if (checked === "year") {
            if (yearChecked === 1) {
                props.setCron("0 " + yearMin + " " + yearHour + " " + yearDay + " " + yearMonth + " ?")
                props.setCronText("매년 " + yearMonth + "월 " + yearDay + "일 " + yearHour + "시 " + yearMin + "분")
            }
            if (yearChecked === 2) {
                props.setCron("0 " + yearMin + " " + yearHour + " ? " + yearMonth + " " + yearWeek + "#" + yearNum)
                props.setCronText("매년 " + yearMonth + "월 " + yearNum + "째주 " + yearWeek + " " + yearHour + "시 " + yearMin + "분")
            }
        }
    });


    return (
        props.isShowingMessageSchedule?(
        <Modal
            className="modal-dialog-centered"
            size="lg"
            isOpen={true}
        >
            <div className="modal-header">
                <h3 className="modal-title">메시지 예약발송</h3>
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
                {/* -------------------------------- 매일 -------------------------------- */}
                <div className="custom-control custom-radio mb-3">
                    <input
                        defaultChecked={checked === "day" ? true : false}
                        type="radio"
                        id="everyRadio1"
                        name="everyRadio"
                        className="custom-control-input"
                        onClick={(e) => setChecked("day")}
                    />
                    <label className="custom-control-label" htmlFor="everyRadio1">
                        매일
                    </label>
                </div>
                {checked === "day" ? (
                        <div className="ml-5 mr-5 mb-4 mt-4">
                            <FormGroup>
                                <Input
                                    defaultValue={dayHour + ":" + dayMin + ":00"}
                                    type="time"
                                    onChange={(e) => {
                                        setDayMin(e.target.value.split(":")[1])
                                        setDayHour(e.target.value.split(":")[0])
                                    }}
                                ></Input>
                            </FormGroup>
                        </div>
                ) : null}
                {/* -------------------------------------------------------------------------------- */}

                {/* -------------------------------- 매주 -------------------------------- */}
                <div className="custom-control custom-radio mb-3">
                    <input
                        defaultChecked={checked === "week" ? true : false}
                        type="radio"
                        id="everyRadio2"
                        name="everyRadio"
                        className="custom-control-input"
                        onClick={(e) => setChecked("week")}
                    />
                    <label className="custom-control-label" htmlFor="everyRadio2">
                        매주
                    </label>
                </div>
                {checked === "week" ? (
                    <Row className="ml-5 mr-5 mb-4 mt-4">
                        {week.map((item) => (
                            <div className="col-sm-3 mb-4">
                                <div className="custom-control custom-checkbox custom-control-inline">
                                    <input
                                        defaultChecked={weekSelect.includes(item) ? true : false}
                                        id={item}
                                        type="checkbox"
                                        className="custom-control-input"
                                        onChange={(e) =>  {
                                            if (e.target.checked) {
                                                setWeekSelect([item, ...weekSelect])
                                            } else {
                                                setWeekSelect(weekSelect.filter(w => w !== item));
                                            }
                                        }}
                                    />
                                    <label className="custom-control-label" htmlFor={item}>
                                        {item}
                                    </label>
                                </div>
                            </div>
                        ))}

                        <div className="col-sm-12">
                            <FormGroup>
                                <Input
                                    defaultValue={weekHour + ":" + weekMin + ":00"}
                                    id="example-time-input"
                                    type="time"
                                    onChange={(e) => {
                                        setWeekMin(e.target.value.split(":")[1])
                                        setWeekHour(e.target.value.split(":")[0])
                                    }}
                                ></Input>
                            </FormGroup>
                        </div>
                    </Row>

                ) : null}
                {/* -------------------------------------------------------------------------------- */}

                {/* -------------------------------- 매월 -------------------------------- */}
                <div className="custom-control custom-radio mb-3">
                    <input
                        defaultChecked={checked === "month" ? true : false}
                        type="radio"
                        id="everyRadio3"
                        name="everyRadio"
                        className="custom-control-input"
                        onClick={(e) => setChecked("month")}
                    />
                    <label className="custom-control-label" htmlFor="everyRadio3">
                        매월
                    </label>
                </div>
                {checked === "month" ? (
                    <div className="ml-5 mr-5 mb-4 mt-4">
                        <div className="custom-control custom-radio">
                            <input
                                defaultChecked={monthChecked === 1 ? true : false}
                                type="radio"
                                id="monthRadio1"
                                name="monthRadio"
                                className="custom-control-input"
                                onClick={(e) => setMonthChecked(1)}
                            />
                            <label className="custom-control-label" htmlFor="monthRadio1">
                                <Row>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input
                                                defaultValue={monthDay}
                                                max="31"
                                                min="1"
                                                placeholder="일"
                                                type="number"
                                                onChange={(e) => setMonthDay(e.target.value)}
                                            ></Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input defaultValue={monthPeriod} type="select" onChange={(e) => setMonthPeriod(e.target.value)}>
                                                <option value="1">1개월 마다</option>
                                                <option value="2">2개월 마다</option>
                                                <option value="3">3개월 마다</option>
                                                <option value="6">6개월 마다</option>
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input
                                                defaultValue={monthHour + ":" + monthMin + ":00"}
                                                id="example-time-input"
                                                type="time"
                                                onChange={(e) => {
                                                    setMonthMin(e.target.value.split(":")[1])
                                                    setMonthHour(e.target.value.split(":")[0])
                                                }}
                                            ></Input>
                                        </FormGroup>
                                    </div>
                                </Row>
                            </label>
                        </div>
                        <div className="custom-control custom-radio">
                            <input
                                defaultChecked={monthChecked === 2 ? true : false}
                                type="radio"
                                id="monthRadio2"
                                name="monthRadio"
                                className="custom-control-input"
                                onClick={(e) => setMonthChecked(2)}
                            />
                            <label className="custom-control-label" htmlFor="monthRadio2">
                                <Row>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input defaultValue={monthNum} type="select" onChange={(e) => setMonthNum(e.target.value)}>
                                                <option value="1">첫째주</option>
                                                <option value="2">둘째주</option>
                                                <option value="3">셋째주</option>
                                                <option value="4">넷째주</option>
                                                <option value="5">다섯째주</option>
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input defaultValue={monthWeek} type="select" onChange={(e) => setMonthWeek(e.target.value)}>
                                                {week.map((item) => (
                                                    <option value={item}>{item}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input defaultValue={monthPeriod} type="select" onChange={(e) => setMonthPeriod(e.target.value)}>
                                                <option value="1">1개월 마다</option>
                                                <option value="2">2개월 마다</option>
                                                <option value="3">3개월 마다</option>
                                                <option value="6">6개월 마다</option>
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input
                                                defaultValue={monthHour + ":" + monthMin + ":00"}
                                                id="example-time-input"
                                                type="time"
                                                onChange={(e) => {
                                                    setMonthMin(e.target.value.split(":")[1])
                                                    setMonthHour(e.target.value.split(":")[0])
                                                }}
                                            ></Input>
                                        </FormGroup>
                                    </div>
                                </Row>
                            </label>
                        </div>
                    </div>


                ) : null}
                {/* -------------------------------------------------------------------------------- */}

                {/* -------------------------------- 매년 -------------------------------- */}
                <div className="custom-control custom-radio mb-3">
                    <input
                        defaultChecked={checked === "year" ? true : false}
                        type="radio"
                        id="everyRadio4"
                        name="everyRadio"
                        className="custom-control-input"
                        onClick={(e) => setChecked("year")}
                    />
                    <label className="custom-control-label" htmlFor="everyRadio4">
                        매년
                    </label>
                </div>
                {checked === "year" ? (
                    <div className="ml-5 mr-5 mb-4 mt-4">
                        <div className="custom-control custom-radio">
                            <input
                                defaultChecked={yearChecked === 1 ? true : false}
                                type="radio"
                                id="yearRadio1"
                                name="yearRadio"
                                className="custom-control-input"
                                onChange={(e) => setYearChecked(1)}
                            />
                            <label className="custom-control-label" htmlFor="yearRadio1">
                                <Row>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input defaultValue={yearMonth} type="select" onChange={(e) => setYearMonth(e.target.value)}>
                                                {month.map((item, index) => (
                                                    <option value={index+1}>{item}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input
                                                defaultValue={yearDay}
                                                max="31"
                                                min="1"
                                                placeholder="일"
                                                type="number"
                                                onChange={(e) => setYearDay(e.target.value)}
                                            ></Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input
                                                defaultValue={yearHour + ":" + yearMin + ":00"}
                                                id="example-time-input"
                                                type="time"
                                                onChange={(e) => {
                                                    setYearMin(e.target.value.split(":")[1])
                                                    setYearHour(e.target.value.split(":")[0])
                                                }}
                                            ></Input>
                                        </FormGroup>
                                    </div>
                                </Row>
                            </label>
                        </div>
                        <div className="custom-control custom-radio">
                            <input
                                defaultChecked={yearChecked === 2 ? true : false}
                                type="radio"
                                id="yearRadio2"
                                name="yearRadio"
                                className="custom-control-input"
                                onChange={(e) => setYearChecked(2)}
                            />
                            <label className="custom-control-label" htmlFor="yearRadio2">
                                <Row>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input defaultValue={yearMonth} type="select" onChange={(e) => setYearMonth(e.target.value)}>
                                                {month.map((item, index) => (
                                                    <option value={index+1}>{item}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input defaultValue={yearNum} type="select" onChange={(e) => setYearNum(e.target.value)}>
                                                <option value="1">첫째주</option>
                                                <option value="2">둘째주</option>
                                                <option value="3">셋째주</option>
                                                <option value="4">넷째주</option>
                                                <option value="5">다섯째주</option>
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input defaultValue={yearWeek} type="select" onChange={(e) => setYearWeek(e.target.value)}>
                                                {week.map((item) => (
                                                    <option value={item}>{item}</option>
                                                ))}
                                            </Input>
                                        </FormGroup>
                                    </div>
                                    <div className="col-sm">
                                        <FormGroup>
                                            <Input
                                                defaultValue={yearHour + ":" + yearMin + ":00"}
                                                id="example-time-input"
                                                type="time"
                                                onChange={(e) => {
                                                    setYearMin(e.target.value.split(":")[1])
                                                    setYearHour(e.target.value.split(":")[0])
                                                }}
                                            ></Input>
                                        </FormGroup>
                                    </div>
                                </Row>
                            </label>
                        </div>
                    </div>
                ) : null}
                {/* -------------------------------------------------------------------------------- */}

            </div>
            <div className="modal-footer">
                <Button type="button" color="primary" onClick={(e) => {
                    props.hide()
                }}>예약하기</Button>
            </div>
        </Modal>
            ):null
    )

}
export default MessageSchedule
