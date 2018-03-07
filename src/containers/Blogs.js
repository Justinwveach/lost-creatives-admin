import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Blogs.css";
import { invokeApig } from "../libs/awsLib";

export default class Blogs extends Component {

  constructor() {
    super();

    this.state = {
      isLoading: true,
      blogs: []
    }
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const results = await this.blogs();
      this.setState({ blogs: results });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  blogs() {
    return invokeApig({ path: "/blogs" });
  }

  renderBlogsList(blogs) {
    return [{}].concat(blogs).map(
      (blog, i) =>
        i !== 0
          ? <ListGroupItem
              key={blog.blogId}
              href={`/blogs/${blog.blogId}`}
              onClick={this.handleCategoryClick}
              header={blog.title.trim().split("\n")[0]}
            >
              {"Created: " + new Date(blog.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/blogs/new"
              onClick={this.handleCategoryClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new blog
              </h4>
            </ListGroupItem>
    );
  }

  handleCategoryClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderBlogs() {
    return (
      <div className="">
        <PageHeader>Blogs</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderBlogsList(this.state.blogs)}
        </ListGroup>
      </div>
    );
  }

  renderNoAccess() {
    return (
      <div className="">
        <h1>Not Authentiated</h1>
        <p>You must login before making any updates.</p>
      </div>
    );
  }

  render() {
    return (
      <div className="Blogs">
        {this.props.isAuthenticated ? this.renderBlogs() : this.renderNoAccess()}
      </div>
    );
  }
}
