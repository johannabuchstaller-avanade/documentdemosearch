import * as React from "react"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import TableViewIcon from "@mui/icons-material/TableView"
import TextSnippetIcon from "@mui/icons-material/TextSnippet"
import { Stack, Button } from "@mui/material"
import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import GetAppIcon from "@mui/icons-material/GetApp"
import Tooltip from "components/common/Tooltip"
import HtmlIframe from "./HtmlIframe"

const htmlstyle = `
<style>
  .dataframe {
    width: 100%;
    border-collapse: collapse;
  }

  .dataframe td, .dataframe th {
    border: 1px solid #ddd;
    padding: 4px;
  }

  .dataframe tr:nth-of-type(even){background-color: #f2f2f2;}

  .dataframe th {
    padding-top: 4px;
    padding-bottom: 5px;
    text-align: left;
  }
</style>
`

export default function AccordionResult({
  value,
  kind,
  source,
  page,
  html,
  title,
  pdfUrl,
  documentSourceLink,
}: any) {
  const htmlstring = htmlstyle + html

  function renderContent(kind: string) {
    return kind === "table" ? (
      <Avatar alt={kind} sx={{ bgcolor: "#42a600" }}>
        <TableViewIcon />
      </Avatar>
    ) : kind === "paragraph" || kind === "text" ? (
      <Avatar alt={kind} sx={{ bgcolor: "#00affa" }}>
        <TextSnippetIcon />
      </Avatar>
    ) : (
      <Avatar alt={kind} sx={{ bgcolor: "#00affa" }}>
        <TextSnippetIcon />
      </Avatar>
    )
  }
  const [tableForDownload, setTableForDownload] =
    React.useState<HTMLTableElement | null>(null)

  const handleTableReady = React.useCallback((table: HTMLTableElement) => {
    setTableForDownload(table)
  }, [])

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!tableForDownload) return

    const wb = XLSX.utils.table_to_book(tableForDownload, { sheet: "Sheet JS" })
    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "binary",
    })

    function s2ab(s: string) {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
      return buf
    }

    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "test.xlsx"
    )
  }

  return (
    <Accordion sx={{ bgcolor: "background.paper", borderRadius: "10px" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={"search-content" + String(value)}
        id={"search-header" + String(value)}
      >
        <ListItemAvatar>{renderContent(kind)}</ListItemAvatar>
        <Stack sx={{ m: 2, flex: 1 }}>
          <Stack
            direction="row"
            sx={{ m: 0, p: 0, flexWrap: "wrap", fontSize: "12px" }}
          >
            {/* <Typography variant="body2" component="div" sx={{ mr: 3, fontWeight: 400 }}> {value + 1}. </Typography> */}
            Context &nbsp; {value + 1}: &nbsp;
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Typography
                component="div"
                sx={{ color: "blue", cursor: "pointer", fontSize: "11px" }}
                onClick={(event: any) => event.stopPropagation()}
              >
                {source}
              </Typography>
            </a>
          </Stack>
          <Typography variant="caption" color="green" component="div">
            {" "}
            Page : {page}{" "}
          </Typography>
          {documentSourceLink && (
            <Typography variant="caption" color="green" component="div" sx={{ display: "flex", flexWrap: "wrap", alignItems: "center"  }}>
              {" "}
              Full pdf source: &nbsp;
              <a
                href={documentSourceLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Typography
                  component="div"
                  sx={{ color: "green", cursor: "pointer", fontSize: "11px", fontStyle: "italic" }}
                  onClick={(event: any) => event.stopPropagation()}
                >
                  {documentSourceLink}
                </Typography>
              </a>{" "}
            </Typography>
          )}
        </Stack>
        <Tooltip title="Download as excel" placement="top">
          <Button
            onClick={handleDownload}
            sx={{ minWidth: "auto", p: 1, mr: 10 }}
          >
            <GetAppIcon />
          </Button>
        </Tooltip>
      </AccordionSummary>
      <AccordionDetails>
        <HtmlIframe htmlString={htmlstring} onTableReady={handleTableReady} />
      </AccordionDetails>
    </Accordion>
  )
}
