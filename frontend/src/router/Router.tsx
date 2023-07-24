import React from "react";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Header from 'components/sections/Header/Header';
import LoadingScreen from "components/common/LoadingScreen";
import { LOADING_TEXT } from "constants/constants";

import { styled } from '@mui/material/styles';
import Toaster from "components/common/Toaster";
import { useAppDispatch } from "store/hooks";
import { initUserData } from "store/user/slice";


const Root = styled('div')(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
}));

const Content = styled('main')({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  //width: "100vw",
  marginTop: "1px",
});


const Homepage = React.lazy(() => import("components/pages/Homepage"));

const Router = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    const retrieveUser = localStorage.getItem('User');
    if(retrieveUser) {
      dispatch(initUserData(JSON.parse(retrieveUser)));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Root>
        <Header />
        <Content>
        <React.Suspense fallback={<LoadingScreen>{LOADING_TEXT}</LoadingScreen>}>
        <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/home' element={<Homepage />} />
        </Routes>
        </React.Suspense>
        </Content>
        <Toaster />
      </Root>
    </BrowserRouter>
  )
};

export default Router;
