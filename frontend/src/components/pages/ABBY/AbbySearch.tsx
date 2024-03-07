import * as React from "react"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { Avatar } from "@mui/material"
import { cogsearch } from "resources"
import Tooltip from "components/common/Tooltip"
import { useAppDispatch, useAppSelector } from "store/hooks"
import { appConfig } from "config"
import { setLoading, selectLoading, selectSearchType } from "store/ui/slice"
import AccordionResult from "./AccordionResult"
import { getSearchResults } from 'actions/chatjticonnect';


export default function AbbySearch(props: any) {
  const [searchRes, setSearchRes] = React.useState<any[]>([])
  
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoading)

  const lang = appConfig.searchVariables.language
 

  React.useEffect(() => {
    dispatch(setLoading(true))

    const searchAzure = async () => {
      if (props.searchText) {
        	
        getSearchResults(props.searchText)
          .then((response) => {
       
            if (response.data.results.length > 0) {
               const titlesAndSources = response.data.results.map((item: any) => ({
                  id: item.document.id,
                  title: item.document.title,
                  source: item.document.document_filename,
                  page: item.document.page_number,
                  content: item.document.content,
                  score: item.score,
                  dataType: item.document.dataType,
                  documentSourceLink: item.document.document_link,
                  html: item.document.content_html,
                  filename: item.document.document_filename
              }));

              setSearchRes(titlesAndSources)
                   let text = titlesAndSources
                    .filter((doc: any) => doc.score > 0.5)
                    .map(
                      (doc: any, index: number) =>
                        `Context ${index + 1}:\n\n ${
                          doc.content
                        }\n\n document Name: ${
                          doc.source
                        }\n\n page number: ${String(doc.page)
                        }`
                    )
                    .join("\n\n")

                 
    
                  props.handleTitleSources(titlesAndSources);
                  props.handleLanguage(lang)
                  props.handleSearchResult(text)
            } else {
              let text = "No results found"
              props.handleSearchResult(text)
              props.handleTitleSources([])
            }
          })
          .catch((error) => {
            console.error("Error in search: ", error)
            // Handle error state or notify user here
          })
      }
    }
    
    searchAzure()
  }, [props.searchText, setLoading])

  return (
    <>
      {!loading && (
        <Stack spacing={2} sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Stack
            spacing={2}
            direction="row"
            sx={{ display: "flex", alignItems: "center", margin: "10px" }}
          >
            <Tooltip title="Azure Cognitive Search" placement="top">
              <Avatar
                alt="search"
                src={cogsearch}
                sx={{ padding: "4px", "& img": { objectFit: "contain" } }}
              />
            </Tooltip>
            <Typography variant="h6" sx={{ m: 4 }}>
              Search results 
            </Typography>
          </Stack>
          {/* {
                    searchAnswer && (
                        <Typography 
                        variant="body2" 
                        sx={{ m: 4, backgroundColor: "#b0dff96b", padding: "10px", borderRadius: "5px" }} 
                        dangerouslySetInnerHTML={{ __html: searchAnswer }}
                      />
                    )
                } */}
          {/* <AbbyResult documents={searchRes} query={props.searchText} /> */}
          <Stack spacing={2} sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            {searchRes.length > 0 ? (
              <>
                {searchRes.map((result: any, index: number) => {
                  return (
                    <div key={index} style={{ width: "100%", margin: "3px" }}>
                      <AccordionResult
                        value={index}
                        kind={result.dataType}
                        source={result.source}
                        page={result.page}
                        html={result.html}
                        title={result.title}
                        pdfUrl={result.documentSourceLink}
                        documentSourceLink={result.documentSourceLink}
                        id={result.id}
                        filename={result.filename}
                      />
                    </div>
                  )
                })}
              </>
            ) : (
              <div style={{ width: "100%", margin: "3px" }}>
                <AccordionResult
                  value={0}
                  kind={"paragraph"}
                  source={""}
                  page={""}
                  html={"No results found"}
                  title={""}
                  pdfUrl={""}
                  documentSourceLink={""}
                  filename={""}
                  id={""}
                />
              </div>
            )}
          </Stack>
        </Stack>
      )}
    </>
  )
}
