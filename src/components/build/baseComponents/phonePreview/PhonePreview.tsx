
import React from 'react';
import {  Hidden, Grid } from '@material-ui/core';

import './PhonePreview.scss';


export interface PhonePreviewProps {
  link?: string
  Component?: any
  data?: any
}

const PhonePreview: React.FC<PhonePreviewProps> = ({ link, Component, data }) => {
  const renderInner = () => {
    if (link) {
      return <iframe title="phone-preview-screen" src={link} />;
    }
    if (Component) {
      return <Component data={data} />;
    }
    return "";
  }

  return (
    <Hidden only={['xs', 'sm']}>
      <div className="phone-question-preview-box">
        <Grid container alignContent="center" justify="center" style={{height: '100%'}}>
          <div className="phone-question-preview">
            <div className="phone">
              <div className="phone-border">
                <div className="volume volume1"></div>
                <div className="volume volume2"></div>
                <div className="volume volume3"></div>
                <div className="sleep"></div>
                <div className="screen">
                  <div className="custom-component">
                    {renderInner()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </div>
    </Hidden>
  );
}

export default PhonePreview;
