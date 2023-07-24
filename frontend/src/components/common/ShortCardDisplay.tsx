import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function ShortCardDisplay({cardwidth, cardtext, score}: any) {
  return (
    <Card sx={{ minWidth: cardwidth, m: 5 }} variant="outlined">
      <CardContent sx={{m: 1, p:3, pb: "6px !important"}}>
        <Typography variant="body2">
            {
                cardtext.length > 300
                ? 
                cardtext.substring(0, 300) + "..."	
                : 
                cardtext
            
            }
        </Typography>
        <Divider light />
        <Typography sx= {{ paddingBottom: "0px" }} variant="caption" color="green"> Score: {score.toFixed(3)} </Typography>
      </CardContent>
    </Card>
  );
}