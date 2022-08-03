import React from "react";
import "./Navigation.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from 'react-bootstrap/Button'
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../Images/chat.png";
import { useSelector } from "react-redux";
import {useLogoutUserMutation} from '../Services/AppApi'

const Navigation = () => {
  /////////////////////////////////////////////////
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();
  ////////////////////////////////////////////////

////////////////////    HandleLogOut Function /////////////////////
const HandleLogOut = async (e)=>{
  e.preventDefault();
  await logoutUser(user);
   window.location.replace('/');

}

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} className="navlogo"></img>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
            {!user && (
                <LinkContainer to="/login">
                  <Nav.Link href="#home">Log In</Nav.Link>
                </LinkContainer>
             )
}
              <LinkContainer to="/chat">
                <Nav.Link href="#home">Chat</Nav.Link>
              </LinkContainer>

              {user && (
              <NavDropdown title={
                   <>
                   <img src={user.picture} className='profile'></img>
                    {user.name}
                   </>

              } id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  <Button variant='danger' onClick={HandleLogOut}>Log Out</Button>
                </NavDropdown.Item>
              </NavDropdown>
              )
}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navigation;
