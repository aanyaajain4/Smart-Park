import React from 'react'
import AdminHeader from '../../Components/HeaderAdmin/AdminHeader'
import { useState,useEffect } from 'react';

const AdminAfterLogin = () => {
 
  const[id,setUser] = useState([]);
  const[userprofile,setProfile] = useState([]);
 
  useEffect(()=>{
   
    
     getprofile();
   
  },[]);

  const getprofile = async()=> {
   
    const token   =  JSON.parse(localStorage.getItem('user'));
    console.log(token.jwtToken);
    const id = JSON.parse(localStorage.getItem("id"));
    console.log(id)
    let result  =  await fetch(`/users/code/${id}`,{
      method:'get',
    headers:{
     authorization:  `bearer ${token.jwtToken}`
    }
  });
  result = await result.json();
  
  setProfile(result);
  console.log(userprofile)

  }
  return (
    <div>
      
      <AdminHeader/>
     <div class="container col-lg-10 px-4">
      <div class="row align-items-center g-lg-5 py-5">
        <h2 class="mb-0 ">Employee Details</h2>
        
        <form class="p-4 p-md-5 border rounded-3 bg-light">
          
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="validationDefault01">Full name</label>
              <input type="text" class="w-75 form-control" id="validationDefault01" placeholder="First name" value={userprofile.name} disabled=""/>
            </div>
            {/* <div class="col-md-6 mb-3">
              <label for="validationDefault02">Last name</label>
              <input type="text" class="w-50 form-control" id="validationDefault02" placeholder="Last name" value="Kushwaha" disabled=""/>
            </div> */}
            <div class="form-outline mb-3" >
              <label class="form-label" for="phone">Unique Code</label>
              <input type="text" id="phone" class="form-control" data-mdb-input-mask="+91 999-999-999" value={userprofile.code} disabled=""/>
            </div>
            <div class="form-outline mb-3" >
              <label class="form-label" for="phone">Phone number</label>
              <input type="text" id="phone" class="form-control" data-mdb-input-mask="+91 999-999-999" value="+91 7007623090" disabled=""/>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="validationDefault02">Address</label>
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" disabled="">A-1/30 M.I.G Vishwa Bank Barra Kanpur</textarea>
            </div>
          </div>
          <div class="form-group">
  
            <div class="card-body">
              <h5>Change password</h5>
  
    
  
              <div class="card-text">
                
  
                  <div class="form-group">
                    <label for="exampleInputEmail1">Your new password</label>
                    <input type="password" class="form-control form-control-sm w-25"/>
                  </div>
                  <div class="form-group">
                    <label for="exampleInputEmail1">Repeat password</label>
                    <input type="password" class="form-control form-control-sm w-25 mb-3"/>
                  </div>
                  <button type="submit" class="btn btn-primary btn-block submit-btn">Change Password</button>
                
              </div>
            </div>
  
          </div>
          </form>
        </div>
    </div>
    </div>
  )
}

export default AdminAfterLogin
