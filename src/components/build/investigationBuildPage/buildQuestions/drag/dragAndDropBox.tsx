import React, {useRef} from 'react'
import { useDrop, useDrag, DragSourceMonitor } from 'react-dnd'

import ItemTypes from '../../ItemTypes'
import { QuestionComponentTypeEnum } from 'components/model/question';
import { DropResult } from './interfaces'


function selectBackgroundColor(isActive: boolean, canDrop: boolean) {
  if (isActive) {
    return 'darkgreen'
  } else if (canDrop) {
    return 'darkkhaki'
  } else {
    return '#d9d9d9'
  }
}

export interface DragAndBoxProps {
  locked: boolean
  index: number
  value: QuestionComponentTypeEnum
  data: any
  onDrop(index1: number, index2: number): void
  onHover(index1: number, index2: number): void
  putComponent(index: number, type: number): void
  component: React.FC<any>,
  cleanComponent(): void
  updateComponent(component:any, index:number):void
}

const DragAndDropBox: React.FC<DragAndBoxProps> = ({
  locked, value, index, onDrop, onHover, data, component, cleanComponent, updateComponent, putComponent
}) => {
  const ref = useRef<HTMLDivElement>(null)
  let isHoverUsed = false;

  let UniqueComponent = component;
   
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    collect: (monitor: any) => (
      { isOver: monitor.isOver(), canDrop: monitor.canDrop() }
    ),
    drop: () => ({ index, value, allowedDropEffect: "any" }),
    hover(data: any) {
      if (data.index !== item.index && isHoverUsed === false) {
        if (data.onlyDrag) {
          if (item.value === 0) {
            putComponent(index, data.value)
          }
        } else {
          isHoverUsed = true;
          onHover(index, data.index);
          data.index = index;
        }
      }
    },
    canDrop: () => !locked,
  })

  const item = { name: "", index, value, type: ItemTypes.BOX }
  const [{ }, drag] = useDrag({
    item,
    begin() {
      data.isMoving = true
    },
    end(item: { name: string } | undefined, monitor: DragSourceMonitor) {
      data.isMoving = false;
      const dropResult: DropResult = monitor.getDropResult()
      if (item && dropResult) {
        const isDropAllowed =
          dropResult.allowedDropEffect === 'any' ||
          dropResult.allowedDropEffect === dropResult.dropEffect
        if (isDropAllowed) {
          onDrop(index, dropResult.index);
        } else {
          alert(`You cannot ${dropResult.dropEffect} an item into the ${dropResult.value}`);
        }
      }
    },
    collect: () => ({ }),
    canDrag: () => !locked
  })

  const isActive = canDrop && isOver
  let backgroundColor = selectBackgroundColor(isActive, canDrop)
  if (value !== QuestionComponentTypeEnum.None) {
    backgroundColor = '#d9d9d9';
  }
  drag(drop(ref))

  let opacity = 1;
  if (data.isMoving) {
    opacity = 0.5;
  }

  return (
    <div ref={ref} className="drag-and-drop-box" style={{ backgroundColor, width: '100%', opacity }}>
      <UniqueComponent locked={locked} data={data} cleanComponent={cleanComponent} updateComponent={updateComponent} />
    </div>
  )
}

export default DragAndDropBox
