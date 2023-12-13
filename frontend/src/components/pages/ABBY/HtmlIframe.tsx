import React, { useRef, useEffect } from 'react';

interface HtmlIframeProps {
  htmlString: string;
  onTableReady: (table: HTMLTableElement) => void;
}

const HtmlIframe: React.FC<HtmlIframeProps> = ({ htmlString, onTableReady }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeContentHeight, setIframeContentHeight] = React.useState('auto');

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {

          
        const onLoad = () => {
            const iframeDocument = iframeRef.current?.contentWindow?.document;
            if (iframeDocument) {
            
                const tables = iframeDocument.getElementsByTagName('table');
                if (tables.length > 0) {
                  const table = tables[0];
                  onTableReady(table);
                } else {
                  console.log("Table still not found via getElementsByTagName");
                }
    
            }

              const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
              if (iframeDoc) {
                const height = iframeDoc.documentElement.scrollHeight || iframeDoc.body.scrollHeight;
                setIframeContentHeight(`${height}px`);
              }
            
      
          };
          
  
      iframe.addEventListener('load', onLoad);
      iframe.src = 'about:blank';
      if (iframe.contentWindow) {
        const document = iframe.contentWindow.document;
        document.open();
        document.write(htmlString);
        document.close();
      }
  
      return () => {
        iframe.removeEventListener('load', onLoad);
      };
    }
  }, [htmlString, onTableReady]);
  

  return (
    <iframe 
      ref={iframeRef} 
      style={{ width: '100%', height: iframeContentHeight, border: 'none' }}
      title="Table Frame"
    />
  );
};

export default HtmlIframe;