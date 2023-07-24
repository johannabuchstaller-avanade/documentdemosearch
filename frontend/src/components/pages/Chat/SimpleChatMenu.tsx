import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { closeChat, selectChatOpen } from "store/ui/slice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { Card, CardContent, CardMedia } from '@mui/material';

import CustomizedChat from './CustomizedChat';

export default function SimpleChat(props: any) {

  const dispatch = useAppDispatch();
  
  const chatOpen = useAppSelector(selectChatOpen);
  const handleChatBodyClick = (e: any) => {
    e.stopPropagation();

    
  };

  const handleChatBodyClose = () => {
    dispatch(closeChat())
 
  };
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '999',
      }}
    >
        <Paper
          onClick={handleChatBodyClick}
          sx={{
            position: 'absolute',
            width: '500px',
            height: '600px',
            bottom: 24,
            right: 24,
            pointerEvents: 'auto',
            overflow: 'hidden', 
            visibility: chatOpen ? 'visible' : 'hidden',
          }}
        >
          <Card sx={{ height: '100%' }}>
             <CardContent sx={{padding: 0, margin: 0}}>
        <CustomizedChat />
      </CardContent>
          </Card>
        </Paper>
    </Box>
  );
}
