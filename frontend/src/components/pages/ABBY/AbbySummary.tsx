import React from 'react';
import { Avatar, Paper, Stack, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { handleSummarizeAva } from 'actions/openaiAnswer';
// import useWebSocket from 'react-use-websocket';
import { openai } from 'resources';
import Tooltip from 'components/common/Tooltip';

export default function AbbySummary(props: any) {
    const [ summary, setSummary ] = React.useState('');
    const [ isLoading, setIsLoading ] = React.useState(true);   
    // const { sendMessage, lastMessage } = useWebSocket('ws://localhost:3000/backend');
    
    React.useEffect(() => {
        const generateSummary = async() => {
            if(props.searchText) {
                setIsLoading(true);
            
                handleSummarizeAva(props.context, props.searchText)
                .then((result) => {
 
                    setSummary(result)
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error(error);
                  });
            }
        }
        generateSummary();
        setIsLoading(true);
        // sendMessage(JSON.stringify({
        //     context: props.context,
        //     searchText: props.searchText
        //   }));
        
        }, [props.searchText, props.context]);
    // React.useEffect(() => {
    //         if (lastMessage !== null) {
    //           const result = JSON.parse(lastMessage.data);
    //           setSummary(result);
    //           setIsLoading(false);
    //         }
    //       }, [lastMessage, props.titlesources]);

    return (
        <Stack spacing={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: '100%', boxSizing: 'border-box' }}>
         <Stack spacing={2} direction="row" sx={{ display: "flex", alignItems: "center", margin: "10px" }}>
                    <Tooltip title="OpenAI GPT-3" placement="top">
                        <Avatar alt="search" src={openai} sx={{padding: "4px", "& img": {objectFit: "contain"}}} />
                    </Tooltip>
                    <Typography variant="h6" sx={{ m: 4 }}>Summary</Typography>
            </Stack>
        {
            isLoading
            ?
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <CircularProgress />
            </Box>
            :
            <Paper elevation={3} sx={{ p: 2, display: "flex", alignItems: "center", width: '100%', boxSizing: 'border-box' }}>
            <Typography variant="body1" sx={{ m: 4 }}>{summary}</Typography>
            </Paper>
        }
        </Stack>

        
      );
};
