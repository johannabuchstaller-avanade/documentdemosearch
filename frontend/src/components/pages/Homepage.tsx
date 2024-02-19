import React from "react"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { selectAppQuery, emptySearchQuery } from "store/ui/slice"
import { useAppSelector, useAppDispatch } from "store/hooks"
import AbbyMain from "./ABBY/AbbyMain"
// import SimpleChatPage from "./Chat/SimpleChatPage"
// import SimpleChatMenu from "./Chat/SimpleChatMenu"
import { appConfig } from "config"
import InputfieldABBY from "components/common/InputFieldABBY"
import { Search_Background } from "resources"
import Tooltip from "components/common/Tooltip"
import InfoIcon from "@mui/icons-material/Info"

import {
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Stack,
  Grid,
  FormControlLabel, Radio, RadioGroup, IconButton
} from "@mui/material"
import { selectSearchType, setSearchType } from "store/ui/slice"
// import ChatComponent from "./ChatComponent"


const Container = styled("div")(({ theme }) => ({
  margin: theme.spacing(8),
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  flexDirection: "column",
  flexGrow: 1,
  padding: theme.spacing(3),
}))

const SearchSection = styled("section")(({ theme }) => ({
  //margin: theme.spacing(4),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "350px",
  backgroundImage: `url(${Search_Background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}))

const Span = styled("span")(({ theme }) => ({
  //background : "linear-gradient(to right, #e84338, #b8261c)",
  //background : "linear-gradient(to right, #007fff, #0059b2)",
  background: "linear-gradient(to right, #266c57, #449f7b )",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "2.8rem",
}))

const SpanBrand = styled("span")(({ theme }) => ({
  background: "linear-gradient(to right, #8f33ff, #675978)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "24px",
  fontWeight: 500,
}))

const Section = styled("section")(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: "flex",
  height: "100%",
}))

const Homepage = () => {
  const queryApp = useAppSelector(selectAppQuery)
  const searchType = useAppSelector(selectSearchType)
  const dispatch = useAppDispatch()

  const handleChangeSearchType = (event: any) => {
    dispatch(setSearchType(event.target.value as string));
    dispatch(emptySearchQuery());
  }
  return (
    <>
      {!appConfig.searchBarInHeader && (
        <SearchSection>
          <Grid container spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
            <Grid item xs={8} sx={{ marginRight: "8px" }}>
              <InputfieldABBY
                displayText={appConfig.searchVariables.searchInputPlaceholder}
              />
            </Grid>
            <Grid item xs={2} sx={{ marginRight: "18px"}}>
              <Box width={240} bgcolor="white" p={2} borderRadius={1} sx={{display: "flex" }}>
                {/* <FormControl fullWidth sx={{ backgroundColor: "white" }}>
                  <InputLabel id="search-type-select-label">
                    Search Type
                  </InputLabel>
                  <Select
                    labelId="search-type-select-label"
                    id="search-type-select"
                    value={searchType}
                    label="Search Type"
                    onChange={handleChangeSearchType}
                    size="small"
                  >
                    <MenuItem value="full">Full</MenuItem>
                    <MenuItem value="semantic">Semantic</MenuItem>
                  </Select>
                </FormControl> */}
                  <FormControl fullWidth component="fieldset">
      <FormLabel component="legend" sx={{ fontSize: "0.6rem" }}>Search Type</FormLabel>
      <RadioGroup
        aria-label="search-type"
        name="search-type"
        value={searchType}
        onChange={handleChangeSearchType}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControlLabel value="full" control={<Radio size="small" />} label="Full" />
          <IconButton aria-label="info" size="small">
            <Tooltip title="Full text search is an approach in information retrieval that matches on plain text content stored in an index.">
              <InfoIcon sx={{ fontSize: 15 }} color="primary" />
            </Tooltip>
          </IconButton>
          <FormControlLabel value="semantic" control={<Radio size="small" />} label="Semantic" />
          <IconButton aria-label="info" size="small">
            <Tooltip title="Semantic Search: A focused search based on the meaning and context of your query.">
              <InfoIcon sx={{ fontSize: 15 }} color="primary" />
            </Tooltip>
          </IconButton>
        </Stack>
      </RadioGroup>
    </FormControl>
              </Box>
            </Grid>
          </Grid>
        </SearchSection>
      )}
      {queryApp ? (
        <AbbyMain />
      ) : (
        <>
          {appConfig.displayWelcomeMessage && (
            <Section>
              <Container>
                <Typography
                  variant="h2"
                  sx={{
                    color: "#0A1929",
                    marginBottom: "5px",
                    fontWeight: 600,
                    maxWidth: "80%",
                    fonFamily:
                      "PlusJakartaSans-ExtraBold,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
                  }}
                >
                  <Stack
                    direction="column"
                    spacing={0}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <Span>{`Welcome to ${appConfig.appName} Portal,`}</Span>
                    <SpanBrand>{appConfig.welcomeOneLiner}</SpanBrand>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#0A1929",
                        margin: "30px",
                        padding: "5px",
                        maxWidth: "80%",
                        fontFamily: "Space Mono, monospace",
                      }}
                    >
                      {appConfig.welcomeMessage}
                    </Typography>
                  </Stack>
                </Typography>
              </Container>
            </Section>
          )}
        </>
      )}
      {
      /* {
      appConfig.showChatbot && (
        <>
        <SimpleChatPage />
        <SimpleChatMenu />
        </>
      )
    } */
    }
    {/* <ChatComponent /> */}
    </>
  )
}

export default Homepage
