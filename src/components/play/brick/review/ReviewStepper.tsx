import React from "react";

import { Question } from "model/question";
import { ComponentAttempt } from "../model/model";

import sprite from "assets/img/icons-sprite.svg";

interface ReviewStepperProps {
  attempts: ComponentAttempt<any>[];
  questions: Question[];
  isEnd?: boolean;
  handleStep(questionIndex: number): any;
}

const ReviewStepper: React.FC<ReviewStepperProps> = ({
  isEnd,
  questions,
  handleStep,
  attempts,
}) => {
  let questionIndex = 0;

  const renderQuestionStep = (key: number) => {
    const attempt = attempts[questionIndex];
    questionIndex++;
    let index = questionIndex;

    // render step for invalid question
    if (!attempt) {
      return (
        <div className="step" key={key} onClick={handleStep(index - 1)}>
          <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#cancel"} className="text-theme-orange" />
          </svg>
        </div>
      );
    }

    // render step normal questions
    return (
      <div className="step" key={key} onClick={handleStep(index - 1)}>
        <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use
            href={attempt.correct ? sprite + "#ok" : sprite + "#cancel"}
            className={
              attempt.correct ? "text-theme-green" : "text-theme-orange"
            }
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="stepper">
      {questions.map((question, index) => renderQuestionStep(index))}
    </div>
  );
};

export default ReviewStepper;
