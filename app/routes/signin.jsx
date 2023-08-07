import { useState } from "react"

export default function SignIn(){

    const[username,setUserName] = useState('')
    const[password,setPassword] = useState('')

    const handleSignin=async()=>{
        try{
            const response=await fetch("http://localhost/7000/app/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    "username":username,
                    "password":password
                }),
            });
            if(response.ok){
                alert("You have Signed In")
            }
        }
        catch(error){
            alert(error)
        }
    }


    return(
    <div>
        Please Sign in
        <form onSubmit={handleSignin}>
            <input
            type='username'
            placeholder="Enter your UserName"
            value="username"
            onChange={(Event)=>setUserName(Event.target.value)}
            />

            <input
            type="password"
            placeholder="Enter your Password"
            value="password"
            onChange={(Event)=>setPassword(Event.target.value)}
            />

            <button type="submit">Submit</button>
        </form>
    </div>
    )
}