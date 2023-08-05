import React from 'react';
import { styled  } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { selectAppQuery } from 'store/ui/slice';
import {  useAppSelector } from 'store/hooks';
import AbbyMain from './ABBY/AbbyMain';
import SimpleChatPage from './Chat/SimpleChatPage';
import SimpleChatMenu from './Chat/SimpleChatMenu';
import { appConfig } from 'config';
import InputfieldABBY from 'components/common/InputFieldABBY';
import { Search_Background } from 'resources';
import { Stack } from '@mui/material';


const Container = styled('div')(({ theme }) => ({
  margin: theme.spacing(8),
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const SearchSection = styled('section')(({ theme }) => ({
  //margin: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '350px',
  backgroundImage: `url(${Search_Background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));



const Span = styled('span')(({ theme }) => ({
 //background : "linear-gradient(to right, #e84338, #b8261c)",
 //background : "linear-gradient(to right, #007fff, #0059b2)",
 background: 'linear-gradient(to right, #266c57, #449f7b )',
 WebkitBackgroundClip: "text",
 WebkitTextFillColor: "transparent",
 fontSize: "2.8rem",
}));

const SpanBrand = styled('span')(({ theme }) => ({
  background : "linear-gradient(to right, #8f33ff, #675978)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "24px",
  fontWeight: 500,
 }));

const Section = styled('section')(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  height: '100%',
}));


const Homepage = () => {
  const queryApp = useAppSelector(selectAppQuery);
  return(
    <>
    { !appConfig.searchBarInHeader && (
      <SearchSection>
        <InputfieldABBY displayText={appConfig.searchVariables.searchInputPlaceholder} />
      </SearchSection> 
    )}
    {
      queryApp 
      ? 
      <AbbyMain />	
      :
      <>
        {
        appConfig.displayWelcomeMessage && (
        <Section>
          <Container>
            <Typography variant='h2' sx ={{ color: "#0A1929", marginBottom: "5px", fontWeight: 600, maxWidth: "80%", fonFamily: "PlusJakartaSans-ExtraBold,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol" }}>
              <Stack direction="column" spacing={0} sx={{display: "flex", justifyContent: "flex-start", alignItems: "center",marginBottom: "5px"}}>
                 <Span>{`Welcome to ${appConfig.appName} Portal,`}</Span> 
                 <SpanBrand>{appConfig.welcomeOneLiner}</SpanBrand> 
                 <Typography variant='body2'  sx ={{ color: "#0A1929", margin: "30px", padding: "5px", maxWidth: "80%", fontFamily: "Space Mono, monospace"}}>
                    {appConfig.welcomeMessage}
                </Typography>
              </Stack>
            </Typography>
            
          </Container>
        </Section>
        )
        }
    </>

    }
    {
      appConfig.showChatbot && (
        <>
        <SimpleChatPage />
        <SimpleChatMenu />
        </>
      )
    }
    </>

  );
}

export default Homepage;