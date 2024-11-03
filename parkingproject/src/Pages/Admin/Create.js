import React, { useState } from 'react'
import AdminHeader from '../../Components/HeaderAdmin/AdminHeader'

const Create = () => {
  
  const [name,setName] = useState("");
  const [userphone,setPhone] = useState("");
  const [code,setCode] = useState("");
  const [newpass,setNewpass] = useState("");
  const [repass,setRepass] = useState("");
  const [password,setPassword] = useState("");
  const [type,setType] = useState("regular");
  const [isActive,setActive] = useState("1");
  const [checkpass,setCheck] = useState(true);
  const handlpassword =()=>{
    if(newpass===repass)
    {
      setPassword(newpass);
      alert("Password set successfully")
      setCheck(true)
      console.log(password);
    }
    
  else
  alert("Password don't match")
  }
  const handleCreate=async()=>{
    const userDetail = {code,password,type,name,isActive}
    
    console.log(userDetail);
    if(code && password && type && name)
    {
      const token   =  JSON.parse(localStorage.getItem('user'));
      console.log(token.jwtToken);
      let result = await fetch("/users/create",{
        method:"post",
        
        headers:{
          'Content-type' : 'application/json',
          authorization:  `bearer ${token.jwtToken}`
        },
        body: JSON.stringify(userDetail)
      });
      result = await result.json();
      console.log(result);
      if(result.user.id)
      {
        alert("Registered successfully");
      }
      else
      alert("User not registered")
    }
    else
    {
      alert("Kindly Enter all the fields")
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
          <h4 style={{marginBottom: "20px"}}>Personal Details</h4>
          <div class="col-md-4 mb-3">
            <label for="validationDefault01">Full name</label>
            <input type="text" class="w-75 form-control" id="validationDefault01" placeholder="First name"
              onChange={(e)=>setName(e.target.value)} value={name}/>
          </div>
          {/* <div class="col-md-6 mb-3">
            <label for="validationDefault02">Last name</label>
            <input type="text" class="w-50 form-control" id="validationDefault02" placeholder="Last name"
              value=""/>
          </div> */}
          <div class="form-outline mb-3" style={{width: "100%", maxWidth: "19rem", marginRight: "5.5rem"}}>
            <label class="form-label" for="phone" >Phone number</label>
            <input type="text" id="phone" class="form-control" placeholder='+91' data-mdb-input-mask="+91 999-999-999" onChange={(e)=>setPhone(e.target.value)} value = {userphone}/>
          </div>
          <div class="form-outline mb-3" style={{width: "100%", maxWidth: "22rem"}}>
            <label class="form-label" >Unqiue Id</label>
            <input type="text" id="uqiId" class="form-control" placeholder='0000' data-mdb-input-mask="+91 999-999-999"
             onChange={(e)=>setCode(e.target.value)} value= {code}/>
          </div>
        </div>
        
        
        {/* <div class="row" >
        <h4>Current Address</h4>
        <div class="form-group" style={{maxWidth: "40%",marginTop: "1rem"}}>
          <label for="inputAddress">Address</label>
          <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St"/>
        </div>
        <div class="form-group " style={{maxWidth: "40%", marginTop: "1rem"}}>
          <label for="inputAddress2">Address 2</label>
          <input type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor"/>
        </div>
        <div class="row">          
          <div class="form-group" style={{maxWidth: "20%", marginTop: "1rem"}}>
            <label for="inputState">State</label>
            <select id="inputState" class="form-control">
              <option selected>Choose...</option>
              <option>Andhra Pradesh</option>
              <option>Arunachal Pradesh</option>
              <option> Assam</option>
              <option>Bihar</option>
              <option>Chhattisgarh</option>
              <option>Goa</option>
              <option>  Gujarat</option>
              <option> Haryana</option>
              <option> Himachal Pradesh</option>
              <option> Jharkhand</option>
              <option>Karnataka</option>
              <option>Kerala</option>
              <option>Maharashtra</option>
              <option> Madhya Pradesh</option>
              <option>Manipur</option>
              <option>Meghalaya</option>
              <option> Mizoram</option>
              <option> Nagaland</option>
              <option> Odisha</option>
              <option> Punjab</option>
              <option> Rajasthan</option>
              <option>  Sikkim</option>
              <option>  Tamil Nadu</option>
              <option>  Tripura</option>
              <option>  Telangana</option>
              <option>  Uttar Pradesh</option>
              <option>  Uttarakhand</option>
              <option>  West Bengal</option>
            </select>
          </div>
          <div class="form-group col-md-6" style={{maxWidth: "20%",maxHeight: "10%", marginTop: "1rem"}}>
            <label for="inputCity">City</label>
            <input type="text" class="form-control" id="inputCity"/>
          </div>
        </div>
        </div>
        <div className="row">
        <h4 style={{marginTop: "20px"}}>Permanent Address</h4>
        <div class="form-group" style={{maxWidth: "40%", marginTop: "1rem"}}>
          <label for="inputAddress">Address</label>
          <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St"/>
        </div>
        <div class="form-group " style={{maxWidth: "40%", marginTop: "1rem"}}>
          <label for="inputAddress2">Address 2</label>
          <input type="text" class="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor"/>
        </div>
        <div class="row" style={{marginBottom: "2rem"}}>          
          <div class="form-group" style={{maxWidth: "20%", marginTop: "1rem"}}>
            <label for="inputState">State</label>
            <select id="inputState" class="form-control">
              <option selected>Choose...</option>
              <option>Andhra Pradesh</option>
              <option>Arunachal Pradesh</option>
              <option> Assam</option>
              <option>Bihar</option>
              <option>Chhattisgarh</option>
              <option>Goa</option>
              <option>  Gujarat</option>
              <option> Haryana</option>
              <option> Himachal Pradesh</option>
              <option> Jharkhand</option>
              <option>Karnataka</option>
              <option>Kerala</option>
              <option>Maharashtra</option>
              <option> Madhya Pradesh</option>
              <option>Manipur</option>
              <option>Meghalaya</option>
              <option> Mizoram</option>
              <option> Nagaland</option>
              <option> Odisha</option>
              <option> Punjab</option>
              <option> Rajasthan</option>
              <option>  Sikkim</option>
              <option>  Tamil Nadu</option>
              <option>  Tripura</option>
              <option>  Telangana</option>
              <option>  Uttar Pradesh</option>
              <option>  Uttarakhand</option>
              <option>  West Bengal</option>
            </select>
          </div>
          <div class="form-group col-md-6" style={{maxWidth: "20%",maxHeight:"10%" ,marginTop: "1rem"}}>
            <label for="inputCity">City</label>
            <input type="text" class="form-control" id="inputCity"/>
          </div>  
          
        </div>
        
        </div> */}
          

        <div class="form-group"style={{marginTop: "1rem"}}>

          <div class="card-body">
            <h5>Set-up New Password</h5>

            
            <div class="card-text">
              <form>

                <div class="form-group" style={{margin:"1vw", marginLeft:"0"}}>
                  <label for="exampleInputEmail1">New password</label>
                  <input type="password" class="form-control form-control-sm w-25" onChange={(e)=>setNewpass(e.target.value)} value= {newpass}/>
                </div>
                <div class="form-group"style={{margin:"1vw", marginLeft:"0"}}>
                  <label for="exampleInputEmail1" >Repeat password</label>
                  <input type="password" class="form-control form-control-sm w-25 mb-3" onChange={(e)=>setRepass(e.target.value)} value= {repass}/>
                </div>
                <button type="button" class="btn btn-primary btn-block submit-btn" style={{marginRight:"2vw"}} onClick={handlpassword}>Set Password</button>
                <button type="button" class="btn btn-primary btn-block submit-btn" onClick={checkpass?handleCreate:alert("Set Password")}>Create Id</button>
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

export default Create
//password for  all test users is saunak12