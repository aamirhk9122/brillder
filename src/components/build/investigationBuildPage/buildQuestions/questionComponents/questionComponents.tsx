import React from 'react';
import { Grid, Button } from '@material-ui/core';
import update from 'immutability-helper';

import './questionComponents.scss';
import ShortAnswerComponent from '../questionTypes/shortAnswerBuild/shortAnswerBuild';
import SwitchQuestionComponent from '../components/QuestionComponentSwitcher';
import CategoriseComponent from '../questionTypes/categoriseBuild/categoriseBuild';
import ChooseOneComponent from '../questionTypes/chooseOneBuild/chooseOneBuild';
import ChooseSeveralComponent from '../questionTypes/chooseSeveralBuild/chooseSeveralBuild';
import HorizontalShuffleComponent from '../questionTypes/horizontalShuffleBuild/horizontalShuffleBuild';
import LineHighlightingComponent from '../questionTypes/lineHighlightingBuild/LineHighlightingBuild';
import MissingWordComponent from '../questionTypes/missingWordBuild/MissingWordBuild';
import PairMatchComponent from '../questionTypes/pairMatchBuild/pairMatchBuild';
import VerticalShuffleComponent from '../questionTypes/verticalShuffleBuild/verticalShuffleBuild';
import WordHighlightingComponent from '../questionTypes/wordHighlighting/wordHighlighting';
import { Question, QuestionTypeEnum } from 'components/model/question';
import { HintState } from 'components/build/baseComponents/Hint/Hint';


type QuestionComponentsProps = {
  locked: boolean
  history: any
  brickId: number
  question: Question
  swapComponents: Function
  addComponent(): void
  updateComponent(component: any, index: number): void
  setQuestionHint(hintState: HintState): void
  removeComponent(componentIndex: number): void
}


class QuestionComponents extends React.Component<QuestionComponentsProps, any> {
  constructor(props: QuestionComponentsProps) {
    super(props)
    this.state = this.getState(props) as any;
  }

  getState = (props: QuestionComponentsProps) => {
    return {
      questionId: props.question.id,
      components: props.question.components
    }
  }

  moveComponents = (index1: number, index2: number) => {
    let newComponents = Object.assign([], this.state.components) as any[];
    newComponents.forEach(comp => comp.isMoving = false);
    var temp = newComponents[index1];
    newComponents[index1] = Object.assign({}, newComponents[index2]);
    newComponents[index1].isMoving = true;
    newComponents[index2] = Object.assign({}, temp);
    this.setState({ components: newComponents });
  }

  onDrop = (index1: any, index2: any) => {
    this.props.swapComponents(index1, index2);
  }

  renderDropBox = (component: any, index: number) => {
    const updatingComponent = (compData: any) => {
      this.props.updateComponent(compData, index);
    }

    const { type } = this.props.question;
    let uniqueComponent: any;
    if (type === QuestionTypeEnum.ShortAnswer) {
      uniqueComponent = ShortAnswerComponent;
    } else if (type === QuestionTypeEnum.Sort) {
      uniqueComponent = CategoriseComponent;
    } else if (type === QuestionTypeEnum.ChooseOne) {
      uniqueComponent = ChooseOneComponent;
    } else if (type === QuestionTypeEnum.ChooseSeveral) {
      uniqueComponent = ChooseSeveralComponent;
    } else if (type === QuestionTypeEnum.HorizontalShuffle) {
      uniqueComponent = HorizontalShuffleComponent;
    } else if (type === QuestionTypeEnum.LineHighlighting) {
      uniqueComponent = LineHighlightingComponent;
    } else if (type === QuestionTypeEnum.MissingWord) {
      uniqueComponent = MissingWordComponent;
    } else if (type === QuestionTypeEnum.PairMatch) {
      uniqueComponent = PairMatchComponent;
    } else if (type === QuestionTypeEnum.VerticalShuffle) {
      uniqueComponent = VerticalShuffleComponent;
    } else if (type === QuestionTypeEnum.WordHighlighting) {
      uniqueComponent = WordHighlightingComponent;
    } else {
      this.props.history.push(`/build/brick/${this.props.brickId}/build/investigation/question`);
      return <div>...Loading...</div>
    }
    return <SwitchQuestionComponent
      type={component.type}
      index={index}
      locked={this.props.locked}
      componentCount={this.state.components.length}
      swapComponents={this.moveComponents}
      onDrop={this.onDrop}
      component={component}
      updateComponent={updatingComponent}
      hint={this.props.question.hint}
      removeComponent={this.props.removeComponent}
      setQuestionHint={this.props.setQuestionHint}
      uniqueComponent={uniqueComponent} />
  }

  render() {
    const {props, state} = this;
    if (props.question.id !== state.questionId) {
      this.setState(this.getState(props));
    }

    return (
      <div className="questions">
        {
          state.components.map((comp: any, i: number) => {
            return (
              <Grid key={i} container direction="row" className="drop-box">
                {this.renderDropBox(comp, i)}
              </Grid>
            )
          })
        }
        <Grid container direction="row" className="add-dropbox">
          <Button disabled={props.locked} className="add-dropbox-button" onClick={props.addComponent}>
            + &nbsp;&nbsp; Q &nbsp; U &nbsp; E &nbsp; S &nbsp; T &nbsp; I &nbsp; O &nbsp; N &nbsp; &nbsp; C &nbsp; O &nbsp; M &nbsp; P &nbsp; O &nbsp; N &nbsp; E &nbsp; N &nbsp; T
        </Button>
        </Grid>
      </div>
    );
  }
}

export default QuestionComponents;
