import React, { useEffect, useState } from "react";
import useLoading from "./hooks/useLoading";
import Loader from "./components/Loader";
import Pagination from "./components/Pagination";
import BlogListContent from "./components/BlogListContent";
import ConfirmationModal from "./components/ConfirmationModal";
import "./BlogList.css";

const Blog = () => {
  const [total, settotal] = useState();
  const [blogData, setBlogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const { isLoading, startLoading, stopLoading } = useLoading();

  const itemsPerPage = 3;
  const totalPages = Math.ceil(blogData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = blogData.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchBlogs = async () => {
      startLoading();
      try {
        const response = await fetch(
          // `http://localhost:9000/blogs/rentdigi/fetch_all_blog`
          `${process.env.REACT_APP_SERVER_URL}/blogs/rentdigi/fetch_all_blog`
        );
        if (response.ok) {
          const res = await response.json();
          setBlogData(res.data);
          settotal(res.data.length);
        } else {
          console.error("Error fetching blogs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        stopLoading();
      }
    };

    if (blogData.length === 0) {
      fetchBlogs();
    }
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const openDeleteConfirmation = (postId) => {
    setDeleteConfirmationVisible(true);
    setPostIdToDelete(postId);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationVisible(false);
    setPostIdToDelete(null);
  };

  const handleDeletePost = async () => {
    if (postIdToDelete) {
      setIsLoadingDelete(true);

      try {
        const response = await fetch(
          // `http://localhost:9000/blogs/rentdigi/delete_blog/${postIdToDelete}`,
          `${process.env.REACT_APP_SERVER_URL}/blogs/rentdigi/delete_blog/${postIdToDelete}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.status) {
            console.log("Post deleted successfully:", data.message);

            const updatedBlogData = blogData.filter(
              (post) => post._id !== postIdToDelete
            );
            setBlogData(updatedBlogData);
          } else {
            console.error("Post deletion failed:", data.message);
          }
        } else {
          console.error("Post deletion failed:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setIsLoadingDelete(false);
        closeDeleteConfirmation();
      }
    }
  };

  return (
    <div className="body blogList-page">
      {isLoading ? (
        <Loader />
      ) : (
        <section className="latestBlogBlk wrapper pd60">
          <div className="container">
            <div class="mb-4">
              <div className="row d-flex justify-space-between g-4">
                <div className="col-lg-4">
                  <div className="mainHdng sideBarHdng">
                    <h3>Articles available for read</h3>
                    <div className="hdngAviableRight">
                      <div className="hdngIcon d-inline">
                        <img src="/images/home.svg" alt="Home Icon" />
                      </div>
                      <div className="hdngRigtTitle d-inline">
                        {currentItems?.length}/{total}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {blogData.length === 0 ? (
              <div className="text-center">No blogs found.</div>
            ) : (
              <BlogListContent
                blogData={currentItems}
                onDelete={openDeleteConfirmation}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      )}

      <ConfirmationModal
        show={deleteConfirmationVisible}
        onHide={closeDeleteConfirmation}
        onConfirm={handleDeletePost}
        isLoading={isLoadingDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this blog post?"
        confirmText={isLoading ? "Deleting..." : "Delete"}
      />
    </div>
  );
};

export default Blog;
