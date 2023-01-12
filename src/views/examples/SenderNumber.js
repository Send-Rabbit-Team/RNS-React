/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import React, {useState} from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";

const SenderNumber = () => {

  const params = useParams();
  const nowPage = isNaN(params.page) ? 1 : params.page

  const [pageData, setPageData] = useState({
    totalPage: 0,
    page: 1,
    size: 0,
    start: 0,
    end: 0,
    prev: false,
    next: false,
    pageList: []
  })
  const [senderNumberList, setSenderNumberList] = useState([])

  const makeHyphen = (number) => {
    return number.slice(0,3) + "-" +
        number.slice(3,7) + "-" +
        number.slice(7,11)
  }

  useState(async () => {
    await axios.get(`/sender/list/${nowPage}`)
        .then((response) => {
          if (response.data.isSuccess) {
            setPageData(pageData => ({...pageData, ...response.data.result, page: nowPage}))
            setSenderNumberList(response.data.result.dtoList)
          } else {
            window.alert(response.data.message)
          }
        })
        .catch((error) => {
          window.alert(error.response.data.message)
        })
  })

  const deleteSenderNumber = async (senderNumberId) => {
    await axios.patch(`/sender/delete/${senderNumberId}`)
        .then((response) => {
          if (response.data.isSuccess) {
            window.alert(response.data.message)
            window.location.reload()
          } else {
            window.alert(response.data.message)
          }
        })
        .catch((error) => {
          window.alert(error.response.data.message)
        })
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">발신자 전화번호 목록</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">메모</th>
                    <th scope="col">전화번호</th>
                    <th scope="col">차단번호</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                {senderNumberList.map((senderNumber, index) => (
                    <tr>
                      <th scope="row" key={senderNumber.id}>
                        {(nowPage-1)*pageData.size + index + 1}
                      </th>
                      <td>{senderNumber.memo}</td>
                      <td>{makeHyphen(senderNumber.phoneNumber)}</td>
                      <td>{makeHyphen(senderNumber.blockNumber)}</td>
                      <td><a href="#"><i className="fas fa-trash" onClick={(e) => {deleteSenderNumber(senderNumber.id)}}/></a></td>
                    </tr>
                ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    {/*prev*/}
                    <PaginationItem className={pageData.prev ? "active" : "disabled"}>
                      <PaginationLink
                        href={"/admin/sender/" + (pageData.start-1).toString()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {/*now*/}
                    {pageData.pageList.map(item => (
                        <PaginationItem className={item == parseInt(nowPage) ? "active" : "inactive"}>
                          <PaginationLink
                              href={"/admin/sender/" + item}
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/*next*/}
                    <PaginationItem className={pageData.next ? "active" : "disabled"}>
                      <PaginationLink
                          href={"/admin/sender/" + (pageData.end+1).toString()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>

                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default SenderNumber;
