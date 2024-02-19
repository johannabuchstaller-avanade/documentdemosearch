import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import AnswerDisplay from 'components/common/AnswerDisplay';
import { openai } from 'resources';
import Tooltip from 'components/common/Tooltip';
import { handleFetchGPT4 } from 'actions/openaiAnswer';
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setLoading, selectLoading } from 'store/ui/slice';

export default function AbbyAnswer(props: any) {
    const [ answertext, setAnswertext ] = React.useState('');  
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectLoading);

    React.useEffect(() => {
        dispatch(setLoading(true));
        
        const generateAnswer = async() => {
            if(props.searchText) {
           
                handleFetchGPT4(props.context, props.searchText)
                .then((result) => {
                                     
                        setAnswertext(result)
                        dispatch(setLoading(false));
                    
                })
                .catch(error => {
                    console.error(error);
                });
                
            }
        }
        generateAnswer();
        
        }, [props.searchText, props.context, setLoading]);
   

    return (
        <>
        { !loading && (
            <Stack spacing={2} sx={{ display: "flex", alignItems: "center", width: "100%", boxSizing: "border-box" }}>

                <Stack spacing={2} direction="row" sx={{ display: "flex", alignItems: "center", margin: "10px" }}>
                        <Tooltip title="OpenAI GPT-3" placement="top">
                            <Avatar alt="search" src={openai} sx={{padding: "4px", "& img": {objectFit: "contain"}}} />
                        </Tooltip>
                        <Typography variant="h6" sx={{ m: 4 }}>Answer</Typography>
                </Stack>
                <AnswerDisplay cardwidth={"100%"} question={props.searchText} answer={answertext} source="" title="" page="" />
            </Stack>  
        )}
        </>      
      );
};
