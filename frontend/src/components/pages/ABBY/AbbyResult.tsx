import React from 'react';
import Stack from '@mui/material/Stack';
import ShortCardDisplay from 'components/common/ShortCardDisplay';
import AlignItemsList from './AlignItemsList';
import { handleKeyPhaseExtraction } from 'actions/openaiAnswer';


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
        return <div key={index}>
        {
            (props.lang === "en-us") 
            ?
            <AlignItemsList cardwidth={"80%"} cardtext={result.document.content} score={result.rerankerScore} kind={result.document.dataType} keyphrases={keyphrases} source={result.document.source} />
            :
            <AlignItemsList cardwidth={"80%"} cardtext={result.document.translated_text} score={result.rerankerScore} kind={result.document.dataType} keyphrases={keyphrases} source={result.document.source} />
        }
        </div>
    });

    

    return (

        <Stack spacing={2} sx={{ display: "flex", alignItems: "center" }}>
          {results}
        </Stack>
      );
};
