import React, { useEffect, useState } from "react";
import HeaderAfterLogin from "../../../Components/HeaderAfterLogin/HeaderAfterLogin";
import "./History.css";
import { Link } from 'react-router-dom'
const History = () => {
  const [vhl1, setVhl1] = useState([]);
  const [vhl2, setVhl2] = useState([]);
  const [bookby, setBookby] = useState("");

  useEffect(() => {
    getVehicle();
    return () => {};
  }, []);
  const getVehicle = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
    console.log(token.jwtToken);
    let result1 = await fetch("/vehicles/typeId/1", {
      method: "get",
      headers: {
        authorization: `bearer ${token.jwtToken}`,
      },
    });
    result1 = await result1.json();
    const detail1 = result1.vehicels;
    console.log(detail1);
    setVhl1(detail1);
    
   
    let result2 = await fetch("/vehicles/typeId/2", {
      method: "get",
      headers: {
        authorization: `bearer ${token.jwtToken}`,
      },
    });
    result2 = await result2.json();
    const detail2 = result2.vehicels;
    console.log(detail2);
    setVhl2(detail2);
    
  };
  const handleCancel = async () => {};
  return (
    <div>
      <HeaderAfterLogin />
      <div className="history">
        <h3 class="mt-3 mx-3">Parking History</h3>
        <div class="mx-3">
        <h4 class="mt-3 mx-3" style={{textDecoration:"underline"}}>4-Wheeler</h4>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Vehicle No</th>
                <th scope="col">Time In</th>
                <th scope="col">Booked By(emplyoee Id)</th>
                <th scope="col">Cancel Booking</th>
              </tr>
            </thead>
            <tbody class="mt-3">
              {vhl1.map((vhlD) => (
                <tr>
                  <th scope="row">{vhlD.id}</th>
                  
                  <td>{vhlD.regNum}</td>
                  <td>{vhlD.createdAt}</td>
                  <td>{bookby}</td>
                  <td>
                    <button
                      class="w-1 btn btn-sm btn-dark"
                      type="subm it"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div class="mx-3">
        <h3 class="mt-3 mx-3" style={{textDecoration:"underline"}}>2-Wheeler</h3>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Vehicle No</th>
                <th scope="col">Time In</th>
                <th scope="col">Booked By(emplyoee Id)</th>
                <th scope="col">Cancel Booking</th>
                
              </tr>
            </thead>
            <tbody class="mt-3">
              {vhl2.map((vhlD) => (
                <tr>
                  <th scope="row">{vhlD.id}</th>

                  <td>{vhlD.regNum}</td>
                  <td>{vhlD.createdAt}</td>
                  <td>{bookby}</td>
                  <td>
                    <button
                      class="w-2 btn btn-sm btn-dark"
                      type="submit"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
