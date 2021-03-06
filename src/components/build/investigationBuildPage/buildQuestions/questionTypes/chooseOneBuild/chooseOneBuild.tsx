import React, { useEffect } from 'react'

import './chooseOneBuild.scss';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';
import ChooseOneAnswerComponent from './ChooseOneAnswer';
import { ChooseOneAnswer } from './types';
import { QuestionValueType, UniqueComponentProps } from '../types';
import validator from '../../../questionService/UniqueValidator'
import { showSameAnswerPopup } from '../service/questionBuild';

export interface ChooseOneData {
  list: ChooseOneAnswer[];
}

export interface ChooseOneBuildProps extends UniqueComponentProps {
  data: ChooseOneData;
}

const ChooseOneBuildComponent: React.FC<ChooseOneBuildProps> = ({
  locked, editOnly, data, validationRequired, save, updateComponent, openSameAnswerDialog
}) => {
  const [height, setHeight] = React.useState('0%');
  useEffect(() => calculateHeight());
  const newAnswer = () => ({ value: "", checked: false, valueFile: "" });

  if (!data.list) {
    data.list = [newAnswer(), newAnswer(), newAnswer()];
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
  }

  const [state, setState] = React.useState(data);
  useEffect(() => { setState(data) }, [data]);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
    calculateHeight();
  }

  const addAnswer = () => {
    if (locked) { return; }
    state.list.push(newAnswer());
    update();
    save();
  }

  const onChecked = (event: any) => {
    if (locked) { return; }
    const index = event.target.value;
    for (let answer of state.list) {
      answer.checked = false;
    }
    state.list[index].checked = true;
    update();
    save();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    state.list.splice(index, 1);
    update();
    save();
  }

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
      if (answer.answerType !== QuestionValueType.Image) {
        if (answer.value === "") {
          showButton = false;
        }
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  let checkBoxValid = !!validator.getChecked(state.list);

  return (
    <div className="choose-one-build unique-component">
      <div className="component-title">Tick Correct Answer</div>
      {
        state.list.map((answer: any, i: number) => {
          return <ChooseOneAnswerComponent
            key={i}
            locked={locked}
            editOnly={editOnly}
            index={i}
            length={data.list.length}
            answer={answer}
            checkBoxValid={checkBoxValid}
            validationRequired={validationRequired}
            save={save}
            removeFromList={removeFromList}
            onChecked={onChecked}
            update={update}
            onBlur={() => showSameAnswerPopup(i, state.list, openSameAnswerDialog)}
          />
        })
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ ANSWER"
      />
    </div>
  )
}

export default ChooseOneBuildComponent
