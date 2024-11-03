import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
const AdminHeader = () => {
    const auth = localStorage.getItem("jwtToken");
    const navigate = useNavigate();
    const logout = ()=>{
      localStorage.clear();
      navigate("/")
    }
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
    <Link className="link_btn" to="/Admin">Parkeaze</Link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
          <Link className="link_btn" to="/Admin">Home</Link>
          </li>
          <li class="nav-item">
          <Link className="link_btn" to="/earning">Earning</Link>
          </li>
          <li class="nav-item">
          <Link className="link_btn" to="/create">Create</Link>
          </li>
          <li class="nav-item">
          <Link className="link_btn" to="/deactive">Emplyoee-Status</Link>
          </li>
          

        </ul>
        <div class="d-flex"  id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            
            <li class="nav-item">
            <Link className='link_btn' onClick={logout} to="/">Log out</Link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </nav>
    </div>
  )
}

export default AdminHeader
