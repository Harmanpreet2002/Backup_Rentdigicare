import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import jwt_decode from "jwt-decode";
import {
  Modal,
  Label,
  Form,
  Input,
  ModalFooter,
  ModalBody,
  Button,
  ModalHeader,
} from "reactstrap";
import { toast } from "react-toastify";

const DOCUMENT_DOWNLOAD_URL = "/property/download-document";
export default function LayoutMain(props) {
  const [modal_large, setmodal_large] = useState(false);
  const [modal_large1, setmodal_large1] = useState(false);
  const [modal_large2, setmodal_large2] = useState(false);

  const [showDeleteDialoge, setShowDeleteDialoge] = useState(false);
  const [layoutID, setLayoutID] = useState("");
  const decode = jwt_decode(window.localStorage.getItem("accessToken"));

  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  function tog_large() {
    setmodal_large(!modal_large);
    removeBodyCss();
  }
  function tog_large1() {
    setmodal_large1(!modal_large1);
    removeBodyCss();
  }
  function tog_large2() {
    setmodal_large2(!modal_large2);
    removeBodyCss();
  }

  const [col5, setcol5] = useState(false);
  const t_col5 = () => {
    setcol5(!col5);
  };

  async function deleteProperty() {
    try {
      const response = await axios.delete(
        `/layout/delete?layoutOf=${decode.id}&layoutID=${layoutID}`
      );
      if (response.data.status === 200) {
        toast.success(response.data.message);
        setLayoutID("");
        setShowDeleteDialoge(false);
        props.refresh()
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      // visible error
      console.log(error);
    }
  }
  return (
    <tr>
      <td>{props.number}</td>
      <td>{props.title}</td>

      <td>
        <div className="d-flex gap-3">
          {/* <Link className="text-success" to="#">
            <i
              className="mdi mdi-pencil font-size-18"
              id="edittooltip"
              onClick={() => {
                tog_large();
              }}
              data-toggle="modal"
              data-target=".bs-example-modal-lg"
            ></i>
          </Link> */}
          <Link className="text-danger" to="#">
            <i
              className="mdi mdi-delete font-size-18"
              id="deletetooltip"
              onClick={async (e) => {
                e.preventDefault();
                setLayoutID(props.id);
                setShowDeleteDialoge(!showDeleteDialoge);
              }}
            ></i>
          </Link>

          <Modal
            isOpen={showDeleteDialoge}
            toggle={() => {
              setLayoutID("");
              setShowDeleteDialoge(!showDeleteDialoge);
            }}
          >
            <ModalHeader
              toggle={() => {
                setLayoutID("");
                setShowDeleteDialoge(!showDeleteDialoge);
              }}
            >
              Confirm
            </ModalHeader>
            <ModalBody>Are you sure you want to delete this?</ModalBody>
            <ModalFooter>
              <Button
                color="secondary"
                onClick={() => {
                  setLayoutID("");
                  setShowDeleteDialoge(!showDeleteDialoge);
                }}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onClick={async () => await deleteProperty()}
              >
                Delete
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </td>
    </tr>
  );
}
