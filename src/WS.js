import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./WS.css";

const URL = 'http://localhost:3000';

const socket = io(URL);

const WS = (props) =>{
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [chatFriend, setChatFriend] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(message);
        socket.emit('message', {message, id:chatFriend});
        setMessages(messages.concat({message, id:0, friendID:chatFriend}));
        console.log(messages);
        setMessage('');
    };

    useEffect(()=>{
        socket.on('new-message', (message)=>{
            console.log(message);
            setMessages(messages.concat(message));
        })
    },[messages]);

    useEffect(()=>{
        socket.on('new-user',(users)=>{
            setAllUsers(allUsers.concat(users));
        })
        socket.on('CONNECTED_USERS', (users)=>{
            if(!allUsers.includes(users)){
                setAllUsers(allUsers.concat(users));
            }
        })
    },[allUsers]);

    const curUsr = (value)=>{
        console.log(value);
        setChatFriend(value);
    }
    

    if(messages){
    return(
        <>
        <div>
        <h1>Let's Chat!</h1>

        <div className="div1">
            <h4>Available Users</h4>
        <ul className="usrUL">
        {allUsers.map((m,i)=><li className={m==chatFriend?"activeLi":""} key={i} onClick={()=>curUsr(m)}>{m}</li>)}
        </ul>
        </div>

        <div className="div2">
        <section>
        <div className="msgs"> 
        <ul className="msgUL"> 
        {messages.map((m,i)=>
        { if(chatFriend==m.id || (m.id==0 && m.friendID == chatFriend))
            return(
                <li key={i} className={m.id===0?"myMsgLi":"allMsgli"}>{m.message}</li>
            )
        })}
        </ul>
        </div>
        </section>
        </div>

        <br></br>

        <div className="div3">
        <div className="sending">
        <form id='form' className='validate' onSubmit={handleSubmit}>
        <div>
            <label>Send a New Message: </label>
            <input type="text"
            name="message"
            id = "message"
            placeholder="Type your message here..."
            required
            value={message}
            onChange = {(e) => setMessage(e.target.value)}
            />
                
        </div>
        </form>
        </div>
        </div>

        </div>
        </>
    );
}
};

export default WS;