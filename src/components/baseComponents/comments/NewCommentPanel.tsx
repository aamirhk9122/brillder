import React from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { Grid, /*TextField, Box,*/ Button, Input } from '@material-ui/core';
import './NewCommentPanel.scss';

import { Brick } from 'model/brick';
import { ReduxCombinedState } from 'redux/reducers';
import comments from 'redux/actions/comments';

interface NewCommentPanelProps {
	currentBrick: Brick;
	createComment(comment: any): void;
}

const NewCommentPanel: React.FC<NewCommentPanelProps> = props => {
	const [text, setText] = React.useState("");

	const handlePostComment = () => {
		props.createComment({
			text,
			brickId: props.currentBrick.id
		});
		setText("");
	}

	return (
	<Grid container direction="column" alignItems="stretch">
		<Grid item>
			<form className="comment-text-form">
				<Input className="comment-text-entry" placeholder="Add Suggestion..." value={text}
					onChange={(evt) => setText(evt.target.value)} multiline fullWidth disableUnderline />
			</form>
		</Grid>
		<Grid item container direction="row" justify="space-evenly">
			<Button className="comment-action-button post"onClick={() => handlePostComment()} disabled={text === ""}>POST</Button>
			<Button className="comment-action-button cancel" onClick={() => setText("")} disabled={text === ""}>CANCEL</Button>
		</Grid>
	</Grid>
	);
};

const mapState = (state: ReduxCombinedState) => ({
	currentBrick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
	createComment: (comment: any) => dispatch(comments.createComment(comment))
});

const connector = connect(mapState, mapDispatch)

export default connector(NewCommentPanel);