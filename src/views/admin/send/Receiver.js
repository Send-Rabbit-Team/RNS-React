import {
    Card,
    CardHeader,
    Row,
    Button,
    Modal,
    Input,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Badge,
    CardBody,
    Table
} from "reactstrap";
import React, {useState, useEffect} from "react";
import axios from "axios";

const Receiver = ({
                      isShowingReceiver,
                      hide,
                      selectContactList,
                      selectContactGroupList,
                      setSelectContactGroupList,
                      setSelectContactList
                  }) => {

    // 검색 키워드
    const [searchContactInput, setSearchContactInput] = useState();
    const [searchContactGroupInput, setSearchContactGroupInput] = useState();

    // 검색 유무
    const [contactFilter, setContactFilter] = useState(false);
    const [contactGroupFilter, setContactGroupFilter] = useState(false);

    // 전체 연락처 및 연락처 그룹
    const [contactList, setContactList] = useState([])
    const [contactGroupList, setContactGroupList] = useState([])

    // 화면에 보여줄 연락처 및 연락처 그룹
    const [nowContactList, setNowContactList] = useState([]);
    const [nowContactGroupList, setNowContactGroupList] = useState([]);


    // 함수
    const makeHyphen = (number) => {
        return number.slice(0, 3) + "-" +
            number.slice(3, 7) + "-" +
            number.slice(7, 11)
    }


    // 연락처 검색
    const searchContact = contactList.filter((p) => {
        return p.phoneNumber.includes(searchContactInput)
    })

    // 연락처 그룹 검색
    const searchContactGroup = contactGroupList.filter((p) => {
        return p.name.includes(searchContactGroupInput)
    })


    // 검색 유무에 따라 화면에 보여질 목록 선택
    useEffect(() => {
        if (contactGroupFilter)
            setNowContactGroupList(searchContactGroup)
        else
            setNowContactGroupList(contactGroupList)
    }, [contactGroupList, searchContactGroupInput])

    useEffect(() => {
        if (contactFilter)
            setNowContactList(searchContact)
        else
            setNowContactList(contactList)
    }, [contactList, searchContactInput])


    // 연락처 검색 핸들러
    const searchContactController = (value) => {
        if (value.length == 0 && contactFilter == true) {
            setContactFilter(false)
        } else if (value.length != 0 && contactFilter == false) {
            setContactFilter(true)
            setSearchContactInput(value)
        }
        if (contactFilter == true) {
            setSearchContactInput(value)
        }
    }

    // 연락처 그룹 검색 핸들러
    const searchContactGroupController = (value) => {
        if (value.length == 0 && contactGroupFilter == true) {
            setContactGroupFilter(false)
        } else if (value.length != 0 && contactGroupFilter == false) {
            setContactGroupFilter(true)
            setSearchContactGroupInput(value)
        }
        if (contactGroupFilter == true) {
            setSearchContactGroupInput(value)
        }
    }


    const isFoundContact = (contact) => selectContactList.some(existContact => {
        if (existContact.id == contact) {
            return true;
        }
        return false;
    });

    const isFoundContactGroup = (contactGroup) => selectContactGroupList.some(existContacGroup => {
        if (existContacGroup.id == contactGroup) {
            return true;
        }
        return false;
    });


    // 연락처 선택 및 해제 핸들러
    const onSelectContactHandler = (value) => {
        setSelectContactList([...selectContactList, value]);
        contactGroupList.map((contactGroup) => {
            if (value.groupId === contactGroup.id && !selectContactGroupList.includes(contactGroup))
                setSelectContactGroupList([...selectContactGroupList, contactGroup])
        })
    }
    const onDeleteContactHandler = (v) => {
        setSelectContactList(selectContactList.filter((item) => item.id !== v.id));
    }

    // 그룹에 포함된 연락처 선택 및 선택 해제 핸들러
    const onSelectGroupContactHandler = (value) => {
        contactList.map((contact) => {
            if (contact.groupId === value.id) {
                setSelectContactList(selectContactList => [...selectContactList, contact])
            }
        })
    }
    const onDeleteGroupContactHandler = (v) => {
        const newContactList = selectContactList.filter((item) => item.groupId !== v.id);
        setSelectContactList(newContactList)
    }

    // 그룹 선택 및 해제 핸들러
    const onSelectContactGroupHandler = (value) => {
        setSelectContactGroupList([...selectContactGroupList, value])
    }
    const onDeleteContactGroupHandler = (v) => {
        setSelectContactGroupList(selectContactGroupList.filter((item) => item.id !== v.id));
    }


    // 연락처 불러오기
    useEffect(async () => {
        await axios.get(`/contact/list`)
            .then((response) => {
                if (response.data.isSuccess) {
                    console.log(response.data.result.contacts)
                    setContactList(response.data.result.contacts)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    // 그룹 불러오기
    useEffect(async () => {
        await axios.get(`/group/getAll`)
            .then((response) => {
                if (response.data.isSuccess) {
                    console.log(response.data.result)
                    setContactGroupList(response.data.result)
                } else {
                    console.log(response.data.message)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])


    return (
        isShowingReceiver ?
            <Modal
                className="modal-dialog-centered"
                isOpen={true}
                size="xl"
            >
                <div className="modal-header">
                    <h3 className="modal-title">수신자 추가하기</h3>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={(e) => hide(false)}
                    ></button>
                    <span aria-hidden={true}>×</span>
                </div>


                <Row>
                    {/* 연락처 목록 */}
                    <div className="col-lg-7">
                        <Card className="shadow m-3">
                            <CardHeader>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-zoom-split-in"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="연락처 검색하기"
                                        type="text"
                                        onChange={(e) => {
                                            searchContactController(e.target.value)
                                        }}
                                    />
                                </InputGroup>
                            </CardHeader>
                            <CardBody className="p-0" style={{height: 300, overflow: "auto"}}>
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th className="text-center">메모</th>
                                        <th className="text-center">전화번호</th>
                                        <th className="text-center">그룹</th>
                                        <th className="text-center">추가</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {nowContactList.map((contactNumber, index) => (
                                        <tr>
                                            <td className="text-center">{contactNumber.memo}</td>
                                            <td className="text-center">{makeHyphen(contactNumber.phoneNumber)}</td>
                                            <td className="text-center">{contactNumber.groupName}</td>
                                            {isFoundContact(contactNumber.id) == false ?
                                                <td className="text-center">
                                                    <a href="#"><i className="fas fa-plus"
                                                                   onClick={(e) => onSelectContactHandler(contactNumber)}/></a>
                                                </td>
                                                :
                                                <td className="text-center">
                                                    <a href="#"><i className="fas fa-minus text-red"
                                                                   onClick={(e) => onDeleteContactHandler(contactNumber)}/></a>
                                                </td>
                                            }
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </div>


                    {/* 그룹 목록 */}
                    <div className="col-lg-5">
                        <Card className="shadow m-3">
                            <CardHeader>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-zoom-split-in"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="그룹 검색하기"
                                        type="text"
                                        onChange={(e) => {
                                            searchContactGroupController(e.target.value)
                                        }}
                                    />
                                </InputGroup>
                            </CardHeader>
                            <CardBody className="p-0" style={{height: 300, overflow: "auto"}}>
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th className="text-center">그룹</th>
                                        <th className="text-center">추가</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {nowContactGroupList.map((contactGroup) => (
                                        <tr>
                                            <td className="text-center">{contactGroup.name}</td>
                                            {
                                                isFoundContactGroup(contactGroup.id) == false ?
                                                    <td className="text-center">
                                                        <a href="#"><i className="fas fa-plus" onClick={(e) => {
                                                            onSelectContactGroupHandler(contactGroup)
                                                            onSelectGroupContactHandler(contactGroup)
                                                        }}/></a>
                                                    </td> :
                                                    <td className="text-center">
                                                        <a href="#"><i className="fas fa-minus text-red"
                                                                       onClick={(e) => {
                                                                           onDeleteContactGroupHandler(contactGroup)
                                                                           onDeleteGroupContactHandler(contactGroup)
                                                                       }}/></a>
                                                    </td>
                                            }
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </div>


                    {/* 선택 목록 */}
                    <div className="col-lg-12">
                        <Card className="shadow m-3">
                            <CardHeader><h4>수신자 목록</h4></CardHeader>
                            <CardBody style={{height:200, overflow:"auto"}}>
                                {selectContactList.map(selectContact => (
                                    selectContact.groupId === 0 ? (
                                        <Button color="primary" type="button" className="m-1" size="sm"
                                                onClick={(e) => onDeleteContactHandler(selectContact)}>
                                            {selectContact.memo} ({makeHyphen(selectContact.phoneNumber)})
                                            <Badge className="badge-black" color="black">X</Badge>
                                        </Button>
                                    ) : null
                                ))}
                            </CardBody>
                        </Card>

                        {selectContactGroupList.map(selectGroup => (
                            <Card className="shadow m-3">
                                <CardHeader><h4>{selectGroup.name}</h4></CardHeader>
                                <CardBody style={{height:200, overflow:"auto"}}>

                                    {selectContactList.map(selectContact => (
                                        selectContact.groupId === selectGroup.id ? (

                                            <Button color="primary" type="button" className="m-1" size="sm"
                                                    onClick={(e) => onDeleteContactHandler(selectContact)}>
                                                {selectContact.memo} ({makeHyphen(selectContact.phoneNumber)})
                                                <Badge className="badge-black" color="black">X</Badge>
                                            </Button>
                                        ) : null
                                    ))}
                                </CardBody>
                            </Card>
                        ))}

                    </div>
                </Row>


                <div className="modal-footer">
                    <Button color="primary" style={{width: 150}} onClick={(e) => {
                        hide()
                    }}>
                        완료
                    </Button>
                </div>

            </Modal> : null
    )
}
export default Receiver;
