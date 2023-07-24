import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TableViewIcon from '@mui/icons-material/TableView';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import QuizIcon from '@mui/icons-material/Quiz';
import Button from '@mui/material/Button';
import { Link } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";


export default function AlignItemsList({cardtext, score, kind, keyphrases, source, page}: any) {

  const [showFullContent, setShowFullContent] = React.useState(false);


  const handleShowMoreClick = () => {
    setShowFullContent(true);
  };

  const handleShowLessClick = () => {
    setShowFullContent(false);
  };


  const renderCardText = () => {
    const truncatedText = cardtext.substring(0, 200);
    const highlightedText = keyphrases.reduce((text: any, keyword: any) => {
      const regex = new RegExp(keyword, 'gi');
      return text.replace(regex, `==${keyword}==`);
    }, truncatedText);

    if (showFullContent) {
      const fullHighlightedText = keyphrases.reduce((text: any, keyword: any) => {
        const regex = new RegExp(keyword, 'gi');
        return text.replace(regex, `==${keyword}==`);
      }, cardtext);

      return (
        <React.Fragment>
          <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >{cardtext}</ReactMarkdown>
          {/* <span dangerouslySetInnerHTML={{ __html:  fullHighlightedText}}></span> */}
          
          <Typography sx={{ paddingBottom: "0px" }} variant="caption" color="green" component="div"> Page Number: {page} </Typography>
          {cardtext.length > 200 && (
            <Button
              disableFocusRipple
              disableRipple
              variant="text"
              size="small"
              sx= {{ color: showFullContent ? '#fc7f12' : '#1287fc' }}
              onClick={handleShowLessClick}
            >
              Show less
            </Button>
          )}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {/* <span dangerouslySetInnerHTML={{ __html: highlightedText }}></span> */}
          <ReactMarkdown
                remarkPlugins={[remarkGfm]}
              >{highlightedText}</ReactMarkdown>
          {cardtext.length > 200 && (
            <Button
              disableFocusRipple
              disableRipple
              variant="text"
              size="small"
              sx= {{ color: showFullContent ? '#fc7f12' : '#00A36C' }}
              onClick={handleShowMoreClick}
            >
              ...  Show more
            </Button>
          )}
        </React.Fragment>
      );
    }
  };




  function renderContent(kind: string) {
    return kind === "table" ? (
      <Avatar alt={kind} sx={{ bgcolor: '#42a600'  }}>
        <TableViewIcon />
      </Avatar>
    ) :( kind === "paragraph" || kind === "text") ? (
      <Avatar alt={kind} sx={{ bgcolor: '#00affa'}}>
        <TextSnippetIcon />
      </Avatar>
    ) : (
      // <QuizIcon />
      <Avatar alt={kind} sx={{ bgcolor: '#00affa'}}>
        <TextSnippetIcon />
      </Avatar>
    );
  }
  
  return (
    <List sx={{ width: '100%', minWidth: 350, bgcolor: 'background.paper', borderRadius: "10px" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
            { renderContent(kind) }
        </ListItemAvatar>
        <ListItemText
          primary={
            <React.Fragment>

              <Link href={source} sx={{ paddingBottom: "0px", color: "blue" }} variant="body2" component="div">
                {source}
              </Link>
               <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {renderCardText()}
              </Typography>
            </React.Fragment>
          }
        />
        <Divider  variant="inset" component="div" orientation='vertical' />
        <Typography sx={{ paddingBottom: "0px" }} variant="caption" color="green" component="div"> Score: {((score/4)*100).toFixed(1)}%</Typography>
      </ListItem>
      
    </List>
  );
}