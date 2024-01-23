import BlogCard from './BlogCard';

const BlogListContent = ({blogData, onDelete}) => {
  return (
    <div className="row d-flex justify-space-between  align-items-stretch">
      {blogData.map((blog, index) => {
        return <BlogCard key={blog._id} blog={blog} onDelete={onDelete} />;
      })}
    </div>
  )
}

export default BlogListContent
