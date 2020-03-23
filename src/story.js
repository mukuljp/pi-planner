import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

import IconButton from "@material-ui/core/IconButton";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
const Container = styled.div`
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 12px;
  background-color: ${props => (props.isDragging ? "#1b8167" : "ALICEBLUE")};
  display: flex;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  }
`;


const Dependancy = styled.div`
  width: 120px;

  padding: 8px;
  margin: 8px;
  background-color: ${props => props.bgColor};
`;
const DependancyContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const TaskContainer = styled.div`
  flex-grow: 1;
`;
const DragContainer = styled.div`
  background: #a9d2fb;
  border-radius: 2px;
`;

const Epic = styled.div`
  font-weight: 900;
  word-break: break-all;
  text-align: center;
  min-height: 30px;
`;
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default class Story extends React.Component {
  render() {
    if(!this.props.story.show)return'';
    return (
      <Draggable draggableId={this.props.story.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
          >
            {/* <DragContainer {...provided.dragHandleProps}>
              <DragHandle
                
                src={dragIcon}
              ></DragHandle>
              <EpicTitle>EPIC</EpicTitle>
              <Epic>{this.props.story.epic}</Epic>
            </DragContainer> */}

            <TaskContainer>
              <DragContainer {...provided.dragHandleProps}>
                <Epic>
                  <h2>{this.props.story.epic}</h2>
                </Epic>
              </DragContainer>
              <HeaderContainer>
                <h3 style={{ width: "85%" ,'wordBreak': 'break-all'}}>{this.props.story.title}</h3>
                
                <IconButton  onClick={() => {
                    this.props.onEditStory(this.props.story.id);
                  }} aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => {
                    this.props.onDeleteStory(this.props.story.id);
                  }} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </HeaderContainer>

              <div>{this.props.story.description}</div>
              <DependancyContainer>
                {this.props.story.dependancies.map((dep, index) => (
                  <Dependancy bgColor="#7df57d" key={index}>
                    {dep}
                  </Dependancy>
                ))}
              </DependancyContainer>
              <DependancyContainer>
                {this.props.story.risks.map((risk, index) => (
                  <Dependancy bgColor="#fd9595" key={index}>
                    {risk}
                  </Dependancy>
                ))}
              </DependancyContainer>
            </TaskContainer>
          </Container>
        )}
      </Draggable>
    );
  }
}
