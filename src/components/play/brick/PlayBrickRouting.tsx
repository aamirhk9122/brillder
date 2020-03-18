import React from 'react';
import { Route, Switch } from 'react-router-dom';
// @ts-ignore
import { connect } from "react-redux";

import './brick.scss';
import actions from 'redux/actions/brickActions';
import Introduction from './introduction/Introduction';
import Live from './live/Live';
import ProvisionalScore from './provisionalScore/ProvisionalScore';
import Synthesis from './synthesis/Synthesis';
import Review from './review/ReviewPage';
import Ending from './ending/Ending';

import { Brick } from 'model/brick';
import { ComponentAttempt, PlayStatus } from './model/model';
import {
  Question, QuestionTypeEnum, QuestionComponentTypeEnum, HintStatus
} from 'components/model/question';


export interface BrickAttempt {
  brick: Brick;
  score: number;
  oldScore?: number;
  maxScore: number;
  student?: any;
  answers: ComponentAttempt[];
}

function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface BrickRoutingProps {
  brick: Brick;
  match: any;
  fetchBrick(brickId: number):void;
}

const BrickRouting: React.FC<BrickRoutingProps> = (props) => {
  let initAttempts:any[] = [];
  props.brick?.questions.forEach(question => initAttempts.push({}));
  
  const [status, setStatus] = React.useState(PlayStatus.Live);
  const [brickAttempt, setBrickAttempt] = React.useState({} as BrickAttempt);
  const [attempts, setAttempts] = React.useState(initAttempts);
  const [reviewAttempts, setReviewAttempts] = React.useState(initAttempts);

  const brickId = parseInt(props.match.params.brickId);
  if (!props.brick || props.brick.id !== brickId) {
    props.fetchBrick(brickId);
    return <div>...Loading brick...</div>
  }

  const updateAttempts = (attempt:any, index:number) => {
    attempts[index] = attempt;
    setAttempts(attempts);
  }

  const updateReviewAttempts = (attempt:any, index:number) => {
    reviewAttempts[index] = attempt;
    setReviewAttempts(reviewAttempts);
  }

  const finishBrick = () => {
    let score = attempts.reduce((acc, answer) => acc + answer.marks, 0);
    let maxScore = attempts.reduce((acc, answer) => acc + answer.maxMarks, 0);
    var ba : BrickAttempt = {
      brick: props.brick,
      score: score,
      maxScore: maxScore,
      student: null,
      answers: attempts
    };
    setStatus(PlayStatus.Review);
    setBrickAttempt(ba);
    setReviewAttempts(Object.assign([], attempts));
    setStatus(PlayStatus.Review);
  }

  const finishReview = () => {
    let score = reviewAttempts.reduce((acc, answer) => acc + answer.marks, 0) + brickAttempt.score;
    let maxScore = reviewAttempts.reduce((acc, answer) => acc + answer.maxMarks, 0);
    var ba : BrickAttempt = {
      brick: props.brick,
      score,
      maxScore,
      oldScore: brickAttempt.score,
      student: null,
      answers: reviewAttempts
    };
    setBrickAttempt(ba);
    setStatus(PlayStatus.Ending);
    // saveBrickAttempt;
  }

  return (
    <Switch>
      <Route exac path="/play/brick/:brickId/intro">
        <Introduction brick={props.brick} />
      </Route>
      <Route exac path="/play/brick/:brickId/live">
        <Live status={status} questions={props.brick.questions} brickId={props.brick.id} updateAttempts={updateAttempts} finishBrick={finishBrick} />
      </Route>
      <Route exac path="/play/brick/:brickId/provisionalScore">
        <ProvisionalScore status={status} brick={props.brick} attempts={attempts} />
      </Route>
      <Route exac path="/play/brick/:brickId/synthesis">
        <Synthesis status={status} brick={props.brick} />
      </Route>
      <Route exac path="/play/brick/:brickId/review">
        <Review
          status={status}
          questions={props.brick.questions}
          brickId={props.brick.id}
          updateAttempts={updateReviewAttempts}
          attempts={attempts}
          finishBrick={finishReview} />
      </Route>
      <Route exac path="/play/brick/:brickId/ending">
        <Ending status={status} brick={props.brick} brickAttempt={brickAttempt} />
      </Route>
    </Switch>
  );
}

const parseAndShuffleQuestions = (brick:Brick):Brick => {
  /* Parsing each Question object from json <contentBlocks> */
  if (!brick) { return brick; }
  const parsedQuestions: Question[] = [];
  for (const question of brick.questions) {
    if (!question.components) {
      try {
        const parsedQuestion = JSON.parse(question.contentBlocks as string);
        if (parsedQuestion.components) {
          let q = {
            id: question.id,
            type: question.type,
            hint: parsedQuestion.hint,
            components: parsedQuestion.components
          } as Question;
          parsedQuestions.push(q);
        }
      } catch (e) {}
    } else {
      parsedQuestions.push(question);
    }
  }
  
  let shuffleBrick = Object.assign({}, brick);
  
  shuffleBrick.questions = parsedQuestions;

  shuffleBrick.questions.forEach(question => {
    if (question.type === QuestionTypeEnum.ChooseOne || question.type === QuestionTypeEnum.ChooseSeveral) {
      question.components.forEach(c => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          const {hint} = question;
          if (hint.status === HintStatus.Each) {
            for (let [index, item] of c.list.entries()) {
              item.hint = question.hint.list[index];
            }
          }
          c.list = shuffle(c.list);
        }
      });
    } else if (question.type === QuestionTypeEnum.VerticalShuffle || question.type === QuestionTypeEnum.HorizontalShuffle) {
      question.components.forEach(c => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          for (let [index, item] of c.list.entries()) {
            item.index = index;
            item.hint = question.hint.list[index];
          }
          c.list = shuffle(c.list);
        }
      });
    } else if (question.type === QuestionTypeEnum.PairMatch) {
      question.components.forEach(c => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          for (let [index, item] of c.list.entries()) {
            item.index = index;
            item.hint = question.hint.list[index];
          }
          const choices = c.list.map((a:any) => ({ value: a.value, index: a.index}));
          c.choices = shuffle(choices);
        }
      });
    }
  });
  return shuffleBrick;
}

const mapState = (state: any) => {
  return {
    brick: parseAndShuffleQuestions(state.brick.brick) as Brick,
  };
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (id:number) => dispatch(actions.fetchBrick(id)),
  }
}

const connector = connect(mapState, mapDispatch);

export default connector(BrickRouting);