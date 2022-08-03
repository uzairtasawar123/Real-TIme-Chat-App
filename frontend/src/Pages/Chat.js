import React from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SideBar from '../Components/SideBar';
import MessageArea from '../Components/MessageArea';
const Chat = () => {
  return (
    <div className='container'>
       <Row>
        <Col md={4}>
          <SideBar/>
        </Col>
        <Col md={8}>
          <MessageArea/>
        </Col>
       </Row>
    </div>
  )
}

export default Chat