import React from "react";

import { AppBar, Divider, IconButton, Stack, Toolbar, Button } from "@mui/material";
import { brand_logo, MainLogo } from 'resources';
import { appConfig } from 'config';

import { styled, useTheme } from '@mui/material/styles';
import HeaderAvatarMenu from "./HeaderAvatarMenu";
import InputfieldABBY from "components/common/InputFieldABBY";

import Tooltip from 'components/common/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useAppDispatch } from "store/hooks";
import { openDialog } from 'store/ui/slice';
import SearchGuideDialog from "./SearchGuideDialog";

//import ShowData from "./ShowData";

const DivHeader = styled('div')({
  display: "flex",
  alignItems: "center"
});

const DivSearch = styled('div')({
  display: "flex",
  margin: "0px 20px",
  alignItems: "center",
  flexGrow: 1,
  justifyContent: "center",
});

const ImgHeader = styled('img')({
  width:"90px",
  height: "auto",
  marginLeft: "8px",
});

const ImgHeaderMain = styled('img')({
  width: "60px",
  margin: "10px",
  height: "auto",
  marginLeft: "20px",
  //borderRadius: "50%",
  //border: "1px solid  #e84338",
  //boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
});

const Span = styled('span')(({ theme }) => ({
  //background : "linear-gradient(to right, #c02529, #d43522)",
  //background: 'linear-gradient(45deg, #FF8F00 30%, #FFB74D 90%)',
  //background : "linear-gradient(to right, #007fff, #0059b2)",
  background: 'linear-gradient( #1E5645, #679889 )',
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  flexGrow: 1, 
  marginLeft: "30px",
  fontSize: "1.7rem",
  fontWeight: 600
 }));




const DivButtons = styled('div')({
  justifyContent: "flex-end",
  alignItems: "center",
});


const Header = (): React.ReactElement => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const handleInfoOpen = () => {
    dispatch(openDialog());
    console.log("open dialog");
  }

  return (
    <AppBar
      elevation={8}
      position="static"
      sx={{
        display: "flex",
        background: theme.palette.header.main,
        flexDirection: "row",
        borderBottom: "1px solid #e3e3e3",
      }}
    >
      <Toolbar sx={{width: "100%", minHeight: 20}}>
        <DivHeader>   
            <ImgHeaderMain alt="brand logo main" src={MainLogo} />
            <ImgHeader alt="brand logo" src={brand_logo} />
        </DivHeader>
        <Divider sx={{ margin: "0px 20px" }} orientation="vertical" flexItem />
        <Span> 
        {appConfig.appName}
        </Span>
       
          { appConfig.searchBarInHeader && (
            <DivSearch>
              <InputfieldABBY displayText={appConfig.searchVariables.searchInputPlaceholder} />
            </DivSearch>
          )}

          <Button variant="contained" startIcon={<InfoIcon />} color="secondary" onClick={handleInfoOpen}>
             Search Guide
          </Button>


        
            { appConfig.uploadEnabled && (
              <DivButtons>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Upload a new file" placement="bottom">
                    <IconButton sx={{margin: 0}}><HeaderAvatarMenu /></IconButton>
                  </Tooltip>
                </Stack>
              </DivButtons>
            )}  

      </Toolbar>
      <SearchGuideDialog />
      
    </AppBar>
  );
};

export default Header;
