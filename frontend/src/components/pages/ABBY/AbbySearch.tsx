import * as React from 'react';
import axios from 'axios';
import AbbyResult from './AbbyResult';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import { cogsearch } from 'resources';
import Tooltip from 'components/common/Tooltip';
import { appConfig } from 'config';


export default function AbbySearch(props: any) {
    const [searchRes, setSearchRes] = React.useState<any[]>([]);
    const [ searchAnswer, setSearchAnswer ] = React.useState("");
    const [ isLoading, setIsLoading ] =  React.useState(true);
    const [ langData, setLangData ] = React.useState("");

    const index = appConfig.searchVariables.indexName;
    const lang = appConfig.searchVariables.language;
    const semsconf = appConfig.searchVariables.semanticConfigName;

    
    React.useEffect(() => {
        const searchAzure = async () => {
            if(props.searchText) {
                setLangData(lang);
                const body = {
                    q: props.searchText,
                    top: 3,
                    skip: 0,
                    type: "semantic",
                    lang: lang,
                    indexname: index,
                    semsconfig: semsconf
                };
                // /api/search is a proxy to the Azure Search API, https://abbysearchnode.azurewebsites.net
                axios.post('/api/search?', body)
                    .then(response => {
                        setSearchRes(response.data.results);
                        setSearchAnswer(response.data.answer)
                        let text;
                        if(response.data.results.length > 0) {
                            if(lang === "en-us") {
                                text = response.data.results.filter((doc: any) => doc.rerankerScore > 0.3).map((doc: any, index: number) => index+ ": "+doc.document.content + "\n page number: " + String(doc.pageNumber)).join("\n\n");
                            } else {
                                text = response.data.results.filter((doc: any) => doc.rerankerScore > 0.3).map((doc: any, index: number) => index+ ": "+doc.document.translated_text + "\n page number: " + String(doc.pageNumber)).join("\n\n");
                            }
                            props.handleLanguage(lang);
                            props.handleSearchResult(text);
                            const titlesAndSources = response.data.results.map((item: any)  => ({
                                title: item.document.title,
                                source: item.document.source,
                                page: item.document.pageNumber
                            }));
                            props.handleTitleSources(titlesAndSources);
                        } else {
                            text = "No results found";
                            props.handleSearchResult(text);
                            props.handleTitleSources([]);
                        }

                        setIsLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                    });       

                
            }
        };
        searchAzure();
        
    }, [props.searchText]);

    return (
        <>
        {
            isLoading
            ?
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
            :
            <Stack spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                <Stack spacing={2} direction="row" sx={{ display: "flex", alignItems: "center", margin: "10px" }}>
                    <Tooltip title="Azure Cognitive Search" placement="top">
                        <Avatar alt="search" src={cogsearch} sx={{padding: "4px", "& img": {objectFit: "contain"}}} />
                    </Tooltip>
                    <Typography variant="h6" sx={{ m: 4 }}>Search results</Typography>
                </Stack>
                {
                    searchAnswer && (
                        <Typography 
                        variant="body2" 
                        sx={{ m: 4, backgroundColor: "#b0dff96b", padding: "10px", borderRadius: "5px" }} 
                        dangerouslySetInnerHTML={{ __html: searchAnswer }}
                      />
                    )
                }
                <AbbyResult documents={searchRes} query={props.searchText} lang={langData} />
            </Stack>
        }
        </>
    )
}


