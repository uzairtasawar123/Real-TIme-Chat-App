import React, { useContext, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Store from "../AppContext";
import "./SideBar.css";
import {
  addNotifications,
  resetNotifications,
  userSlice,
} from "../Features/UserSlice";

const SideBar = () => {
  ////////////////   States  ///////////////////
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  /////////////////////////////////////////////////////////
  const {
    socket,
    currentRoom,
    setCurrentRoom,
    members,
    setMembers,
    rooms,
    setRooms,
    privateMemberMsg,
    setPrivateMemberMsg,
  } = useContext(Store);
  ////////////////////////////////////////////////////////
  socket.off("new-user").on("new-user", (data) => {
    setMembers(data);
  });
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (user) {
      setCurrentRoom("PUBG");
      GetRooms();
      socket.emit("Join_Room", "PUBG");
      socket.emit("new-user");
    }
  }, []);
  ///////////////////////////  Function to setRooms  /////////////////////////////
  const GetRooms = () => {
    fetch("http://localhost:8001/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  };
  ////////////////////////////   HandleJoinRoom  Function for Public Messages in Room   /////////////////////

  const HandleJoinRoom = (room, isPublic = true) => {
    if (!user) {
      return alert("Please Login to your Account");
    } else {
      socket.emit("Join_Room", room , currentRoom);
      setCurrentRoom(room);
      if (isPublic) {
        setPrivateMemberMsg(null);
      }
      //////////////////    Dispatching Notifications   /////////////////////
      dispatch(resetNotifications(room));
     
    }
  };

  ///////////////////////    Socket Notification    ///////////////////
  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) {
      dispatch(addNotifications(room));
    }
  });

  ///////////////////////   Orderging Ids of Users   ///////////
  const orderIds = (id1, id2) => {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  };

  ///////////////////////   HandlePrivateMsg Function for Private Message  /////////////////////
  const HandlePrivateMsg = (member) => {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    HandleJoinRoom(roomId, false);
  };
  ////////////////////////////////////////////////////////
  if (!user) {
    return <></>;
  } else {
    return (
      <div>
        <h1>Available Groups</h1>
        <ListGroup>
          {rooms.map((room, index) => {
            return (
              <ListGroup.Item
                key={index}
                active={room === currentRoom}
                style={{ cursor: "pointer" }}
                onClick={() => HandleJoinRoom(room)}
              >
                {room}{" "}
                {currentRoom !== room && (
                  <span className="badge rounded-pill bg-primary"></span>
                )}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
        <h2>Members</h2>
        {members &&
          members.map((m) => {
            return (
              <ListGroup.Item
                key={m.id}
                active={privateMemberMsg?._id === m?._id}
                disabled={m._id === user._id}
                style={{ cursor: "pointer" }}
                onClick={() => HandlePrivateMsg(m)}
              >
                <img src={m.picture} className="profilePics"></img>
                {m.status === "online" && (
                  <i
                    className="fa-solid fa-circle online_circle_1 "
                    style={{ color: "green", fontSize: "10px" }}
                  ></i>
                )}
                <span className="mx-1">
                  {" "}
                  {m.name}
                  {m._id === user._id && <span> (You)</span>}{" "}
                  {m.status === "offline" && <span>(Offline)</span>}
                </span>
              </ListGroup.Item>
            );
          })}
      </div>
    );
  }
};

export default SideBar;
