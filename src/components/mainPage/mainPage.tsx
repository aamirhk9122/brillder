import React from 'react';
import './mainPage.scss';
import { Link } from 'react-router-dom';
import { Box, Grid } from '@material-ui/core';

const MainPage: React.FC = () => {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      className="mainPage"
      alignItems="center">
      <Grid container item xs={12} justify="center">
        <div className="client-name">Welcome Joe</div>
      </Grid>

      <Grid container item xs={12} justify="center">
        <Box bgcolor="primary.main" className="bigButton">
          <Link to="/brick">
            <div className="link-title">VIEW</div>
            <div className="link-description">See what we want...</div>
          </Link>
        </Box>
      </Grid>
      
      <Grid container item xs={12} justify="center">
        <Box bgcolor="primary.main" className="bigButton">
          <Link to="/brick">
            <div className="link-title">APPLY</div>
            <div className="link-description">Suggest what we want...</div>
          </Link>
        </Box>
      </Grid>
      
      <Grid container item xs={12} justify="center">
        <Box bgcolor="primary.main" className="bigButton">
          <Link to="/brick">
            <div className="link-title">CREATE</div>
            <div className="link-description">Just build a brick...</div>
          </Link>
        </Box>
      </Grid>

      <Grid container item xs={12} justify="center">
        <Box bgcolor="primary.main" className="bigButton">
          <Link to="/brick">
            <div className="link-title">BACK TO WORK</div>
            <div className="link-description">For current projects,</div>
            <div className="link-description">editors and authors...</div>
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
}

export default MainPage;
