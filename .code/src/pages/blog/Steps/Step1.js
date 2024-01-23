import React, { useState } from "react";
import { ToastContainer } from "react-toastify";

function StepOne({ onNextStep }) {
  const [blogId, setBlogId] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setBlogId(e.target.value);
    setError("");
  };
  const handleSubmitStepOne = () => {
    if (blogId.trim() === "") {
      setError("Blog Id is required.");
    } else {
      onNextStep(blogId);
    }
  };

  return (
    <div>
      <div className="container-p-y container-p-x">
        <h4 className="fw-bold py-3 mb-0">
          <span className="text-muted fw-light">Blog /</span> Edit Blog
        </h4>
        <div className="row">
          <div className="col-md-12">
            <div className="card mb-4">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-3 text-end"></div>
                  <div className="col-md">
                    <ToastContainer />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <form>
                  <div className="row align-items-center mb-4">
                    <div className="col-md-3 text-end">
                      <label for="blogId" className="form-label m-0">
                        Blog Id:
                      </label>
                    </div>
                    <div className="col-md">
                      <input
                        className="form-control"
                        name="blogId"
                        type="text"
                        id="blogId"
                        required
                        value={blogId}
                        onChange={handleChange}
                        placeholder="Enter Blog Id"
                      />
                    </div>
                  </div>
                </form>
                <div className="row align-items-center">
                  <div className="col-md">
                    <button
                      type="submit"
                      className="btn btn-primary me-2"
                      onClick={handleSubmitStepOne}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
export default StepOne;
