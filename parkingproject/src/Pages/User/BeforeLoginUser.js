import React, { useEffect, useState } from 'react'
import Header from '../../Components/Header/Header'
import { useNavigate } from 'react-router-dom';
const BeforeLoginUser = () => {
  const[code,setUser] = useState("");
  const[password,setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    const auth = localStorage.getItem("type");
    if(auth){
      if(auth==="regular")
    navigate("/user")}
  else if(auth==="Admin")
  navigate("/Admin")
  },[])
  const handleLogin=async ()=>{
    console.log(code,password)
    let result = await fetch("/users/login",{
      method:'post',
      
      headers: {
          
        'Content-Type': 'application/json'  
      },
      body:JSON.stringify({code,password}),
    });

    result = await result.json();
    console.log(result)
    if(result.jwtToken)
    { 
      localStorage.setItem("user",JSON.stringify(result));
      localStorage.setItem("id",JSON.stringify(code));
      if(result.type==="regular")
      {navigate("/user")}
    else
    {navigate("/Admin")}
    }
    else{
      alert("Please enter correct deatils")
    }
  }
  return (
    <div>
      <Header/>
      <section class="vh-100">
        <div class="container py-5 h-100">
          <div class="row d-flex align-items-center justify-content-center h-100">
            <div class="col-md-8 col-lg-7 col-xl-6">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" class="img-fluid" alt="Phone"/>
            </div>
            <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
              
            
              {/* <div class="alert alert-warning alert-dismissible fade show" role="alert" id="101">
                <strong>Invalid!</strong> Please enter correct credentials.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
               */}

            <h3 class="mb-3">Login</h3>
            
            <div class="container mt-5" style={{width:"40vmax"}}>
              <div class="row justify-content-center">
                <div class="col-md-6">
                  <div class="card" style={{marginLeft:"-11vmax",width:"30vmax"}}>
                    <div class="card-body" style={{width:"30vmax"}}>
                        <form>
                        <div class="form-group"style={{margin:"1vw", marginLeft:"0"}}>
                          <label for="username">Username:</label>
                          <input type="text" class="form-control" id="username" onChange={(e)=>setUser(e.target.value)} value={code} required/>
                        </div>
                        <div class="form-group" style={{margin:"1vw", marginLeft:"0"}}>
                          <label for="password">Password:</label>
                          <input type="password" class="form-control" id="password" onChange={(e)=>setPassword(e.target.value)} value={password} required/>
                        </div>
                        <button type="button" class="btn btn-primary  btn-block"style={{margin:"1vw", marginLeft:"0"}} onClick={handleLogin} value="Submit">Login</button>
                        <div id="errorMessage" class="mt-3 text-danger"></div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
       
               
      
            
           
            </div>
          </div>
        </div>
      </section> 
    </div>

  )
}

export default BeforeLoginUser
