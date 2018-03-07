import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, PageHeader } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { invokeApig, s3Upload } from "../libs/awsLib";
import config from "../config";
import "./NewCategory.css";

export default class NewCategory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      isDeleting: null,
      category: null,
      content: ""
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getCategory();
      this.setState({ category: results, content: results.content });
    } catch (e) {
      alert(e);
    }
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.saveCategory({
        ...this.state.category,
        content: this.state.content
      });
      this.props.history.push("/categories");
    } catch (e) {
      alert("Submit error: " + e);
      this.setState({ isLoading: false });
    }
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to delete this category?");

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteCategory();
      this.props.history.push("/categories");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  saveCategory(category) {
    return invokeApig({
      path: `/categories/${this.props.match.params.id}`,
      method: "PUT",
      body: category
    });
  }

  deleteCategory() {
    return invokeApig({
      path: `/categories/${this.props.match.params.id}`,
      method: "DELETE"
    });
  }

  getCategory() {
    return invokeApig({ path: `/categories/${this.props.match.params.id}` });
  }

  render() {
    return (
      <div className="Category">
        <PageHeader>Category</PageHeader>
        {this.state.category &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="input"
              />
            </FormGroup>

            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}
