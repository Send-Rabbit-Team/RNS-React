import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media
} from "reactstrap";

const AdminNavbar = (props) => {
  const profile_image = localStorage.getItem("profile_image")
  const default_image = require("../../assets/img/theme/rabbit-user2.png")
  const name = localStorage.getItem("name")

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>

          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={profile_image ? profile_image : default_image}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-lg font-weight-bold" style={{color: 'black'}}>
                      {name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>

                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome</h6>
                </DropdownItem>
                <DropdownItem to="/admin/profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>프로필</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem to="/auth/login" tag={Link}>
                  <i className="fas fa-sign-out-alt" />
                  <span>로그아웃</span>
                </DropdownItem>

              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
