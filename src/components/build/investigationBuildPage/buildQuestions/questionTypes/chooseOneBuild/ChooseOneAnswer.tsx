import React from "react";
import Checkbox from "@material-ui/core/Checkbox";

import './ChooseOneAnswer.scss';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import QuestionImageDropzone from "../../baseComponents/QuestionImageDropzone";
import { QuestionValueType } from "../types";
import { ChooseOneAnswer } from './types';
import sprite from "assets/img/icons-sprite.svg";


export interface ChooseOneAnswerProps {
  locked: boolean;
  editOnly: boolean;
  index: number;
  length: number;
  answer: ChooseOneAnswer;
  validationRequired: boolean;
  checkBoxValid: boolean;
  save(): void;
  removeFromList(index: number): void;
  onChecked(event: any, checked: boolean): void;
  update(): void;
  onBlur(): void;
}

const ChooseOneAnswerComponent: React.FC<ChooseOneAnswerProps> = ({
  locked, editOnly, index, length, answer, validationRequired, checkBoxValid,
  removeFromList, update, save, onChecked, onBlur
}) => {
  const renderDeleteButton = () => {
    if (length > 3) {
      return (
        <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeFromList(index)}>
          <svg className="svg active back-button">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#trash-outline"} className="theme-orange" />
          </svg>
        </button>
      );
    }

    return "";
  }

  const setImage = (fileName: string) => {
    if (locked) { return; }
    answer.value = "";
    answer.valueFile = fileName;
    answer.answerType = QuestionValueType.Image;
    update();
    save();
  }

  const onTextChanged = (answer: ChooseOneAnswer, value: string) => {
    if (locked) { return; }
    answer.value = value;
    answer.valueFile = "";
    answer.answerType = QuestionValueType.String;
    update();
  }

  let containerClass = "";
  let className = 'choose-one-box unique-component';
  if (answer.answerType === QuestionValueType.Image) {
    className += ' big-answer';
    containerClass = 'big-box';
  }

  let checkboxClass = "left-ckeckbox";
  if (validationRequired) {
    if (!checkBoxValid) {
      checkboxClass += " checkbox-invalid";
    }
  }

  return (
    <div className={className}>
      {renderDeleteButton()}
      <div className={"checkbox-container " + containerClass}>
        <Checkbox
          className={checkboxClass}
          disabled={locked}
          checked={answer.checked}
          onChange={onChecked}
          value={index}
        />
      </div>
      <QuestionImageDropzone
        answer={answer}
        type={answer.answerType || QuestionValueType.None}
        locked={locked}
        fileName={answer.valueFile}
        update={setImage}
      />
      <DocumentWirisCKEditor
        disabled={locked}
        editOnly={editOnly}
        data={answer.value}
        toolbar={['mathType', 'chemType']}
        placeholder="Enter Answer..."
        validationRequired={answer.answerType !== QuestionValueType.Image ? validationRequired : false}
        onBlur={() => {
          onBlur();
          save();
        }}
        onChange={value => onTextChanged(answer, value)}
      />
    </div>
  );
};

export default ChooseOneAnswerComponent;
