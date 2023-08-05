import React, { useEffect, useRef, useState } from "react";
import { createStore, createDirectLine, renderWebChat } from 'botframework-webchat';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import MinimizeIcon from '@mui/icons-material/Minimize';
import { closeChat } from "store/ui/slice";
import { useAppDispatch } from "store/hooks";
import { ABBY, JTI_BOT } from "resources";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'

const headerwidth = '50px';
const headermargin = '10px';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#370375',
  height: headerwidth
}));

const CustomizedChat = () => {
  const webchatRef = useRef(null);
  const [token, setToken] = useState(null);
  const [conversationId, setConversationId] = useState('');
  const dispatch = useAppDispatch()

  const handleChatBodyClose = () => {
    dispatch(closeChat());
  };
  const tokenEndpoint = "https://default0a33ec0d284248b3bf55af2499c326.3a.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr49b_webby/directline/token?api-version=2022-03-01-preview";
  const chatEndpoint =  "https://prod-55.westus.logic.azure.com:443/workflows/adc23d201468491083abc81bb1118647/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=U5CWHGhJaR0J0ruUlnYgCyQZFCM_4_T4CjGAClIk9Ms";

  const environmentEndPoint = tokenEndpoint.slice(0,tokenEndpoint.indexOf('/powervirtualagents'));
  const apiVersion = tokenEndpoint.slice(tokenEndpoint.indexOf('api-version')).split('=')[1];
  const regionalChannelSettingsURL = `${environmentEndPoint}/powervirtualagents/regionalchannelsettings?api-version=${apiVersion}`;

  const styleOptions = {
    hideUploadButton: true,
    botAvatarInitials: 'JTI',
    userAvatarInitials: 'SB',
    avatarBorderRadius: '0%',	
    accent: '#007fff',
    botAvatarImage: JTI_BOT,
    userAvatarImage: '',
    botAvatarBackgroundColor: 'transparent',
    bubbleBackground: "#f5f2f2",
    bubbleBorderColor: "#f5f2f2",
    bubbleBorderRadius: "10px",
    bubbleTextColor: "Black",
    bubbleFromUserBorderRadius: "10px",
    bubbleFromUserTextColor: "White",
    bubbleFromUserBackground: "#370375",
    bubbleFromUserBorderColor: "#370375"
}; 

// Initialization function
const initialize = async() => {

  await fetch(regionalChannelSettingsURL)
    .then(response => response.json())
    .then(data => {
      const directline = data.channelUrlsById.directline;

      fetch(tokenEndpoint)
        .then(response => response.json())
        .then(conversationInfo => {
          setToken(conversationInfo.token)
          const directLineInstance = createDirectLine({
              domain: `${directline}v3/directline`,
              token: conversationInfo.token,
            });

            setConversationId(conversationInfo.conversationId);

          directLineInstance.postActivity({
            from: { id: 'YOUR_USER_ID', name: 'YOUR_USER_NAME' },
            name: 'startConversation',
            type: 'event',
            value: 'welcome'
          }).subscribe(
            id => console.log(`Posted activity, assigned ID ${id}`),
            error => console.log(`Error posting activity ${error}`)
          );


          const store = createStore({}, ({ dispatch }: any) => (next: any) => (action: any) => {
            if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
              const { activity } = action.payload;
      
              if (activity.type === 'message' && activity.from.role === 'bot') {
                  activity.text = activity.text.replace('Abby', 'JTI bot');
              }
          }
            if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
              dispatch({
                type: 'WEB_CHAT/SEND_EVENT',
                payload: {
                  name: 'webchat/join',
                  value: { from: 'YOUR_USER_ID' }
                }
              });
            }
            return next(action);
          });

          renderWebChat(
            {
              directLine: directLineInstance,
              styleOptions,
              store,
              overrideLocalizedStrings: {
                  TEXT_INPUT_PLACEHOLDER: 'Chat with JTI bot ...'
                }
            },
            webchatRef.current
          );
        })
        .catch(err => console.error("An error occurred: " + err));
    })
    .catch(err => console.error("An error occurred: " + err));
};

// Refresh function
const handleRefresh = async() => {

  if(conversationId  !== '') {

    const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          session: conversationId
        })
    });

    if (response.ok) {
        console.log("Successfully deleted the history and refreshed the chat");
    }

    if (!response.ok) {
        console.error("Failed to trigger the flow");
    }
    await initialize();
  }
  

};


// useEffect call
useEffect(() => {
  initialize();

}, []);

  return (
    <div>
      <StyledAppBar position="static">
        <Toolbar>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: '100%',
                pl: 2, // padding-left: 8px
                flexGrow: 1,
                marginLeft: "5px",
                marginBottom: '5px'
            }}
            >
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{  color: 'white' }}
                        >
                            JTI bot
                        </Typography>
            </Box>
          <IconButton
            sx={{ marginRight: '2px', marginBottom: '5px' }}
            onClick={() => handleRefresh()}
            aria-label="refresh"
          >
            <RefreshIcon sx={{ fontSize: '30px', color: 'white' }} />
          </IconButton>
          <IconButton
            sx={{ marginRight: '2px', marginBottom: '5px' }}
            onClick={handleChatBodyClose}
            aria-label="minimize"
          >
            <MinimizeIcon sx={{ fontSize: '30px', color: 'white' }} />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      <div style={{position: 'absolute', height: `calc(100% - ${headerwidth} - ${headermargin})`, width: '100%', marginTop: headermargin }} ref={webchatRef} role="main"></div>
    </div>
  );
}

export default CustomizedChat;
