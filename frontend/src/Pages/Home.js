import React from 'react'
import './Home.css'
import {Row , Col , Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'
import pic from '../Images/home12.jpg'

const Home = () => {
    const navigate = useNavigate();


  return (
    <div className='maindiv'>
      <Row >
        <Col md={4} className='firstcol mx-5' >
          <div>
          <h1>Welcome to the Chat App</h1>
          <p>Meet here with the World...</p>
          </div>
          <LinkContainer to='/chat'>
          <button className=' btn btn-dark getstarted '>
                 Get Started
            <i className="fa-solid fa-comment mx-1 "></i>
          </button>
          </LinkContainer>
        </Col>
        <Col md={7} >
          <img src={pic} className='img'></img>
        </Col>
      </Row>
    </div>
  )
}

export default Home