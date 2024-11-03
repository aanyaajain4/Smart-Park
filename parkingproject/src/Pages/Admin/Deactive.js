import React from 'react'
import AdminHeader from '../../Components/HeaderAdmin/AdminHeader'
import { useState } from 'react'
const Deactive = () => {
  const [usercode,setCode] = useState("");
  const [password,setPassword] = useState("");
  const handleDeactivate =async()=>{
    const token   =  JSON.parse(localStorage.getItem('user'));
    console.log(token.jwtToken);
      
    if(password && usercode)
    {
      if(password=="Wow@123")
      {
        let result = await fetch(`/users/${usercode}`,{
          method:"put",
          headers:{
            authorization:  `bearer ${token.jwtToken}`
           }
        });
        result = await result.json();
        alert(result.message)
      }
      else{
        alert("Enter correct password")
      }
    }
    else
    {
      alert("enter all the details")
    }
     
  }

  const handleActivate =async()=>{
    const token   =  JSON.parse(localStorage.getItem('user'));
    console.log(token.jwtToken);
      
    if(password && usercode)
    {
      if(password=="Wow@123")
      {
        let result = await fetch(`/users/active/${usercode}`,{
          method:"put",
          headers:{
            authorization:  `bearer ${token.jwtToken}`
           }
        });
        result = await result.json();
        alert(result.message)
      }
      else{
        alert("Enter correct password")
      }
    }
    else
    {
      alert("enter all the details")
    }
 
    
  }
  return (
    <div>
      <AdminHeader/>
      <div class="container col-lg-10 px-4">
    <div class="row align-items-center g-lg-5 py-5">
      <h2 class="mb-0 ">Employee Details</h2>
    
      <form class="p-4 p-md-5 border rounded-3 bg-light">
        <div class="row">
          
          <div class="col-md-4 mb-3" style={{margin:"1vw", marginLeft:"0"}}>
            <label for="validationDefault01"><h4>Unique Id</h4></label>
            <input type="text" class="w-75 form-control" id="validationDefault01" placeholder="Id" onChange={(e)=>setCode(e.target.value)} value={usercode} />
            
          </div>
          <div class="form-group" style={{margin:"1vw", marginLeft:"0"}}>
            <label for="inputState"><h5>Reason for Deactivating</h5></label>
            <select id="inputState" class="form-control">
              <option selected>Choose...</option>
              <option> Resignation</option>
              <option> End of Contract or Assignment</option>
              <option>Negligence</option>
              <option> Misconduct</option>
              <option> Incapacity or Health Issues</option>
              <option> Customer Complaints</option>           
            </select>
          </div>
        
        </div>
        
      
        <div class="form-group">

          <div class="card-body" style={{margin:"1vw", marginLeft:"0"}}>
            <h5>Enter Admin Password</h5>

            

            <div class="card-text">
              <form>

                <div class="form-group "style={{margin:"1vw", marginLeft:"0"}}>
                  <label for="exampleInputEmail1">Password</label>
                  <input type="password" class="form-control form-control-sm w-25" onChange={(e)=>setPassword(e.target.value)} value = {password}/>
                </div>
               
                <button type="button" class="btn btn-primary btn-block submit-btn" style={{margin:"1vw", marginLeft:"0"} }onClick={handleDeactivate}>Deactivate</button>
                <button type="button" class="btn btn-primary btn-block submit-btn" style={{margin:"1vw", marginLeft:"0"} }onClick={handleActivate}>Activate</button>
                <button type="reset" class="btn btn-primary btn-block submit-btn" >Cancel</button>
              </form>
            </div>
          </div>

        </div>

      </form>
    </div>
  </div>

    </div>
  )
}

export default Deactive
