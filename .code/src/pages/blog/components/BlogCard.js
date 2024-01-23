import { Link } from "react-router-dom";

const BlogCard = ({ blog, onDelete }) => {
  return (
    <div className="col-md-6 col-lg-4 col-xxl-4 mb-4 " key={blog._id}>
      <div className="cardPropertyBox blogListBox align-self-stretch p-2">
        <Link
          to={{
            pathname: `blog-detail/${blog.slug}`,
            state: { id: blog._id },
          }}
        >
          <div className="cartBlkImg">
            <img src={blog.image[0]} alt={blog.title} />
          </div>
        </Link>
        <div className="blogList-text align-self-stretch">
          <h3 className="mb-0 pb-0">{blog.title}</h3>

          <div
            className="blogList-desc"
            dangerouslySetInnerHTML={{
              __html: blog.content.split(" ").slice(0, 50).join(" "),
            }}
          ></div>
          <div className="mt-2 d-flex">
            <Link
              to={{
                pathname: `/editblog`,
                search: `?blogId=${blog._id}`,
              }}
            >
              <button className="btn btn-primary btn-sm me-2 text-black bg-white btn-outline-dark px-3">
                Edit
              </button>
            </Link>
            <button
              className="btn btn-danger btn-sm me-2 bg-white text-black btn-outline-dark"
              onClick={() => onDelete(blog._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
