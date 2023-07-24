import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function CardDisplay({cardwidth, cardtext}: any) {
  return (
    <Card sx={{ minWidth: cardwidth, m: 5 }} variant="outlined">
      <CardContent>
        <Typography variant="body2">
          {cardtext}
        </Typography>
      </CardContent>
    </Card>
  );
}