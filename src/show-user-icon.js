import React from "react";


import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";

import LetterAvatars from './user-list';


export default function UserListIcon() {
  const [state, setState] = React.useState(false);

  const toggleDrawer = open => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <LetterAvatars></LetterAvatars>
    </div>
  );

  return (
    <div>
      <React.Fragment>
        <Button onClick={toggleDrawer(true)}><span _ngcontent-fih-c19="" className="material-icons icon-image-preview">supervisor_account</span></Button>
        <Drawer anchor={"right"} open={state} onClose={toggleDrawer(false)}>
          {list("right")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
