import React, { FC } from "react";
import AppStyled from "./AppStyled";
import MainPage from "./layout/MainPage";

const App: FC = () => {
    return (
        <AppStyled>
            <MainPage/>
        </AppStyled>
    );
};

export default App;
