import * as React from "react"
import { useTheme } from "@mui/material/styles"
import Zoom from "@mui/material/Zoom"
import Fab from "@mui/material/Fab"
import { openChat, selectChatOpen } from "store/ui/slice"
import { useAppDispatch, useAppSelector } from "store/hooks"
import { ABBY, JTI_BOT } from "resources"

export default function SimpleChatPage() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const chatOpen = useAppSelector(selectChatOpen)

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }

  const handleChatIconClick = () => {
    
    dispatch(openChat())
  }

  return (
    <Zoom
      in={true}
      timeout={transitionDuration}
      style={{
        transitionDelay: `${transitionDuration.exit}ms`,
      }}
      unmountOnExit
    >
      <Fab
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "white",
        }}
        style={{ display: chatOpen ? "none" : "block", color: "white" }}
        aria-label="smart chat"
        color="default"
        // color="white"
        onClick={handleChatIconClick}
      >
        <img
          src={JTI_BOT}
          alt="ABBY"
          width="45px"
          height="45px"
          style={{padding: "5px", marginTop: "5px" }}
        />
      </Fab>
    </Zoom>
  )
}
