import React, { useEffect, useState } from "react";
import HeaderAfterLogin from "../../Components/HeaderAfterLogin/HeaderAfterLogin";
import { Link } from "react-router-dom";
const AfterLoginUser = () => {
  const [regNum, setVhlno] = useState("");
  const [typeId, setvhltyp] = useState("");
  const [slot, setSlot] = useState("");
  const [countno, setCount] = useState(0);
  const [counta, setCountA] = useState(0);
  useEffect(() => {
    handleCount();
    handleActiveslots();
    setSlot();
    return () => {};
  }, []);

  const handleActiveslots = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
    console.log(token.jwtToken);
    let count1 = await fetch("/slots/activeCount/1", {
      method: "get",
      headers: {
        "Content-type": "application/json",
        authorization: `bearer ${token.jwtToken}`,
      },
    });
    count1 = await count1.json();
    console.log(count1.count);

    let count2 = await fetch("/slots/activeCount/2", {
      method: "get",
      headers: {
        "Content-type": "application/json",
        authorization: `bearer ${token.jwtToken}`,
      },
    });
    count2 = await count2.json();
    console.log(count2.slots);
    let countA = count1.slots + count2.slots;

    setCountA(countA);
  };

  const handleCount = async () => {
    const token = JSON.parse(localStorage.getItem("user"));
    console.log(token.jwtToken);
    let count1 = await fetch("/slots/freeCount/1", {
      method: "get",
      headers: {
        "Content-type": "application/json",
        authorization: `bearer ${token.jwtToken}`,
      },
    });
    count1 = await count1.json();
    console.log(count1.count);

    let count2 = await fetch("/slots/freeCount/2", {
      method: "get",
      headers: {
        "Content-type": "application/json",
        authorization: `bearer ${token.jwtToken}`,
      },
    });
    count2 = await count2.json();
    console.log(count2.slots);
    let countf = count1.slots + count2.slots;

    setCount(countf);
  };

  const handleVhl = async () => {
    const vehicleDetail = { typeId, regNum };
    console.log(vehicleDetail);
    const token = JSON.parse(localStorage.getItem("user"));
    console.log(token.jwtToken);
    let result = await fetch("/txn/book", {
      method: "post",

      headers: {
        "Content-type": "application/json",
        authorization: `bearer ${token.jwtToken}`,
      },
      body: JSON.stringify(vehicleDetail),
    });
    result = await result.json();
    if (result.number) setSlot(result.number);
    alert(result.message);
  };
  return (
    <div>
      <HeaderAfterLogin />
      <div
        class="container col-lg-10 px-4"
        style={{ marginBottom: "10vmin", marginTop: "10vmin" }}
      >
        <div class="row align-items-center g-lg-5 py-5">
          <div class="col-lg-7 text-center text-lg-start">
            <h3 class="display-10 fw-bold lh-1 mb-3">
              SLOTS AVAILBLE - {countno}/{counta}
            </h3>
            <h class="display-10 fw-bold lh-1 mb-3">
              {" "}
              <Link to="/history" style={{ textDecoration: "none" }}>
                History Link
              </Link>
              <p class="time"></p>
            </h>
          </div>

          <div class="col-md-10 mx-auto col-lg-5">
            <form
              class="p-4 p-md-5 border rounded-3 bg-light"
              data-bitwarden-watching="1"
            >
              <h3 class="text-center mb-4">Vehicle Details</h3>

              <div class="form-floating mb-3 ">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  id="floatingInput"
                  placeholder="UP78GA9928"
                  onChange={(e) => setVhlno(e.target.value)}
                  value={regNum}
                />
                <label for="floatingInput">Vehicle No.</label>
              </div>

              <select
                class="form-select form-select-sm"
                aria-label=".form-select-sm example"
                onChange={(e) => setvhltyp(e.target.value)}
                value={typeId}
              >
                <option selected="">Vehicle Type</option>
                <option value="1">2-Wheeler</option>
                <option value="2">4-Wheeler</option>
              </select>

              <h6 class="display-8  lh-1  mt-3 mb-3">SLOT : {slot} </h6>
              {/* <div class="custom-file">
              <input type="file" class="custom-file-input mb-3" id="customFile" />
              <label class="custom-file-label " for="customFile "></label>
            </div> */}
              <button
                class="w-1 btn btn-mid btn-dark "
                type="button"
                onclick="location.href='formpopup.html';"
                onClick={handleVhl}
                style={{ marginRight: "2vmax" }}
              >
                Book Slot
              </button>
              <button
                class="w-1 btn btn-mid btn-dark "
                type="submit"
                onclick="location.href='formpopup.html';"
                style={{ marginRight: "2vmax" }}
              >
                Confirm
              </button>
              <button class="w-1 btn btn-mid btn-dark" type="reset">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfterLoginUser;
