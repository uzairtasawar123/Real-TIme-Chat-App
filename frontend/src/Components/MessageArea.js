import React, { useContext, useEffect, useRef, useState } from "react";
import "./MessageArea.css";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector } from "react-redux";
import Store from "../AppContext";
const MessageArea = () => {
  /////////////////////////////////////////////////////////////////
  const [message, setMessage] = useState("");
  const messageRef = useRef(null);
  ////////////////////////////////////////////////////////////////
  const user = useSelector((state) => state.user);
  const { socket, currentRoom, messages, setMessages, privateMemberMsg } =
    useContext(Store);
  //////////////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    ScrollToBottom();
  }, [messages]);

  //////////////////////////// Funciton to Get Formated Today's Date ////////////////////////////////////
  const Todaydate = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    month = month.length > 1 ? month : "0" + month;
    day = day.length > 1 ? day : "0" + day;

    return day + "/" + month + "/" + year;
  };
  /////////////////////////
  const DateToday = Todaydate();

  ////////////////////////    Function to Get Time   ////////////////////////
  const GetTime = () => {
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    return time;
  };
  // /////////////////////////
  const TimeToday = GetTime();
  ////////    Getting Message From Bakcend Socket(DB) which we send From FrontEnd //////
  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log(roomMessages);
    setMessages(roomMessages);
  });

  ////////////////////////////   Handle Send Function  ////////////////////////////////////
  const HandleSend = (e) => {
    e.preventDefault();
    if (message) {
      const roomId = currentRoom;
      socket.emit("Message-Room", roomId, message, user, TimeToday, DateToday);
      setMessage("");
    } else {
      return;
    }
  };

  ///////////////   Function ScrollToBottom   ////////////////
  const ScrollToBottom = () => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  ///////////////////////////////////////////////////////////////
  return (
    <>
      <div className="messageArea">
        {user && !privateMemberMsg?._id && (
          <div className="alert alert-danger">
            You are in the {currentRoom} room
          </div>
        )}
        {user && privateMemberMsg?._id && (
          <>
            <div className="alert alert-info conversation-info">
              <div>
                You are now Chatting with {privateMemberMsg.name}{" "}
                <img
                  src={privateMemberMsg.picture}
                  className="private_member_profile"
                />
              </div>
            </div>
          </>
        )}

        {user &&
          messages.map(({ _id: date, messagesByDate }, index) => {
            return (
              <div key={index}>
                <p className="show_date">{date}</p>
                {messagesByDate.map(
                  ({ content, time, from: sender }, index2) => {
                    return (
                      <div
                        className={
                          sender._id === user._id
                            ? "main_message_div_you mx-1"
                            : "main_message_div_other mx-1"
                        }
                        key={index2}
                      >
                        <div className="inner_div">
                          <div className="d-flex align-items-center mb-3">
                            <img
                              src={sender.picture}
                              style={{
                                width: "35px",
                                height: "35px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                marginRight: "10px",
                              }}
                            />
                            <p className="message_sender my-1">
                              {sender._id == user?._id ? "You" : sender.name}
                            </p>
                          </div>
                          <p className="message_content">{content}</p>
                          <p className="">{time}</p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            );
          })}
        <div ref={messageRef}></div>
      </div>
      <Form onSubmit={HandleSend}>
        <Row>
          <Col>
            <Form.Group>
              <input
                type="text"
                placeholder="Type your message here"
                className="messageInput"
                disabled={!user}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></input>
            </Form.Group>
          </Col>
          <Col>
            <button type="submit" className="sendbutton" disabled={!user}>
              <i className="fa-solid fa-paper-plane my-2  sendbtn"></i>
            </button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default MessageArea;
