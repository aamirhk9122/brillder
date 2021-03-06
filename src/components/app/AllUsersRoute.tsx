import React from 'react';
import { Route, Redirect, useLocation } from "react-router-dom";
import { connect } from 'react-redux';

import actions from '../../redux/actions/auth';
import userActions from '../../redux/actions/user';
import { isAuthenticated } from 'model/brick';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';


interface AllUsersRouteProps {
  path: string;
  component: any;
  isAuthenticated: isAuthenticated;
  user: User;
  getUser():void;
  isAuthorized():void;
}

const AllUsersRoute: React.FC<AllUsersRouteProps> = ({ component: Component, user, ...rest }) => {
  var location = useLocation();

  if (rest.isAuthenticated === isAuthenticated.True) {
    if (!user) {
      rest.getUser();
      return <PageLoader content="...Getting User..." />;
    }
    if(user.firstName === "" || user.lastName === "") {
      if(location.pathname !== "/user-profile") { // Only redirect to the user profile if we're not already there.
        return <Redirect to="/user-profile" />
      }
    }
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  } else if (rest.isAuthenticated === isAuthenticated.None) {
    rest.isAuthorized();
    return <PageLoader content="...Checking rights..." />;
  } else {
    return <Redirect to="/choose-login" />;
  }
}

const mapState = (state: ReduxCombinedState) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.user.user,
})

const mapDispatch = (dispatch: any) => ({
  isAuthorized: () => dispatch(actions.isAuthorized()),
  getUser: () => dispatch(userActions.getUser()),
})

const connector = connect(mapState, mapDispatch)

export default connector(AllUsersRoute);
