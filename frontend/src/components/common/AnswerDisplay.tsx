import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const TypographyItem = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
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
          <TypographyItem>
            <em>Answer: &nbsp;</em>
            <ReactMarkdown>
              {answer}
            </ReactMarkdown>
          </TypographyItem>
          {
            page
            ?
            <TypographyItem><em>Page Number: &nbsp;</em>&nbsp; {page}</TypographyItem>
            :
            null
          }
        </div>
        <Divider sx={{ marginBottom: "15px" }}/>
        <Typography variant="subtitle2" sx={{marginTop: "3px"}}><i>Click below for more details related to the context.</i></Typography>
        {/* <Stack direction="row" spacing={1} sx={{display: "flex", justifyContent: "space-between"}}>
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
          {
            source
            ?
            <Chip label={<a target="_blank" rel="noopener noreferrer" href={source}> source </a>} color="primary" variant="outlined" sx={{
              fontSize: "12px",
              maxWidth: "calc(50% - 4px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }} />
            :
            null
          }
          
          
        </Stack> */}
      </CardContent>
    </Card>

  );
}