import * as React from 'react';
import axios from 'axios';
import AbbyResult from './AbbyResult';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import { cogsearch } from 'resources';
import Tooltip from 'components/common/Tooltip';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { appConfig } from 'config';
import { setLoading, selectLoading } from 'store/ui/slice';

export default function AbbySearch(props: any) {
    const [searchRes, setSearchRes] = React.useState<any[]>([]);
    const [ searchAnswer, setSearchAnswer ] = React.useState("");
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectLoading);
    
    const [ langData, setLangData ] = React.useState("");

    const index = appConfig.searchVariables.indexName;
    const lang = appConfig.searchVariables.language;
    const semsconf = appConfig.searchVariables.semanticConfigName;

    
    React.useEffect(() => {
        dispatch(setLoading(true));
        const searchAzure = async () => {
            if(props.searchText) {
                setLangData(lang);

                const body = {
                    q: props.searchText,
                    top: 3,
                    skip: 0,
                    type: "full",
                    lang: lang,
                    indexname: index,
                    semsconfig: semsconf
                };
                // /api/search is a proxy to the Azure Search API, https://wedocumentsearchdemocaseapi.azurewebsites.net/api/search?
                axios.post('https://wedocumentsearchdemocaseapi.azurewebsites.net/api/search?', body)
                    .then(response => {
                        //console.log(response.data);
                        console.log("Search succeeded!")
                        setSearchRes(response.data.results);
                        setSearchAnswer(response.data.answer)
                        let text;
                        if(response.data.results.length > 0) {
                            //text = response.data.results.filter((doc: any) => doc.rerankerScore > 0.7).map((doc: any, index: number) => "Context " + (index+1) + ":\n\n "+doc.document.content + "\n\n document link: " + doc.document.document_link + "\n\n page number: " + String(doc.document.page_number)).join("\n\n");
                            text = response.data.results.filter((doc: any) => doc.score > 0.7).map((doc: any, index: number) => "Context " + (index+1) + ":\n\n "+doc.document.content + "\n\n document link: " + doc.document.document_link + "\n\n page number: " + String(doc.document.page_number)).join("\n\n");
                            //console.log("*********text********: ", text);
                            props.handleLanguage(lang);
                            props.handleSearchResult(text);
                            const titlesAndSources = response.data.results.map((item: any)  => ({
                                title: item.document.title,
                                source: item.document.document_link,
                                page: item.document.page_number,
                                html: item.document.content_html
                            }));
                            //console.log("titlesAndSources: ", titlesAndSources);
                            props.handleTitleSources(titlesAndSources);
                        } else {
                            text = "No results found";
                            props.handleSearchResult(text);
                            props.handleTitleSources([]);
                        }

                        // setIsLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                    });       
            }
        };
        searchAzure();
        
    }, [props.searchText, dispatch, setLoading]);

    return (
        <>
        { !loading && (
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
        )}
        </>
    )
}


