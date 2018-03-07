import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Categories.css";
import { invokeApig } from "../libs/awsLib";

export default class Categories extends Component {

  constructor() {
    super();

    this.state = {
      isLoading: true,
      categories: []
    }
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const results = await this.categories();
      this.setState({ categories: results });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  categories() {
    return invokeApig({ path: "/categories" });
  }

  renderCategoriesList(categories) {
    return [{}].concat(categories).map(
      (category, i) =>
        i !== 0
          ? <ListGroupItem
              key={category.categoryId}
              href={`/categories/${category.categoryId}`}
              onClick={this.handleCategoryClick}
              header={category.content.trim().split("\n")[0]}
            >
              {"Created: " + new Date(category.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/categories/new"
              onClick={this.handleCategoryClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new category
              </h4>
            </ListGroupItem>
    );
  }

  handleCategoryClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderCategories() {
    return (
      <div className="">
        <PageHeader>Categories</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderCategoriesList(this.state.categories)}
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
      <div className="Categories">
        {this.props.isAuthenticated ? this.renderCategories() : this.renderNoAccess()}
      </div>
    );
  }
}
