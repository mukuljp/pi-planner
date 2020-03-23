import React from "react";
import ReactDOM from "react-dom";
import "@atlaskit/css-reset";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Checkbox from "@material-ui/core/Checkbox";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import styled from "styled-components";
import { initialData } from "./data/initial-data";
import Column from "./column";
import FormDialog from "./add-edit-dialog";
import generateColor from 'material-color-hash';

import UserListIcon from "./show-user-icon";

import Fab from "@material-ui/core/Fab";
import {cloneDeep,uniq} from 'lodash';
import * as serviceWorker from './serviceWorker';
const Container = styled.div`
  display: flex;
  
`;

const CheckboxList = styled.div`
  display: flex;
  margin: 5px;
 
  width: 97vw;
  padding-left: 5px;
  position: ${props => (props.pos ? props.pos : "fixed")};;
  top:${props => (props.topMargin ? props.topMargin+'px' : "inherit")};
  flex-wrap:wrap;
`;
const CheckboxItem = styled.div`
  border-radius: 2px;
  margin-right: 8px;
  background-color:${props => (props.bgColor ? props.bgColor : "inherit")};
  padding-left:8px;
`;
const FloatingAddContainer = styled.div`
  position: fixed;
  top: 88vh;
  left: 88vw;
`;
const AppUserSection = styled.div`
  display: flex;
`;
class InnerList extends React.PureComponent {
  render() {
    const { column, storiesMap, index, onEditStory ,onDeleteStory} = this.props;
    const stories = column.storyIds.map(storyId => storiesMap[storyId]);
    return (
      <Column
        key={column.id}
        column={column}
        stories={stories}
        index={index}
        onEditStory={onEditStory}
        onDeleteStory={onDeleteStory}
      ></Column>
    );
  }
}
class App extends React.Component {
  state = {
    piData: localStorage.getItem('initialData')?JSON.parse(localStorage.getItem('initialData')):initialData,
    dialogOptions: {
      open: false,
      isAddmode: true,
      storyId: "",
      story: {
        id: "story_" + +new Date(),
        title: "",
        description: "",
        epic: "",
        risks: [],
        dependancies: []
      }
    }
  };

  render() {

    let epicList = this.getEpicList();
    

    return (
      <React.Fragment>
        <FloatingAddContainer onClick={this.openAddDialog}>
          <Fab color="primary" aria-label="add">
            <span
              _ngcontent-rcu-c19=""
              className="material-icons icon-image-preview"
            >
              add_circle
            </span>
          </Fab>
        </FloatingAddContainer>
        <AppBar>
          <Toolbar className="space-between">
            <Typography variant="h6">Vizards</Typography>
            <CheckboxList pos={'relative'}>
          {this.state.piData.columnOrder.map((columnId, colomnIndex) => {
            const column = this.state.piData.columns[columnId];
            if (!column.hasOwnProperty("show")) {
              column.show = false;
            }
            return (
              <CheckboxItem  key={"switch" + colomnIndex}>
                <label>
                  {column.title}
                  <Checkbox
                 color="default"
                    onChange={checked => {
                      this.onCheck(checked, column.id);
                    }}
                    checked={column.show}
                  />
                </label>{" "}
              </CheckboxItem>
            );
          })}
        </CheckboxList>
            <AppUserSection>
              <UserListIcon></UserListIcon>
              <Avatar>H</Avatar>
            </AppUserSection>
          </Toolbar>
        </AppBar>
        <Toolbar id="back-to-top-anchor" />
        
        <CheckboxList pos={'relative'}  >
          {epicList.map((epic, colomnIndex) => {
            const color =generateColor(epic);
            const selectedEpicFound= this.state.piData.selectedEpics.find(epitem=>epitem===epic);
            return (
              <CheckboxItem bgColor={color.backgroundColor} key={"switch" + colomnIndex}>
                <label>
                  <span style={{color:color.color}}>{epic}</span>
                  <Checkbox style={{color:color.color}}
                 
                    onChange={checked => {
                      this.onCheckEpicFilter(checked, epic);
                    }}
                    checked={selectedEpicFound?true:false}
                  />
                </label>{" "}
              </CheckboxItem>
            );
          })}
        </CheckboxList>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable
            droppableId="all-colomn-dropable"
            direction="horizontal"
            type="column"
          >
            {provided => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                {this.state.piData.columnOrder.map((columnId, colomnIndex) => {
                  const column = this.state.piData.columns[columnId];
                  if (!column.show) return "";
                  return (
                    <InnerList
                      key={column.id}
                      column={column}
                      storiesMap={this.state.piData.stories}
                      index={colomnIndex}
                      onEditStory={this.onEditStory}
                      onDeleteStory={this.onDeleteStory}
                    ></InnerList>
                  );
                })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
        <FormDialog
          story={this.state.dialogOptions.story}
          open={this.state.dialogOptions.open}
          isAddmode={this.state.dialogOptions.isAddmode}
          handleFormSubmit={this.handleFormSubmit}
          stories={this.state.piData.stories}
          storyId={this.state.dialogOptions.storyId}
          handleTitleChange={this.handleTitleChange}
          handleDescChange={this.handleDescChange}
          handleEpicChange={this.handleEpicChange}
          addMoreRisks={this.addMoreRisks}
          handleRiskChange={this.handleRiskChange}
          handleDependancyChange = {this.handleDependancyChange}
          removeRisk={this.removeRisk}
          addMoreDeps={this.addMoreDeps}
          removeDependancy={this.removeDependancy}
          handleClose={this.handleClose}
          epicList = {this.getEpicList()}
        ></FormDialog>
      </React.Fragment>
    );
  }

  getEpicList=()=>{
    let epicList = [];
    let strIds = Object.keys(this.state.piData.stories);
    
    strIds.forEach(strItem=>{
     
      epicList.push(this.state.piData.stories[strItem].epic)
    });
    epicList = uniq(epicList);
    return epicList;
  }
  handleClose=()=>{
    this.setState({
      ...this.state,
      
      dialogOptions: { ...this.state.dialogOptions, open: false }
    });
  }

  onDragEnd = result => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColummnOrder = Array.from(this.state.piData.columnOrder);
      newColummnOrder.splice(source.index, 1);
      newColummnOrder.splice(destination.index, 0, draggableId);
      const newState = {
        ...this.state,
        piData: {
          ...this.state.piData,
          columnOrder: newColummnOrder
        }
      };
      this.setState(newState);
      localStorage.setItem('initialData',JSON.stringify(newState.piData));
      return;
    }
    const start = this.state.piData.columns[source.droppableId];
    const finish = this.state.piData.columns[destination.droppableId];
    if (start === finish) {
      const newStoryIds = Array.from(start.storyIds);
      newStoryIds.splice(source.index, 1);
      newStoryIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        storyIds: newStoryIds
      };

      const newState = {
        ...this.state,
        piData: {
          ...this.state.piData,
          columns: {
            ...this.state.piData.columns,
            [newColumn.id]: newColumn
          }
        }
      };
      this.setState(newState);
      localStorage.setItem('initialData',JSON.stringify(newState.piData));
      return;
    }

