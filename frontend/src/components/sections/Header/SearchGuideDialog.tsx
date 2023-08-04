import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, Divider } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { closeDialog } from 'store/ui/slice';
import { selectOpenDialog } from 'store/ui/slice';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { appConfig } from 'config';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));


export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
  }
  
  function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 4, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }
  

export default function SearchGuideDialog() {

    const open = useAppSelector(selectOpenDialog);
    const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeDialog());
  };

  return (
      <BootstrapDialog
        open={open}
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        User Guide for Effective Search
        </BootstrapDialogTitle>
        <Divider />
        <DialogContent sx={{ m: 6}}>
          {/* <DialogContentText id="scroll-dialog-description" tabIndex={-1} component="div" sx={{ margin: 2, padding: 2}}>
            <Typography component="div" gutterBottom>
              <b>1. Be Specific:</b> Instead of searching for broad terms, try to narrow it down. For example, instead of searching &quot; dogs&quot;, try &quot; how to train puppies&quot;.
            </Typography>
            <Typography component="div" gutterBottom>
              <b>2. Use Clear and Detailed Questions:</b> When using the AI for questions, being detailed can help. Instead of &quot; weather&quot;, try &quot; what&apos;s the weather like in New York City today?&quot;
            </Typography>
            <Typography component="div" gutterBottom>
              <b>3. Use Keywords:</b> Highlighting the important parts of your question can be useful. If you&apos;re looking for specific information on a topic, include those specifics in your search.
            </Typography>
            <Typography component="div" gutterBottom>
              <b>4. Use Proper Names:</b> If you&apos;re searching for information about a specific person, place, or thing, make sure to include the exact name in your query.
            </Typography>
            <Typography component="div" gutterBottom>
              <b>5. Ask Directly:</b> When you&apos;re asking questions to an AI, you can usually be more direct than you would with a human. For example, instead of &quot; Can you tell me the time?&quot;, just ask &quot; What time is it?&quot;
            </Typography>
            <Typography component="div" gutterBottom>
              <b>6. Experiment:</b> If you&apos;re not getting the results you want, try changing your query. Using different words, or asking your question in a different way, can often yield better results.
            </Typography>
            <Typography component="div" gutterBottom>
              <b>7. Provide Context:</b> If your question refers to something specific, try providing more context. For example, instead of &quot; How tall is he?&quot;, you might ask &quot; How tall is LeBron James?&quot;
            </Typography>
            <br/>
            <Typography component="div" gutterBottom variant='caption'>
              <i><b>AI Response Disclaimer:</b> Remember, responses generated by AI models, such as OpenAI&apos;s GPT-3, are simulated and don&apos;t have access to real-time or personal data unless shared during the interaction. The AI&apos;s responses are based on patterns and information it learned during its training and do not necessarily reflect real-world up-to-date information or the views or beliefs of the AI developers. It&apos;s always good to cross-check important information from multiple sources.</i>
            </Typography>
          </DialogContentText> */}
          <DialogContentText id="scroll-dialog-description" tabIndex={-1} component="div" sx={{ margin: 2, padding: 2 }}>
            {appConfig.tips.map((tip, index) => (
              <Typography key={index} component="div" gutterBottom>
                <b>{index + 1}. {tip.title}:</b> <ReactMarkdown>{tip.description}</ReactMarkdown>
              </Typography>
            ))}
            <br/>
            <Typography component="div" gutterBottom variant='caption'>
              <i><b>AI Response Disclaimer:</b> {appConfig.disclaimer}</i>
            </Typography>
          </DialogContentText>
        </DialogContent>
      </BootstrapDialog>
  );
}
