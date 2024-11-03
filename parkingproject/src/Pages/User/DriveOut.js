import React, { useState } from "react";
import HeaderAfterLogin from "../../Components/HeaderAfterLogin/HeaderAfterLogin";

const DriveOut = () => {
  const [regNum, setRegnum] = useState("");
  const [typeId, settype] = useState("");
  const [timeOut, setOut] = useState("");
  const [timeIn, setIn] = useState("");
  const [Charges, setCharge] = useState("");
  //  const[typeId,settype] = useState("")

  const handleDriveout = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
    console.log(token.jwtToken);
    let result = await fetch(`/txn/payment/${regNum}`, {
      method: "get",
      headers: {
        authorization: `bearer ${token.jwtToken}`,
      },
    });
    result = await result.json();
    console.log(result);
    if (result.status === "success") {
      console.log(result.result.charges);
      setCharge(result.result.charges);
      setOut(result.result.timeOut);
      setIn(result.result.timeIn);
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      <HeaderAfterLogin />

      <div class="container col-lg-10 px-4">
        <div class="row align-items-center g-lg-5 py-5">
          <div class="col-md-10 mx-auto col-lg-5">
            <form
              class="p-4 p-md-5 border rounded-3 bg-light"
              data-bitwarden-watching="1"
            >
              <h3 class="text-center mb-4">Drive out details</h3>
              <hr class="my-4" />

              <div class="form-floating mb-3 ">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="floatingInput"
                  placeholder="UP78GA9928"
                  onChange={(e) => setRegnum(e.target.value)}
                />
                <label for="floatingInput">Vehicle No.</label>
              </div>
              <div class="form-floating mb-3 ">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="floatingInput"
                  placeholder="UP78GA9928"
                  onChange={(e) => settype(e.target.value)}
                />
                <label for="floatingInput">Vehicle Type</label>
              </div>
              <div class="form-floating mb-3 ">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="floatingInput"
                  value={timeIn}
                  disabled="true"
                />
                <label for="floatingInput">In time</label>
              </div>
              <div class="form-floating mb-3 ">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="floatingInput"
                  value={timeOut}
                  disabled="true"
                />
                <label for="floatingInput">Out time</label>
              </div>
              {/* <div class="form-floating mb-3 ">
                <input type="text" class="form-control form-control-sm" id="floatingInput" placeholder="UP78GA9928"/>
                <label for="floatingInput">Duration</label>
              </div> */}
              <div class="form-floating mb-3 ">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="floatingInput"
                  value={Charges}
                  disabled="true"
                />
                <label for="floatingInput">Charges</label>
              </div>

              {/* <div class="form-floating mb-3 ">
                <input type="text" class="form-control form-control-sm" id="floatingInput" placeholder="UP78GA9928"/>
                <label for="floatingInput">Booked by</label>
              </div> */}

              <div class="custom-file">
                <input
                  type="file"
                  class="custom-file-input mb-3"
                  id="customFile"
                />
                <label class="custom-file-label " for="customFile "></label>
              </div>

              <button
                class="w-1 btn btn-mid btn-dark"
                type="button"
                onClick={handleDriveout}
              >
                Generate Bill
              </button>

              <h6 class="display-8  lh-1  mt-3 mb-3">
                Choose payment method:{" "}
              </h6>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                />
                <label class="form-check-label" for="flexRadioDefault1">
                  Gateway
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                />
                <label class="form-check-label" for="flexRadioDefault1">
                  UPI
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                />
                <label class="form-check-label" for="flexRadioDefault2">
                  Cash
                </label>
              </div>

              <button class="w-1 btn btn-mid btn-dark" type="reset">
                Pay
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveOut;
