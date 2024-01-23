import React, { useEffect, useState } from "react";
import {
  Modal,
  CardHeader,
} from "reactstrap"

const LargeModal = ({ content,heading,html_data }) => {
    const [modal_large, setmodal_large] = useState(false);
    const [newContent,setContent] = useState("")
    const [newHeading,setHeading] = useState("")
    const [newForm,setForm] = useState("")

    useEffect(() => {
        setContent(content)
        setHeading(heading)
        setForm(html_data())
    }, []);

    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    function tog_large() {
        setmodal_large(!modal_large)
        removeBodyCss()
    }



  
  return (
    <React.Fragment>
     
              <CardHeader>
                 
                  <button
                      type="button"
                      onClick={() => {
                          tog_large()
                      }}
                      className="btn btn-light "
                      data-toggle="modal"
                      data-target=".bs-example-modal-lg"
                  >
                      <i className="bx bx-plus me-1"></i> Add Facilities
                  </button>
                  <Modal
                      size="lg"
                      isOpen={modal_large}
                      toggle={() => {
                          tog_large()
                      }}
                  >
                      <div className="modal-header">
                          <h5
                              className="modal-title mt-0"
                              id="myLargeModalLabel"
                          >
                              {newHeading}
                          </h5>
                          <button
                              onClick={() => {
                                  setmodal_large(false)
                              }}
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                          >
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div className="modal-body">
                          <p>{newContent}</p>
                          {newForm}
                          <p>Praesent commodo cursus magna, vel scelerisque
                              nisl consectetur et. Vivamus sagittis lacus vel
                              augue laoreet rutrum faucibus dolor auctor.</p>
                          <p className="mb-0">Aenean lacinia bibendum nulla sed consectetur.
                              Praesent commodo cursus magna, vel scelerisque
                              nisl consectetur et. Donec sed odio dui. Donec
                              ullamcorper nulla non metus auctor
                              fringilla.</p>
                      </div>
                  </Modal>    
                </CardHeader>
         
    </React.Fragment>
  )
}
export default LargeModal
