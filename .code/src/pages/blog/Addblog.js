import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import createSlug from "./utils/slugify";
import useLoading from "./hooks/useLoading";
import ConfirmationModal from "./components/ConfirmationModal";

const AddBlog = (props) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    image: null,
  });

  const [content, setContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const imageInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleContentChange = (value) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    setContent(sanitizedValue);
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();

    const slug = createSlug(formData.title);

    const formDataForImage = new FormData();
    formDataForImage.append("image", formData.image);

    try {
      const imageUploadResponse = await fetch(
        // `http://localhost:9000/blogs/rentdigi/blog/upload_image/image`,
        `${process.env.REACT_APP_SERVER_URL}/blogs/rentdigi/blog/upload_image/image`,
        {
          method: "POST",
          body: formDataForImage,
        }
      );

      if (imageUploadResponse.ok) {
        const imageData = await imageUploadResponse.json();
        if (imageData.status) {
          const uploadedImageUrls = imageData.image;
          const blogData = {
            slug: slug,
            title: formData.title,
            author: [
              {
                name: formData.author,
              },
            ],
            content: formData.content,
            image: uploadedImageUrls,
          };

          await createBlog(blogData);
          setFormData({
            title: "",
            author: "",
            content: "",
            image: null,
          });
          if (imageInputRef.current) {
            imageInputRef.current.value = "";
          }

          setContent("");
          setShowModal(true);
        } else {
          console.error("Image uploaded failed:", imageData.msg);
        }
      } else {
        console.error("Image upload failed:", imageUploadResponse.statusText);
      }
    } catch (error) {
      console.error("Image upload error:", error);
    } finally {
      stopLoading();
    }
  };

  const createBlog = async (blogData) => {
    try {
      const response = await fetch(
        // `http://localhost:9000/blogs/rentdigi/createBlog`,
        `${process.env.REACT_APP_SERVER_URL}/blogs/rentdigi/createBlog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blogData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.status) {
          console.log("Blog post created successfully:", result);
        } else {
          console.error("Blog post creation failed:", result.msg);
        }
      } else {
        console.error("Blog post creation failed:", response.statusText);
      }
    } catch (error) {
      console.error("Blog post creation error:", error);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      author: "",
      content: "",
      image: null,
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    setContent("");
  };

  return (
    <>
      <div className="container-p-y container-p-x">
        <h4 className="fw-bold py-3 mb-0">
          <span className="text-muted fw-light">Blog /</span> Add Blog
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
                <form onSubmit={handleSubmit}>
                  <div className="row align-items-center mb-4">
                    <div className="col-md-3 text-end">
                      <label htmlFor="title" className="form-label m-0">
                        Blog Title
                      </label>
                    </div>
                    <div className="col-md">
                      <input
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center mb-4">
                    <div className="col-md-3 text-end">
                      <label htmlFor="author" className="form-label m-0">
                        Blog Author
                      </label>
                    </div>
                    <div className="col-md">
                      <input
                        id="author"
                        type="text"
                        name="author"
                        placeholder="Author"
                        required
                        value={formData.author}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row align-items-center mb-4">
                    <div className="col-md-3 text-end">
                      <label htmlFor="" className="form-label m-0">
                        Blog Content
                      </label>
                    </div>
                    <div className="col-md">
                      <div className="ckEditor">
                        <ReactQuill
                          value={content}
                          onChange={handleContentChange}
                          placeholder="Write your content here"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row align-items-center mb-4">
                    <div className="col-md-3 text-end">
                      <label htmlFor="upload" className="form-label m-0">
                        Blog Image
                      </label>
                    </div>
                    <div className="col-md">
                      <div className="d-flex align-items-start align-items-sm-center gap-4">
                        <div className="button-wrapper">
                          <label
                            htmlFor="upload"
                            className="btn me-2 mb-3"
                            tabIndex="0"
                          >
                            <input
                              type="file"
                              name="image"
                              id="upload"
                              accept="image/*"
                              required
                              onChange={handleImageChange}
                              className="form-control"
                              ref={imageInputRef}
                            />
                          </label>
                          <button
                            type="button"
                            className="btn btn-outline-secondary account-image-reset mb-3"
                            onClick={handleReset}
                          >
                            <i className="bx bx-reset d-block d-sm-none"></i>
                            <span className="d-none d-sm-block">Reset</span>
                          </button>
                          <p className="text-muted mb-0">
                            Allowed JPG, GIF or PNG. Max size of 800K
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-md-3 text-end"></div>
                    <div className="col-md">
                      <button
                        type="submit"
                        className="btn btn-primary me-2"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="reset"
                        className="btn btn-outline-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        isLoading={false}
        title="Blog Created Successfully"
        message="Your blog has been created successfully!"
        confirmText="Close"
      />
    </>
  );
};
export default AddBlog;
