import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './AdminWrapper.css';
/**
 * index - starts at 1
 */
export default function wrappedWithAdmin(WrappedComponent, cProps) {

  return class extends Component {

    constructor(props) {
      super(props);

      this.state = {
        isAuthenticated: false
      };
    }

    userHasAuthenticated = authenticated => {
      this.setState({ isAuthenticated: authenticated });
    }

    handleLogout = event => {
      this.userHasAuthenticated(false);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    updateWindowDimensions() {
    }

    render() {

      const childProps = {
        isAuthenticated: this.state.isAuthenticated,
        userHasAuthenticated: this.userHasAuthenticated
      };


      return(
        <div>
          <Navbar fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/admin">Home</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                {this.props.isAuthenticated
                  ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                  : [
                  <RouteNavItem key={1} href="/login">
                    Login
                  </RouteNavItem>
                  ]}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <WrappedComponent props={this.props} />
        </div>
      );
    }
  }
}
