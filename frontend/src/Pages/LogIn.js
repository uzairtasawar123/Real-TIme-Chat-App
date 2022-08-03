import React , {useContext, useState} from "react";
import "./LogIn.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from 'react-bootstrap/Spinner'
import { Link, useNavigate } from "react-router-dom";
import loginpic from "../Images/login.jpg";
import { useLoginUserMutation } from "../Services/AppApi";
import Store from "../AppContext";


const LogIn = () => {
  /////////////////////////////  States   //////////////////////////////
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser , {isLoading , error}] = useLoginUserMutation();
  const navigate = useNavigate();
  const {socket} = useContext(Store);

  /////////////////////////   Functions  ///////////////////////////
  ////////////////////  HandleSignIn Function  ////////////////////////
  const HandleSignIn = (e)=>{
      e.preventDefault();
      ///////////////   Login User   ///////////////////////////
      loginUser({ email, password }).then(({ data }) => {
        if (data) {
            //////////  socket work    /////////////
            socket.emit("new-user");
            navigate("/chat");
        }
    });
  }

  return (
    <div className="container">
      <Row>
        <Col md={6}>
          <Form className="loginform" onSubmit={HandleSignIn}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
            {error && <p className="alert alert-danger">{error.data}</p>}
              <Form.Label>
                Email address
                <i class="fa-solid fa-envelope px-1"></i>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>
                Password <i class="fa-solid fa-lock"></i>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="formBasicCheckbox"
            ></Form.Group>
            <button className="btn btn-dark loginbtn" type="submit">
            {isLoading ? <Spinner animation="grow" /> : "Log In"}
              <i className="fa-solid fa-right-to-bracket px-1 "></i>
            </button>
            <div>
              <p>
                Create an Account.
                <Link to="/signup" className="px-1 signup">
                  SignUp
                </Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5}>
          <img src={loginpic} className="loginimg"></img>
        </Col>
      </Row>
    </div>
  );
};

export default LogIn;
