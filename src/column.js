import React from "react";
import styled from "styled-components";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Story from "./story";
const Container = styled.div`
  margin: 8px;
 
  border-radius: 2px;
  width: 420px;
 
  background-color: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: box-shadow 0.3s cubic-bezier(.25,.8,.25,1);
  &:hover {
    box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)
  }
  
`;
const Title = styled.h3`
  padding: 8px;
  text-align: center;
    background: cadetblue;
`;
const StoriesList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDragginOver ? "skyblue" : "inherit")};
  flex-grow: 1;
  min-height: 100px;
  overflow-y:scroll;
  height:70vh;
`;
class InnerList extends React.PureComponent {
  render() {
    return this.props.stories.map((story, storyIndex) => (
      <Story key={story.id} story={story} index={storyIndex} onDeleteStory={this.props.onDeleteStory} onEditStory={this.props.onEditStory}></Story>
    ));
  }
}
export default class Column extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {provided => (
          <Container {...provided.draggableProps} ref={provided.innerRef}>
            <Title {...provided.dragHandleProps}>
              {this.props.column.title}
            </Title>
            <Droppable droppableId={this.props.column.id} type="story">
              {(provided, snapshot) => (
                <StoriesList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDragginOver={snapshot.isDraggingOver}
                >
                  <InnerList stories={this.props.stories} onDeleteStory={this.props.onDeleteStory} onEditStory={this.props.onEditStory}></InnerList>
                  {provided.placeholder}
                </StoriesList>
              )}
            </Droppable>
          </Container>
        )}
      </Draggable>
    );
  }
}