    const startStoryIds = Array.from(start.storyIds);
    startStoryIds.splice(source.index, 1);
    const newStart = {
      ...start,
      storyIds: startStoryIds
    };

    const finishStoryIds = Array.from(finish.storyIds);
    finishStoryIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      storyIds: finishStoryIds
    };
    const newState = {
      ...this.state,
      piData: {
        ...this.state.piData,
        columns: {
          ...this.state.piData.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      }
    };
    this.setState(newState);
    localStorage.setItem('initialData',JSON.stringify(newState.piData));
  };
  onCheck = (e, id) => {
    const newState = {
      ...this.state,
      piData: {
        ...this.state.piData,
        columns: {
          ...this.state.piData.columns,
          [id]: {
            ...this.state.piData.columns[id],
            show: e.target.checked
          }
        }
      }
    };
    this.setState(newState);
    localStorage.setItem('initialData',JSON.stringify(newState.piData));
  };
  openAddDialog = () => {
    this.setState({
      ...this.state,
      dialogOptions: {...this.state.dialogOptions, open: true, isAddmode: true, storyId: "",story: {
        id: "story_" + +new Date(),
        title: "",
        description: "",
        epic: "",
        risks: [],
        dependancies: []
      } }
    });
  };
  handleFormSubmit = (storyId,isAddmode,story) => {
    let selectedEpicsList =uniq([...this.state.piData.selectedEpics])
    const stories = this.state.piData.stories;
    // const storyIds = Object.keys(stories)
    // storyIds.forEach(storyId=>{
    //   if(selectedEpicsList.find(epicItm=>epicItm==stories[storyId].epic)){
    //     stories[storyId].show =true;
    //   }else{
    //     stories[storyId].show =false;
    //   }
    // })
   // console.log(storyId,isAddmode,story);
   if(selectedEpicsList.find(epicItm=>epicItm==story.epic)){
    story.show=true;
   }else{
    story.show=false;
   }
  
    if(!isAddmode){
      let newState ={
        ...this.state,
        piData:{
          ...this.state.piData,
          stories:{
            ...stories,
            [storyId]:story
          },
          selectedEpics:selectedEpicsList
        },
        dialogOptions: { ...this.state.dialogOptions, open: false }
      };
      this.setState(newState);
      localStorage.setItem('initialData',JSON.stringify(newState.piData));
    }else{
      const todocolumn ='column-1';
      let newState = {
        ...this.state,
        piData:{
          ...this.state.piData,
          stories:{
            ...stories,
            [story.id]:story
          },
          columns:{
            ...this.state.piData.columns,
            [todocolumn]:{
              ...this.state.piData.columns[todocolumn],
              storyIds:[story.id,...this.state.piData.columns[todocolumn].storyIds]
            }
          },
          selectedEpics:selectedEpicsList
        },
        dialogOptions: { ...this.state.dialogOptions, open: false }
      }
      this.setState(newState);
      localStorage.setItem('initialData',JSON.stringify(newState.piData));

    }
    
  };
  onEditStory = storyId => {
    //console.log(storyId);
    const story = this.state.piData.stories[storyId];
    this.setState({
      ...this.state,
      dialogOptions: {
        ...this.state.dialogOptions,
        open: true,
        storyId: storyId,
        story: story,
        isAddmode:false
      }
    });
  };
  onDeleteStory = storyId =>{
    //console.log(storyId);
    const stories = this.state.piData.stories;
    const columns =this.state.piData.columns
    delete this.state.piData.stories[storyId];
    const columnKeys = Object.keys(this.state.piData.columns);
    columnKeys.forEach((item=>{
      let newStoriesArray = columns[item].storyIds.filter((item)=>item!=storyId);
      columns[item].storyIds=newStoriesArray;
    }));
    let newState = {
      ...this.state,
      piData:{
        ...this.state.piData,
        stories:{...stories},
        columns:{...columns}
      }
    }
    this.setState(newState);
    localStorage.setItem('initialData',JSON.stringify(newState.piData));
  }
  onCheckEpicFilter = (e, epic)=>{
    //console.log(e, epic);

    let selectedEpicsList = this.state.piData.selectedEpics;
    if(e.target.checked){
      selectedEpicsList.push(epic);
    }else{
      selectedEpicsList =selectedEpicsList.filter(item=>item!=epic)
    }
  const stories = this.state.piData.stories;
  const storyIds = Object.keys(stories)
  storyIds.forEach(storyId=>{
    if(selectedEpicsList.find(epicItm=>epicItm==stories[storyId].epic)){
      stories[storyId].show =true;
    }else{
      stories[storyId].show =false;
    }
  })
  let newState = {...this.state,
    piData:{
      ...this.state.piData,
      stories:{
        ...stories
      },
      selectedEpics:uniq(selectedEpicsList)
    }
   
  }
    this.setState(newState);
    localStorage.setItem('initialData',JSON.stringify(newState.piData));
  }

  /*form callbacks*/
   handleTitleChange = (res, p) => {
    //setStory({ ...story, title: res.target.value });
    this.setState({
      ...this.state,
      dialogOptions: {
        ...this.state.dialogOptions,
        story:{
          ...this.state.dialogOptions.story,
          title:res.target.value
        }
      }
    });

  };
   handleDescChange = (res, p) => {
    this.setState({
      ...this.state,
      dialogOptions: {
        ...this.state.dialogOptions,
        story:{
          ...this.state.dialogOptions.story,
          description:res.target.value
        }
      }
    });
  };
   handleEpicChange = (res, p) => {
    this.setState({
      ...this.state,
      dialogOptions: {
        ...this.state.dialogOptions,
        story:{
          ...this.state.dialogOptions.story,
          epic:res.target.value
        }
      }
    });
  };
   addMoreRisks = ()=>{
    this.setState({
      ...this.state,
      dialogOptions: {
        ...this.state.dialogOptions,
        story:{
          ...this.state.dialogOptions.story,
          risks:[...this.state.dialogOptions.story.risks,'']
        }
      }
    });
  

  }
   handleRiskChange = (e,index)=>{
    const risks = this.state.dialogOptions.story.risks;
    risks[index]= e.target.value;
   // setStory({ ...story,risks:[...risks]  });
   this.setState({
    ...this.state,
    dialogOptions: {
      ...this.state.dialogOptions,
      story:{
        ...this.state.dialogOptions.story,
        risks:[...this.state.dialogOptions.story.risks]
      }
    }
  });
  }
   handleDependancyChange =(e,index)=>{
    const dependancies = this.state.dialogOptions.story.dependancies;
    dependancies[index]= e.target.value;
  
    this.setState({
      ...this.state,
      dialogOptions: {
        ...this.state.dialogOptions,
        story:{
          ...this.state.dialogOptions.story,
          dependancies:[...this.state.dialogOptions.story.dependancies]
        }
      }
    });
  }
   removeRisk = (index)=>{
      const risks = this.state.dialogOptions.story.risks;
      risks.splice(index,1);
     // setStory({ ...story,risks:[...risks]  });
     this.setState({
      ...this.state,
      dialogOptions: {
        ...this.state.dialogOptions,
        story:{
          ...this.state.dialogOptions.story,
          risks:[...this.state.dialogOptions.story.risks]
        }
      }
    });
  }
   addMoreDeps = ()=>{
    this.setState({
      ...this.state,
      dialogOptions: {
        ...this.state.dialogOptions,
        story:{
          ...this.state.dialogOptions.story,
          dependancies:[...this.state.dialogOptions.story.dependancies,'']
        }
      }
    });
   

    
  }
   removeDependancy =(index)=>{
    const dependancies = this.state.dialogOptions.story.dependancies;
    dependancies.splice(index,1);
    ///setStory({ ...story,dependancies:[...dependancies]  });
    this.setState({
      ...this.state,
      dialogOptions: {
        ...this.state.dialogOptions,
        story:{
          ...this.state.dialogOptions.story,
          dependancies:[...this.state.dialogOptions.story.dependancies]
        }
      }
    });
}
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
serviceWorker.register();