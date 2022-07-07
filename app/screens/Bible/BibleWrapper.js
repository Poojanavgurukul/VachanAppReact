import React from "react";
import Bible from "./Bible";
import LoginDataProvider from "../../context/LoginDataProvider";
import BibleContextProvider from "../../context/BibleContextProvider";
const BibleWrapper = (props) => {
  return (
    <LoginDataProvider navigation={props.navigation}>
      <BibleContextProvider navigation={props.navigation}>
        <Bible navigation={props.navigation} />
      </BibleContextProvider>
    </LoginDataProvider>
  );
};

export default BibleWrapper;
