import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import AnswerDisplay from 'components/common/AnswerDisplay';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { openai } from 'resources';
import Tooltip from 'components/common/Tooltip';
import { handleFetchAzureOpenAIanswerJsonApp, handleFetchAzureOpenAIanswerJsonAppDE } from 'actions/openaiAnswer';

export default function AbbyAnswer(props: any) {
    const [ answertext, setAnswertext ] = React.useState('');
    const [ titlesource, setTitlesource ] = React.useState<any>();
    const [ isLoading, setIsLoading ] = React.useState(true);
 
    

    React.useEffect(() => {
        const generateAnswer = async() => {
            if(props.searchText) {

                setIsLoading(true);
                if(props.language === "en-us") {

                    handleFetchAzureOpenAIanswerJsonApp(props.context, props.searchText)
                    .then((result) => {
    
                        setAnswertext(result.answer)

                        setTitlesource(props.titlesources[result.context]);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                } else {
                    handleFetchAzureOpenAIanswerJsonAppDE(props.context, props.searchText)
                    .then((result) => {
    
                        setAnswertext(result.answer)

                        setTitlesource(props.titlesources[result.context]);
                        console.log(props.titlesources[result.context]);
                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                    });
                }
            }
        }
        generateAnswer();
        
        }, [props.searchText]);
   

    return (
        <Stack spacing={2} sx={{ display: "flex", alignItems: "center", width: "100%", boxSizing: "border-box" }}>

            <Stack spacing={2} direction="row" sx={{ display: "flex", alignItems: "center", margin: "10px" }}>
                    <Tooltip title="OpenAI GPT-3" placement="top">
                        <Avatar alt="search" src={openai} sx={{padding: "4px", "& img": {objectFit: "contain"}}} />
                    </Tooltip>
                    <Typography variant="h6" sx={{ m: 4 }}>Answer</Typography>
            </Stack>
            {
                isLoading
                ?
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <CircularProgress />
                </Box>
                :
                <>
                {
                    titlesource
                    ?
                    <AnswerDisplay cardwidth={"100%"} question={props.searchText} answer={answertext} source={titlesource.source} title={titlesource.title} page={titlesource.page} />
                    :
                    <AnswerDisplay cardwidth={"100%"} question={props.searchText} answer={answertext} source="" title="" page="" />
                }
                </>
            }
        </Stack>
      );
};
