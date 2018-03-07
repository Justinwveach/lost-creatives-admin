import React, { Component } from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./CategoryDropdown.css";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";

export default class DropdownView extends Component {

  constructor() {
    super();
    this.setState({ categories: [] });
  }

  componentDidMount() {
    fetch("https://eafalsk4f4.execute-api.us-east-1.amazonaws.com/prod/categories",
    {
      method: "get",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: ""
    })
    .then(results => {
      return results.json();
    }).then(data => {
      console.log(data);
    });
  }

  render() {


    return (
      <FormGroup controlId="categorySelect">
        <ControlLabel>Categories</ControlLabel>
        <FormControl componentClass="select" placeholder="Categories">
        </FormControl>
      </FormGroup>
    );
  }

  renderLoading() {
    return <option value="">Loading...</option>
  }

  renderError() {
    return <option value="">Failed To Get Categories</option>
  }

  renderCategories() {
    //var selectItems = this.props.categories.map(function(item, i) {
      return (
        <option value="">worked</option>
      //  <option value={item}>{item}</option>
      );
    //});
  }
}
