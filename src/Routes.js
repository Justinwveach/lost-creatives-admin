import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Categories from "./containers/Categories";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
import NewBlog from "./containers/NewBlog";
import NewCategory from "./containers/NewCategory";

export default ({ childProps }) =>
  <Switch>
    <Route path="/" exact component={Home} />
    <AppliedRoute path="/" exact component={Home} props={childProps}/>
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/categories" exact component={Categories} props={childProps} />
    <AppliedRoute path="/categories/new" exact component={NewCategory} props={childProps} />
    <AppliedRoute path="/blogs/new" exact component={NewBlog} props={childProps} />
    <Route component={NotFound} />
  </Switch>;
