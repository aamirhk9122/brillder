import types from '../types';
import axios from 'axios';
import { Action, Dispatch } from 'redux';
import { Brick } from 'model/brick';
import comments from './comments';

const fetchBrickSuccess = (data:any) => {
  return {
    type: types.FETCH_BRICK_SUCCESS,
    payload: data
  } as Action
}

const fetchBrickFailure = (errorMessage:string) => {
  return {
    type: types.FETCH_BRICK_FAILURE,
    error: errorMessage
  } as Action
}

const fetchBrick = (id: number) => {
  return function (dispatch: any) {
    return axios.get(process.env.REACT_APP_BACKEND_HOST + '/brick/' + id, {withCredentials: true})
      .then((res) => {
        let brick = res.data as Brick;
        brick.questions.sort((q1, q2) => {
          return q1.order - q2.order;
        });
        dispatch(fetchBrickSuccess(res.data));
        dispatch(comments.getComments(brick.id));
      })
      .catch(error => {
        dispatch(fetchBrickFailure(error.message));
      });
  }
}

const saveBrickSuccess = (brick: Brick) => {
  return {
    type: types.SAVE_BRICK_SUCCESS,
    payload: brick,
  } as Action
}

const saveBrickFailure = (errorMessage:string) => {
  return {
    type: types.SAVE_BRICK_FAILURE,
    error: errorMessage
  } as Action
}

const saveBrick = (brick:any) => {
  return function (dispatch: Dispatch) {
    brick.type = 1;
    return axios.put(
      process.env.REACT_APP_BACKEND_HOST + '/brick', brick, {withCredentials: true}
    ).then(response => {
      const savedBrick = response.data as Brick;
      // response brick don`t have author object
      savedBrick.author = brick.author;
      dispatch(saveBrickSuccess(savedBrick));
      return savedBrick;
    }).catch(error => {
      dispatch(saveBrickFailure(error.message))
    });
  }
}

const forgetBrick = () => {
  return function (dispatch: Dispatch) {
    dispatch({ type: types.FORGET_BRICK })
  }
}

const createBrickSuccess = (brick: Brick) => {
  return {
    type: types.CREATE_BRICK_SUCCESS,
    payload: brick,
  } as Action
}

const createBrickFailure = (errorMessage:string) => {
  return {
    type: types.CREATE_BRICK_FAILURE,
    error: errorMessage
  } as Action
}

const createBrick = (brick:any) => {
  return function (dispatch: any) {
    brick.type = 1;
    return axios.post(process.env.REACT_APP_BACKEND_HOST + '/brick', brick, {withCredentials: true}).then(response => {
      const brick = response.data as Brick;
      dispatch(createBrickSuccess(brick));
      dispatch(comments.getComments(brick.id));
    })
    .catch(error => {
      dispatch(createBrickFailure(error.message))
    });
  }
}

const assignEditorSuccess = (brick: Brick) => {
  return {
    type: types.ASSIGN_EDITOR_SUCCESS,
    payload: brick,
  } as Action
}

const assignEditorFailure = (errorMessage:string) => {
  return {
    type: types.ASSIGN_EDITOR_FAILURE,
    error: errorMessage
  } as Action
}

const assignEditor = (brick: any) => {
  return function (dispatch: Dispatch) {
    brick.type = 1;
    return axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignEditor`,
      { brickId: brick.id, editorId: brick.editor.id }, {withCredentials: true}
    ).then(response => {
      const brick = response.data as Brick;
      dispatch(assignEditorSuccess(brick));
    }).catch(error => {
      dispatch(assignEditorFailure(error.message))
    });
  }
}

export default { fetchBrick, createBrick, saveBrick, forgetBrick, assignEditor }
