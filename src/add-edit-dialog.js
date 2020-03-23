import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";


import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import {cloneDeep} from 'lodash';
import IconButton from "@material-ui/core/IconButton";

import DeleteIcon from "@material-ui/icons/Delete";

const DependancyContainer = styled.div`
 
 
`;
const DependancyContainerWrap = styled.div`
  display: flex;
`;
const DependancyActionContainer = styled.div``;
const DependancyAction = styled.div`
  display: flex;
  margin-left: 8px;
  
`;
const ButtonWrap = styled.div`

`;

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%"
    }
  }
}));

export default function FormDialog(props) {
  const {storyId,isAddmode,story,handleTitleChange,handleDescChange,handleEpicChange,addMoreRisks,handleRiskChange,handleDependancyChange,removeRisk,addMoreDeps,removeDependancy}=props;
  const classes = useStyles();

  const handleClose = () => {
    if(story.epic){
      props.handleFormSubmit(storyId,isAddmode,cloneDeep(story));
    }
    
  };
 



 


  
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose} 
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{props.isAddmode?"Add a new Story":"Edit Story"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          {props.isAddmode?"A new story with the provided data will be created and added to TODO section":"An existing Story is being edited"}
          </DialogContentText>
          <form className={classes.root}  autoComplete="off">
            <div>
              <TextField
                id="story-text"
                label="Story Titile"
                value={story.title}
                onChange={handleTitleChange}
                variant="outlined"
              />
              <TextField
                id="Epic"
                label="EpiC details"
                value={story.epic}
                required
                onChange={handleEpicChange}
                variant="outlined"
              />
              <TextField
                id="outlined-multiline-static"
                label="Story Description"
                multiline
                rows="4"
                value={story.description}
                onChange={handleDescChange}
                variant="outlined"
              />
              <DependancyContainerWrap>
                <DependancyContainer>
                  {story.dependancies.map((dep, index) => (
                    <DependancyAction  key={index}>
                      <TextField
                       
                        id={dep + "index"}
                        label={"Dependancy " + index}
                        multiline
                        rows="2"
                        value={dep}
                         onChange={(e)=>{handleDependancyChange(e,index)}}
                        variant="outlined"
                      />
                       <ButtonWrap> <IconButton onClick={()=>{removeDependancy(index)}} aria-label="delete">
                  <DeleteIcon />
                </IconButton></ButtonWrap>
                     
                    </DependancyAction>
                  ))}
                  <DependancyActionContainer>
                    <DependancyAction>
                      <Button onClick={addMoreDeps} variant="contained" color="primary">
                        Add Deps
                      </Button>
                    </DependancyAction>
                  </DependancyActionContainer>
                </DependancyContainer>
                <DependancyContainer>
                  {story.risks.map((risk, index) => (
                    <DependancyAction key={index}>
                      <TextField
                        
                        id={risk + "index"}
                        label={"Risk " + index}
                        value={risk}
                        multiline
                        rows="2"
                        onChange={(e)=>{handleRiskChange(e,index)}}
                        variant="outlined"
                      />
                      <ButtonWrap>
                      
                        <IconButton onClick={()=>{removeRisk(index)}}  aria-label="delete">
                  <DeleteIcon />
                </IconButton>
                      </ButtonWrap>
                    </DependancyAction>
                  ))}
                  <DependancyActionContainer>
                    <DependancyAction>
                      <Button onClick={addMoreRisks} variant="contained" color="primary">
                        Add Risks
                      </Button>
                    </DependancyAction>
                  </DependancyActionContainer>
                </DependancyContainer>
              </DependancyContainerWrap>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
        <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
