import React from 'react'
import { Grid, Select, FormControl, Button } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { IconButton, MenuItem } from "material-ui";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ReactSortable } from "react-sortablejs";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

import QuestionComponents from './questionComponents/questionComponents';
import './buildQuestionComponent.scss';
import { QuestionTypeEnum, QuestionComponentTypeEnum, Question, QuestionType } from '../../../model/question';
import DragBox from './drag/dragBox';
import { HintState } from 'components/build/baseComponents/Hint/Hint';
import LockComponent from './lock/Lock';


function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

export interface QuestionProps {
  brickId: number
  question: Question
  history: any
  questionsCount: number
  saveBrick(): void
  setQuestion(index: number, question: Question): void
  updateComponents(components: any[]): void
  setQuestionType(type: QuestionTypeEnum): void
  nextOrNewQuestion(): void
  getQuestionIndex(question: Question): number
  setPreviousQuestion(): void
  toggleLock(): void
  locked: boolean
}

const BuildQuestionComponent: React.FC<QuestionProps> = (
  { brickId, question, history, getQuestionIndex, locked, ...props }
) => {
  const [componentTypes, setComponentType] = React.useState([
    {id: 1, type: QuestionComponentTypeEnum.Text},
    {id: 2, type: QuestionComponentTypeEnum.Quote},
    {id: 3, type: QuestionComponentTypeEnum.Image},
    {id: 4, type: QuestionComponentTypeEnum.Sound},
    {id: 5, type: QuestionComponentTypeEnum.Equation},
  ]);
  const { type } = question;
  document.title = QuestionTypeEnum[type];

  const setQuestionHint = (hintState: HintState) => {
    if (locked) { return; }
    const index = getQuestionIndex(question);
    const updatedQuestion = Object.assign({}, question) as Question;
    updatedQuestion.hint.value = hintState.value;
    updatedQuestion.hint.list = hintState.list;
    updatedQuestion.hint.status = hintState.status;
    props.setQuestion(index, updatedQuestion);
  }

  let typeArray: string[] = Object.keys(QuestionType);
  let index = getQuestionIndex(question);

  return (
    <MuiThemeProvider >
      <div className="build-question-page" style={{width: '100%', height: '94%'}}>
        <Grid container justify="center" className="build-question-column" item xs={12}>
          <Grid container direction="row">
            <Grid container item xs={4} sm={3} md={3} alignItems="center" className="parent-left-sidebar">
              <Grid container item xs={12} className="left-sidebar" alignItems="center">
                <ReactSortable
                  list={componentTypes}
                  group={{ name: "cloning-group-name", pull: "clone" }}
                  setList={setComponentType} sort={false}>
                <DragBox
                  locked={locked}
                  name="T" fontSize="2.4vw" label="T E X T"
                  hoverMarginTop="0.5vw"
                  value={QuestionComponentTypeEnum.Text} />
                <DragBox
                  locked={locked}
                  name="“ ”" fontSize="2.8vw" label="Q U O T E"
                  marginTop="0vw" hoverMarginTop="-0.65vw"
                  value={QuestionComponentTypeEnum.Quote} />
                <DragBox
                  locked={locked}
                  name="jpg." fontSize="1.7vw" label="I M A G E"
                  hoverMarginTop="1vw"
                  value={QuestionComponentTypeEnum.Image} />
                <DragBox
                  locked={locked}
                  isImage={true} src="/images/soundicon.png"
                  label="S O U N D" marginTop="-0.2vw" hoverMarginTop="0.5vw"
                  value={QuestionComponentTypeEnum.Sound} />
                <DragBox
                  locked={locked}
                  name="E Q N" fontSize="1.6vw" label="E Q U A T I O N"
                  fontFamily="Century Gothic Bold"
                  hoverMarginTop="0.9vw"
                  value={QuestionComponentTypeEnum.Equation} />
                </ReactSortable>
              </Grid>
            </Grid>
            <Grid container item xs={5} sm={6} md={6} className="question-components-list">
              <QuestionComponents
                questionIndex={index}
                locked={locked}
                brickId={brickId}
                history={history}
                question={question}
                updateComponents={props.updateComponents}
                setQuestionHint={setQuestionHint} />
            </Grid>
            <Grid container item xs={3} sm={3} md={3} className="right-sidebar">
              <Grid container direction="row" justify="center">
                <Grid container item xs={11} className="question-button-container">
                  {
                    (props.questionsCount > 1) ?
                      <div>
                        <div className="right-side-text">Last Question?</div>
                        <Button
                          className="synthesis-button"
                          onClick={() => history.push(`/build/brick/${brickId}/build/investigation/synthesis`)}
                        >
                          <FormatListBulletedIcon className="inner-icon" />
                          Add Synthesis
                        </Button>
                      </div>
                    : ""
                  }
                </Grid>
              </Grid>
              <Grid container direction="row" alignItems="flex-end">
                <Grid container justify="center" item sm={12}>
                  <FormControl variant="outlined">
                    <Select
                      className="select-question-type"
                      disabled={locked}
                      value={type}
                      inputProps={{
                        name: 'age',
                        id: 'age-native-simple',
                      }}
                      onChange={(e) => {
                        props.setQuestionType(parseInt(e.target.value as string) as QuestionTypeEnum);
                      }}
                    >
                      {
                        typeArray.map((typeName, i) => {
                          const type = QuestionType[typeName] as QuestionTypeEnum;
                          return <MenuItem key={i} value={type}>{SplitByCapitalLetters(typeName)}</MenuItem>
                        })
                      }
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <LockComponent locked={locked} onChange={props.toggleLock} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </MuiThemeProvider>
  );
}

export default BuildQuestionComponent
