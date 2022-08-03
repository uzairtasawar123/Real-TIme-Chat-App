import React, { useState } from "react";
import "./SignUp.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useNavigate } from "react-router-dom";
import signuppic from "../Images/signup.jpg";
import profile from "../Images/profile.jpg";
import {useSignupUserMutation} from '../Services/AppApi'
//import {toast} from 'react-toastify';

const SignUp = () => {
  ////////////////////////////////////  States /////////////////////////////
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupUser , {isLoading , error}] = useSignupUserMutation();
  const navigate = useNavigate();
  /////////////////////////     Image States    //////////////////////////
  const [Image, setImage] = useState(null);
  const [uploadingImage, setuploadImage] = useState(false);
  const [PreviewImage, setPreviewImage] = useState(null);

  /////////////////////////////////// Functions   //////////////////////////////
  //////////////////    Handleimage Function /////////////////////////////////
  const Handleimage = (e) => {
    const img = e.target.files[0];
    if (img.size >= 1048576) {
      return alert("Max 1MB size is allowed");
    } else {
      setImage(img);
      setPreviewImage(URL.createObjectURL(img));
    }
  };

  //////////////////////////////////  UploadImage function    ///////////////////////////
  const UploadImage = async () => {
    const data = new FormData();
    data.append("file", Image);
    data.append("upload_preset", "hlhrhe2f");
    try {
      setuploadImage(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/image-upload-for-real-time-chat-app/image/upload",
        {
          method:'POST',
          body: data
        });
        const urlData = await res.json()
        setuploadImage(false);
        return urlData.url;
    } catch (error) {
      setuploadImage(false);
      console.log(error);
    }
  };

  //////////////////////  HandleSignUp Function   /////////////////////////
  const HandleSignUp = async (e) => {
    e.preventDefault();
    if(!Image){
     return alert("Please Upload a Profile Picture")
     //return toast.error("Please Upload a Profile Picture");
    }
    const url = await UploadImage();
    console.log(url);
    //////////////////   Sugning Up the User    //////////////////////
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
          console.log(data);
          navigate("/chat");
      }
  });

  };

  return (
    <div className="container">
      <Row>
        <Col md={7}>
          <Form className="signupform" onSubmit={HandleSignUp}>
            <h1 className="createacc">Create your Account</h1>
            <div>
              <img src={PreviewImage || profile} className="profilepic"></img>
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle addicon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png image/jpeg image/gif image/ico image/jpg "
                onChange={Handleimage}
              ></input>
            </div>
            {error && <p className="alert alert-danger">{error.data}</p>}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>
                Full Name
                <i class="fa-solid fa-user px-1"></i>{" "}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
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
                Password <i className="fa-solid fa-lock"></i>
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
            <button className="btn btn-dark signupbtn" type="submit">
              {uploadingImage || isLoading ?'Signing you Up...':'SignUp'}
              <i className="fa-solid fa-right-to-bracket px-1 "></i>
            </button>
            <div>
              <p>
                Already have an Account?
                <Link to="/login" className="px-1 signup">
                  LogIn
                </Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={4}>
          <img src={signuppic} className="signupimg"></img>
        </Col>
      </Row>
    </div>
  );
};

export default SignUp;
