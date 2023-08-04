import React from 'react';
import Stack from '@mui/material/Stack';
import { handleKeyPhaseExtraction } from 'actions/openaiAnswer';
import AccordionResult from './AccordionResult';

export default function AbbyResult(props: any) {


   const [keyphrases, setKeyphrases] = React.useState<any>([]);

   React.useEffect(() => {
    if(props.query) {

        handleKeyPhaseExtraction(props.query)
        .then((res: any) => {
            setKeyphrases(res);
        })
        .catch((error: any) => {
            console.error(error);
        });
    }
    }, [props.query]);


    let results;
    results = props.documents.map((result: any, index: number) => {
        return <div key={index} style={{ width: '100%', margin: "3px" }}>
        {
            (props.lang === "en-us") 
            ?
            <AccordionResult value={index} cardtext={result.document.content} score={result.rerankerScore} kind={result.document.dataType} keyphrases={keyphrases} source={result.document.document_link} page={result.document.page_number} html={result.document.content_html} title={result.document.title} />
            :
            <AccordionResult value={index} cardtext={result.document.translated_text} score={result.rerankerScore} kind={result.document.dataType} keyphrases={keyphrases} source={result.document.document_link} page={result.document.page_number} html={result.document.content_html} title={result.document.title} />
        }
        </div>
    });

    

    return (

        <Stack spacing={2} sx={{ display: "flex", alignItems: "center" }}>
          {results}
        </Stack>
      );
};
