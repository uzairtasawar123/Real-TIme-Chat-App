import {io} from 'socket.io-client';
import react, { createContext } from 'react';


//////////////////////////
const Store  = createContext();

const socket_URL = 'http://localhost:8001'
export  const socket = io(socket_URL);

export default Store;
