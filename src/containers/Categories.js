import React, { Component } from "react";
import "./Categories.css";

export default class Categories extends Component {

  constructor() {
    super();

  }

  componentDidMount() {
    fetch("https://eafalsk4f4.execute-api.us-east-1.amazonaws.com/prod/categories/e278ee90-1cd8-11e8-ab6e-f76de06db1c0",
    {
      method: "delete",
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
      <div className="login container">
        <h1>Categories</h1>
      </div>
    );
  }
}
