import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

const Img = styled('img')({
    width: "30%",
    height: "auto",
    margin: "10px",
    display: "flex",
    alignContent: "center",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
    borderRadius: "10px",
});

const SimpleImg = styled('img')({
    width: "30%",
    height: "auto",
    margin: "10px",
    display: "flex",
    alignContent: "center"
});

const TypographyItem = styled(Typography)(({ theme }) => ({
    display: "flex",
    fontFamily: "Space Mono, monospace",
    color: "#bf6206",
    fontWeight: '700',
    margin: '15px',
    padding: theme.spacing(2),
    textAlign: "center",
    background: "linear-gradient(90deg, rgba(255,106,0,1) 49%, rgba(17,17,255,1) 100%, rgba(17,17,255,1) 100%);",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  }));

  const Span = styled('span')(({ theme }) => ({
    background : "linear-gradient(to right, #007fff, #0059b2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
 }));


export default function BrandDisplay({imgsrc, brandtitle, brandInfo, imgwidth, displayborder}: any) {
  return (
    <Stack direction="row" spacing={0} sx={{width: "80%", alignItems: "center" }}> 
        {
            displayborder 
            ?
            <Img src={imgsrc} alt={brandtitle} sx={{width: imgwidth}}/>
            :
            <SimpleImg src={imgsrc} alt={brandtitle} sx={{width: imgwidth}}/>
        }
       
        <Stack spacing={2} sx={{width: "100%", alignItems: "center" }}>
            <TypographyItem sx={{fontSize: "52px"}} variant="h2" gutterBottom>
                {brandtitle}
            </TypographyItem>
            <Divider orientation="vertical" flexItem />
            <Typography variant='body1' sx ={{ color: "#0A1929", marginBottom: "20px", fontWeight: 600, maxWidth: "80%", fonFamily: "PlusJakartaSans-ExtraBold,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol" }}>
                <Span>{brandInfo}</Span>
            </Typography>
        </Stack>
    </Stack>
  );
}