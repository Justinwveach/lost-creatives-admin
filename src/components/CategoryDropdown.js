import React, { Component } from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./CategoryDropdown.css";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import config from "../config";

export default class CategoryDropdown extends Component {

  state = { loading: true, categories: [] };

  constructor() {
    super();
  }

  componentDidMount() {
    fetch(`${config.apiGateway.URL}/categories`,
    {
      method: "get",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    })
    .then(results => {
      return results.json();
    }).then(data => {
      this.setState({ loading: false, categories: data })
    });
  }

  render() {

    if (this.state.loading) {
      return this.renderLoading();
    } else if (this.state.categories) {
      return this.renderCategories();
    } else {
      return this.renderError();
    }
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return <div>Error</div>;
  }

  renderCategories() {
    //var selectItems = this.props.categories.map(function(item, i) {
      return (
        <FormGroup controlId={this.props.controlId}>
          <ControlLabel>{this.props.label}</ControlLabel>
          <FormControl componentClass="select" placeholder="Categories"
            onChange={this.props.onChange}
            value={this.props.value}>
            <option value="">Select</option>
            {
              this.state.categories.map(function(category, i) {
              return (
                  <option key={i} value={category.name}>{category.name}</option>
                );
              })
            }
          </FormControl>
        </FormGroup>
      //  <option value={item}>{item}</option>
      );
    //});
  }

}
