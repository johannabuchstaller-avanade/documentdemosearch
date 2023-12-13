import React from 'react';
import Stack from '@mui/material/Stack';
import AccordionResult from './AccordionResult';

export default function AbbyResult(props: any) {
   const documents = props.documents;
    return (

        <Stack spacing={2} sx={{ display: "flex", alignItems: "center" }}>
          {
            documents.length > 0 ? (
              <>
                
                {
                  documents.map((result: any, index: number) => {
                    return <div key={index} style={{ width: '100%', margin: "3px" }}>
                      <AccordionResult value={index} kind={result.document.dataType} source={result.document.document_link} page={result.document.page_number} html={result.document.content_html} title={result.document.title} />
                    </div>
                  })
                }
              </>
            ) : (
              <div style={{ width: '100%', margin: "3px" }}>
                <AccordionResult value={0} kind={"paragraph"} source={""} page={""} html={"No results found"} title={""} />
              </div>
            )
          }
        </Stack>
      );
};
