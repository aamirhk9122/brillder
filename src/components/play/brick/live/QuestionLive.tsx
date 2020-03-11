import React from 'react';
import { Fab, Grid, FormControlLabel } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import { Question, QuestionComponentTypeEnum, QuestionTypeEnum } from "components/model/question";
import TextLive from './comp/TextLive';
import QuoteLive from './comp/QuoteLive';
import ShortAnswer from './questionTypes/shortAnswer/ShortAnswer';
import ChooseOne from './questionTypes/chooseOne/ChooseOne';
import ChooseSeveral from './questionTypes/chooseSeveral/ChooseSeveral';
import './QuestionLive.scss';
import CompComponent from './questionTypes/comp';


interface QuestionProps {
  question: Question;
  isLastOne: boolean;
  answers: any;
  next(): void;
}

interface QuestionState {
  answerRef: React.RefObject<CompComponent>
}

class QuestionLive extends React.Component<QuestionProps, QuestionState> {
  constructor(props:QuestionProps) {
    super(props);

    this.state = {
      answerRef: React.createRef<CompComponent>()
    }
  }

  getAnswer(): any {
    return this.state.answerRef.current?.getAnswer();
  }

  getAttempt() : any {
    return this.state.answerRef.current?.getAttempt();
  }

  render() {
    const { question, isLastOne, next } = this.props;
    const renderUniqueComponent = (component: any, index: number) => {
      if (question.type === QuestionTypeEnum.ShortAnswer) {
        return <ShortAnswer
          ref={this.state.answerRef as React.RefObject<ShortAnswer>}
          key={index}
          attempt={null}
          answers={this.props.answers}
          question={question}
          component={component} />
      } else if (question.type === QuestionTypeEnum.ChooseOne) {
        return <ChooseOne key={index} question={question} component={component} />
      } else if (question.type === QuestionTypeEnum.ChooseSeveral) {
        return <ChooseSeveral key={index} question={question} component={component} />
      }
      return <div key={index}>Unique Component</div>
    }

    const renderComponent = (component: any, index: number) => {
      if (component.type === QuestionComponentTypeEnum.Text) {
        return <TextLive key={index} component={component} />
      } else if (component.type === QuestionComponentTypeEnum.Quote) {
        return <QuoteLive key={index} component={component} />
      } else if (component.type === QuestionComponentTypeEnum.Component) {
        return renderUniqueComponent(component, index);
      }
      return <div key={index}></div>
    }

    let text = "Next - Don't panic, you can always come back"
    if (isLastOne) {
      text = "Finished - If you are done you are done"
    }

    return (
      <div>
        {
          question.components.map((component, index) => renderComponent(component, index))
        }
        <Grid container direction="row" justify="flex-end">
          <FormControlLabel
            className="next-question-button"
            labelPlacement="start"
            control={
              <Fab style={{ background: '#0076B4' }} color="secondary" aria-label="add" onClick={next}>
                <PlayArrowIcon />
              </Fab>
            }
            label={text}
          />
        </Grid>
      </div>
    )
  }
}

export default QuestionLive;
