import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, PageHeader } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { invokeApig, s3Upload } from "../libs/awsLib";
import config from "../config";
import "./Blog.css";
import CategoryDropdown from "../components/CategoryDropdown";

export default class Blog extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      isDeleting: null,
      blog: null,
      title: "",
      subtitle: "",
      content: "",
      category: "",
      city: "",
      state: "",
      country: "",
      latitude: "",
      longitude: ""
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getBlog();
      this.setState({
        blog: results,
        title: results.title,
        subtitle: results.subtitle,
        content: results.content,
        category: results.category,
        city: results.city,
        state: results.state,
        country: results.country,
        latitude: results.latitude,
        longitude: results.longitude
      });
    } catch (e) {
      alert(e);
    }
  }

  validateForm() {
    return this.state.content.length > 0 &&
           this.state.title.length > 0 &&
           this.state.subtitle.length > 0 &&
           this.state.city.length > 0 &&
           this.state.state.length > 0 &&
           this.state.country.length > 0 &&
           this.state.latitude.length > 0 &&
           this.state.longitude.length > 0 &&
           this.state.category.length > 0;
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
      await this.saveBlog({
        ...this.state.blog,
        title: this.state.title,
        subtitle: this.state.subtitle,
        content: this.state.content,
        category: this.state.category,
        city: this.state.city,
        state: this.state.state,
        country: this.state.country,
        latitude: this.state.latitude,
        longitude: this.state.longitude
      });
      this.props.history.push("/blogs");
    } catch (e) {
      alert("Submit error: " + e);
      this.setState({ isLoading: false });
    }
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to delete this blog?");

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteBlog();
      this.props.history.push("/blogs");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  saveBlog(blog) {
    return invokeApig({
      path: `/blogs/${this.props.match.params.id}`,
      method: "PUT",
      body: blog
    });
  }

  deleteBlog() {
    return invokeApig({
      path: `/blogs/${this.props.match.params.id}`,
      method: "DELETE"
    });
  }

  getBlog() {
    return invokeApig({ path: `/blogs/${this.props.match.params.id}` });
  }

  render() {
    return (
      <div className="Blog">
        <PageHeader>Blog</PageHeader>
        {this.state.blog &&
          <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="title">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.title}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="subtitle">
            <ControlLabel>Subtitle</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.subtitle}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="city">
            <ControlLabel>City</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.city}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="state">
            <ControlLabel>State</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.state}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="country">
            <ControlLabel>Country</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.country}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="latitude">
            <ControlLabel>Latitude</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.latitude}
              componentClass="input"
            />
          </FormGroup>

          <FormGroup controlId="longitude">
            <ControlLabel>Longitude</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.longitude}
              componentClass="input"
            />
          </FormGroup>

          <CategoryDropdown
            onChange={this.handleChange}
            value={this.state.category}
            controlId="category"
            label="Category"/>

          <FormGroup controlId="content">
            <ControlLabel>Blog Content</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>

          <FormGroup controlId="file">
            <ControlLabel>{config.MAX_ATTACHMENT_SIZE}</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" multiple accept="image/*" />
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
