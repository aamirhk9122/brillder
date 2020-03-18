import React from "react";
import update from 'immutability-helper';
import { Button, Grid } from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import { History } from 'history';

import './ChooseUserPage.scss';
import { UserLoginType } from 'model/auth';

interface ChooseUserProps {
  history: History
}

const ChooseUserPage:React.FC<ChooseUserProps> = (props) => {
  const [userType, setUserType] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const selectLoginType = (type: UserLoginType) => {
    setUserType(update(userType, { $set: type }));
    if (type === UserLoginType.Builder || type === UserLoginType.Student) {
      props.history.push(`/choose-login?userType=${type}`);
    }
  }

  const openMessage = () => {
    setOpen(update(open, { $set: true }))
  }

  const handleClose = () => {
    setOpen(update(open, { $set: false }))
  }

  return (
    <Grid className="choose-user-page" style={{ height: '100%' }} container item justify="center">
      <Grid container className="pre-login-image-container" justify="center" item xs={12} sm={6} alignItems="center">
        <Grid container className="pre-login-image-container2" justify="center" item xs={12} alignItems="center">
          <Grid container className="pre-login-image-container3" justify="center" style={{ position: "relative" }}>
            <img alt="Logo" src="/images/BrixLogo.png" className="pre-login-image" />
          </Grid>
        </Grid>
      </Grid>
      <Grid container item xs={12} sm={6} className="pre-login-button-container">
        <Grid container direction="row" justify="center" alignItems="center">
          <div style={{ width: "100%" }}>
            <Grid container direction="row">
              <Grid container item xs={12} justify="center">
                <Button onClick={() => { selectLoginType(UserLoginType.Student); }} className="user-type-btn">
                  <span className="user-type-name">L e a r n</span>
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid container item xs={12} justify="center">
                <Button onClick={() => { selectLoginType(UserLoginType.Teacher); openMessage(); }} className="user-type-btn">
                  <span className="user-type-name">T e a c h</span>
                </Button>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid container item xs={12} justify="center">
                <Button onClick={() => selectLoginType(UserLoginType.Builder)} className="user-type-btn">
                  <span className="user-type-name">B u i l d</span>
                </Button>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        message={`You cannot login as this type of user yet.`}
        action={
          <React.Fragment>
          </React.Fragment>
        }
      />
    </Grid>
  );
}

export default ChooseUserPage