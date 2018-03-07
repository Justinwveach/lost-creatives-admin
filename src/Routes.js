import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Categories from "./containers/Categories";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";
import NewBlog from "./containers/NewBlog";
import NewCategory from "./containers/NewCategory";
import Category from "./containers/Category";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>
    <Route path="/" exact component={Home} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/categories" exact component={Categories} props={childProps} />
    <AuthenticatedRoute path="/categories/new" exact component={NewCategory} props={childProps} />
    <AuthenticatedRoute path="/categories/:id" exact component={Category} props={childProps} />
    <AuthenticatedRoute path="/blogs/new" exact component={NewBlog} props={childProps} />
    <Route component={NotFound} />
  </Switch>;
