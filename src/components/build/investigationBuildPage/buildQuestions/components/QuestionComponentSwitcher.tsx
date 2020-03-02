import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';

import { QuestionComponentTypeEnum, Hint } from 'components/model/question';
import DragAndDropBox from '../drag/dragAndDropBox'
import TextComponent from './Text/Text'
import ImageComponent from './Image/Image'
import QuoteComponent from './Quote/Quote'
import SoundComponent from './Sound/Sound'
import EquationComponent from './Equation/Equation'
import HintComponent, { HintState } from '../../../baseComponents/Hint/Hint';
import { Grid } from '@material-ui/core';


export interface SwitchQuestionProps {
  type: QuestionComponentTypeEnum
  index: number
  uniqueComponent: any
  component: any
  hint: Hint
  locked: boolean
  componentCount: number
  onDrop(index1:number, index2: number): void
  updateComponent(component: any, index: number): void
  swapComponents(index1:number, index2: number): void
  setQuestionHint(hintState: HintState): void
  removeComponent(componentIndex: number): void
}

const SwitchQuestionComponent: React.FC<SwitchQuestionProps> = ({
  type, index, component, hint, locked, componentCount,
  swapComponents, onDrop,
  setQuestionHint,
  updateComponent,
  uniqueComponent,
  removeComponent
}) => {
  const renderEmptyComponent = () => 
    <Grid container style={{height:'100%', position: 'relative'}} justify="center" alignContent="center">
      {
        (componentCount > 3) ? <DeleteIcon className="right-top-drop-icon" onClick={() => {removeComponent(index)}} /> : ""
      }
      <span className="drop-box-text" style={{color: '#838384', textAlign: 'justify'}}>
        Drag Component Here
      </span>
    </Grid>

  const cleanComponent = () => {
    updateComponent({ type: 0 }, index);
  }

  const getNumberOfAnswers = (data: any) => {
    let count = 1;
    if (data.list && data.list.length) {
      return data.list.length;
    }
    return count;
  }

  let innerComponent = renderEmptyComponent as any;
  let value = type;
 
  return (
    <DragAndDropBox
      locked={locked}
      index={index}
      value={value}
      data={component}
      onDrop={onDrop}
      onHover={swapComponents}
      cleanComponent={cleanComponent}
      updateComponent={updateComponent}
      component={renderEmptyComponent} />
  );
}

export default SwitchQuestionComponent
