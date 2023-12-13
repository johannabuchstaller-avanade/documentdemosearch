import React from 'react';
import { styled, useTheme  } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import AbbySearch from './AbbySearch';
import AbbyAnswer from './AbbyAnswer';
import { Divider, CircularProgress, Box } from '@mui/material';
import { selectAppQuery, selectLoading } from 'store/ui/slice';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAppSelector } from 'store/hooks';
import AbbySummary from './AbbySummary';
import Grid from '@mui/material/Grid';
import { appConfig } from 'config';


const Section = styled('section')(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '100%'
}));

const AbbyMain = () => {
  const theme = useTheme();
  
  const querySearch = useAppSelector(selectAppQuery);
  const loading = useAppSelector(selectLoading);

  const [ context, setContext ] = React.useState<object[]>([]);
  const [ language, setLanguage ] = React.useState<string>(''); 
  const [titlesources, setTitlesources] = React.useState<object[]>([]);
  
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  

  const handleSearchResult = React.useCallback((result: object[]) => {
    setContext(result);
  }, []);

  const handleTitleSources = React.useCallback((result: object[]) => {
    setTitlesources(result);
  }, []);

  const handleLanguage = React.useCallback((result: string) => {
    setLanguage(result);
  }, []);

  return(
    <Section>
      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
        <Grid item xs={isSmallScreen ? 12 : 7} sx={{ marginRight: "8px"}}>
          <Stack direction="column" spacing={2} sx={{ alignItems: 'center' }}>
            {
              loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                  <CircularProgress />
                </Box>
              )
            }
            {querySearch && (
              <>
              {
                  context.length > 0 && (
                      <AbbyAnswer 
                        searchText={querySearch} 
                        context={context} 
                        titlesources={titlesources} 
                        language={language}
                        loading={loading}
                      />
                  )
              }
              </>
              
            )}
            {
              !loading && (
                <Divider light sx={{ width: '100%' }} />
              )
            }

            {
              querySearch && (
                <AbbySearch 
                searchText={querySearch} 
                handleSearchResult={handleSearchResult} 
                handleTitleSources={handleTitleSources} 
                handleLanguage={handleLanguage}
                loading={loading}
              />
              )
            }
          </Stack>
        </Grid>
        {appConfig.showSummary && (
          <>
            <Divider orientation="vertical" flexItem />
            <Grid item xs={isSmallScreen ? 12 : 4} sx={{ width: '100%', marginLeft: "8px" }}>
              {querySearch && context.length > 0 && (
                <AbbySummary searchText={querySearch} context={context} />
              )}
            </Grid> 
          </>
        )}
      </Grid>
    </Section>
  );
}

export default AbbyMain;
