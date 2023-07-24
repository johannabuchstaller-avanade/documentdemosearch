import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

const TypographyItem = styled(Typography)(({ theme }) => ({
    display: "flex",
    fontSize: '14px',
    fontWeight: '400',
    margin: '15px 0',
    padding: "0 8px", 
}));


export default function AnswerDisplay({cardwidth, question, answer, source, title, page}: any) {
  return (
    <Card sx={{ width: cardwidth, m: 2, mb: 10, boxSizing: "border-box" }} raised>
      <CardContent sx={{ paddingBottom: "10px !important", padding: "10px" }}>
        <Stack direction="row" sx={{margin: 0, padding: 0}}><Typography variant="subtitle2" sx={{marginTop: "3px"}}>Question:  &nbsp;</Typography><Typography variant="subtitle1" fontStyle="italic" color="green">  &nbsp;{question}</Typography></Stack>
        <Divider sx={{ marginTop: "15px" }}/>
        <div style={{margin:"0px"}}>
          <TypographyItem><em>Answer: &nbsp;</em>&nbsp; {answer}</TypographyItem>
          {
            page
            ?
            <TypographyItem><em>Page Number: &nbsp;</em>&nbsp; {page}</TypographyItem>
            :
            null
          }
        </div>
        <Divider sx={{ marginBottom: "15px" }}/>
        <Stack direction="row" spacing={1} sx={{display: "flex", justifyContent: "space-between"}}>
          {
            title
            ?
            <Chip label={"title: "+title} color="success" variant="outlined" sx={{
              fontSize: "12px",
              maxWidth: "calc(50% - 4px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }} />
            :
            null
          }
          
          <Chip label={"source: "+source} color="primary" variant="outlined" sx={{
            fontSize: "12px",
            maxWidth: "calc(50% - 4px)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }} />
        </Stack>
      </CardContent>
    </Card>

  );
}