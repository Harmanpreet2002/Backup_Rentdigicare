import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./BlogDetail.css";
import DOMPurify from "dompurify";
import useLoading from "./hooks/useLoading";
import Loader from "./components/Loader";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { isLoading, startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const fetchBlog = async () => {
      startLoading();
      try {
        const response = await fetch(
          // `http://localhost:9000/blogs/rentdigi/fetch_blog/${slug}`
          `${process.env.REACT_APP_SERVER_URL}/blogs/rentdigi/fetch_blog/${slug}`
        );
        if (response.ok) {
          const res = await response.json();
          setBlog(res.data);
          setImageUrl(res.data.image);
        } else {
          console.error("Error fetching blog:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        stopLoading();
      }
    };

    fetchBlog();
  }, [slug]);

  if (isLoading) {
    return <Loader />;
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div>
      <div className="breadcrums-main">
        <div className="container">
          <ul className="breadcrums">
            <li>
              Blog
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <g clip-path="url(#clip0_168_608)">
                  <path
                    d="M8.948 17.2812L13.7188 12.5L8.948 7.71875L10.4167 6.25L16.6667 12.5L10.4167 18.75L8.948 17.2812Z"
                    fill="#FF6128"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_168_608">
                    <rect width="25" height="25" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </li>
            <li>{blog.title}</li>
          </ul>
        </div>
      </div>
      <div className="blog-details">
        <div className="container">
          <img
            className="blg-dtl-img"
            src={imageUrl}
            alt="Blog img"
            onError={() => console.error("Image loading error")}
          />
          <h2>{blog.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }}></div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
