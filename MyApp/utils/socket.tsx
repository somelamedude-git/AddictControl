import {io, Socket} from "socket.io-client";

export const createSocket = async(accessToken:string)=>{
    const socket: Socket = io('http://localhost:5000', {
        auth:{
            token: accessToken
        }
    });
}