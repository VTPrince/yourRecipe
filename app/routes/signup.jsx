import { useState, useCallback } from "react"
import { useNavigate } from "@remix-run/react";



export default function Signup(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit= async(submitEvent)=>{
        submitEvent.preventDefault();
        try{
            console.log(username,password)
            const response=await fetch('http://localhost:7000/app/register',{
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "username":username,
                    "password":password
                }),
            });
            // console.log(response)
            if(response.ok){
                alert("you have successfully registered");
                navigate('/signin');
            }
            else{
                alert("error")
            }
        }catch(error){
            alert(error.message);
        }

    };


    return(
        <div>
            Sign Up
            <form onSubmit={handleSubmit}>
                <input
                type='username'
                placeholder="Enter your User Name"
                value={username}
                onChange={(Event)=>setUsername(Event.target.value)}
                />

                <input
                type='password'
                placeholder="Enter your Password"
                value={password}
                onChange={(Event)=>setPassword(Event.target.value)}
                />

                <button type='submit'>Sign Up</button>
            </form>
        </div>
    )

}