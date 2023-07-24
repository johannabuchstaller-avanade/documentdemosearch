import React from "react";

import { styled, Tooltip as MuiTooltip, TooltipProps } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";


const StyledTooltip = styled<typeof MuiTooltip>(({ className, ...props }) => (
  <MuiTooltip {...props} classes={{ tooltip: className, arrow: className}} />
))``;


const Tooltip = (props: TooltipProps): React.ReactElement => {

  const theme = useTheme();
  return (
    <StyledTooltip
        arrow
        disableFocusListener
        leaveTouchDelay={0}
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: theme.palette.font.initials,
              padding: theme.spacing(3),
              fontSize: 14,
              color: theme.palette.background.highlight,
              boxShadow: theme.shadows[4],
              '& .MuiTooltip-arrow': {
                color: theme.palette.font.initials,
              },
            },
          },
        }}
        {...props}
  />
  );
};

export default Tooltip;