import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { invokeApig, s3Upload } from "../libs/awsLib";
import config from "../config";
import "./NewCategory.css";

export default class NewCategory extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      name: ""
    };
  }

  validateForm() {
    return this.state.name.length > 0;
  }

  createCategory(category) {
    console.log("gateway: " + config.apiGateway.URL);
    return invokeApig({
      path: "/categories",
      method: "POST",
      body: category
    });
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

      await this.createCategory({
        name: this.state.name
      });
      this.props.history.push("/categories");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="NewCategory">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="name">
            <ControlLabel>Category Name</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.name}
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
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}
