import React, { PropsWithChildren } from "react";

import { Typography, useTheme, Theme } from "@mui/material";
import { styled } from '@mui/material/styles';
import { ThreeDots } from "react-loader-spinner";

const Container = styled('div')(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  height: "100vh",
  width: "100vw",
  zIndex: 1500,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  display: "flex",
  background: theme.palette.background.default,
}));


type LoadingScreenProps = PropsWithChildren<{
  animation?: boolean;
}>;

const LoadingScreen = (props: LoadingScreenProps): React.ReactElement => {
  const { children, animation = true } = props;

  const theme = useTheme();
  const color = theme.palette.mode === "dark" ? theme.palette.common.white : theme.palette.primary.main;
  const miliseconds = 1200000; //2 min

  const [show, setShow] = React.useState(true);

  React.useEffect(() => {
    const timeout = setTimeout(() => setShow(false), miliseconds);
    return () => clearTimeout(timeout);
  }, []);

  return show ? (
    <Container>
      {animation && <ThreeDots color={color} height={30} width={100} />}
      <div>
        <Typography variant='h5' color={color}>
          {children}
        </Typography>
      </div>
      </Container>
  ) : (
    <div />
  );
};

export default LoadingScreen;
