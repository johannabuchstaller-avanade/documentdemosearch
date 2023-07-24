import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

interface Params {
  q?: string;
  top?: number;
  skip?: number;
  type?: string;
  lang?: string;
  indexname?: string;
  semsconfig?: string;
  filter?: string;
}

export interface SearchDocument {
  content?: string;
  translated_text?: string;
  title: string;
  source: string;
  pageNumber: number;
}

export interface SearchResultItem {
  rerankerScore: number;
  document: SearchDocument;
}

export interface SearchResult {
  count?: number;
  results: any[];
  status?: number;
  innerStatusCode?: string | number;
  error?: string;
}

export interface SearchError {
  status: number;
  innerStatusCode: string | number;
  error: string;
}


const apiKey: string = process.env["REACT_APP_SEARCH_API_KEY"] || '';
const searchServiceName: string = process.env["REACT_APP_SEARCH_SERVICE_NAME"] || '';

function getSearchOptions(params: Params, searchType?: string) {
  const baseOptions = {
    top: params.top,
    skip: params.skip,
    includeTotalCount: true
  };

  if (searchType === "semantic") {
    if (!params.lang) {
      throw new Error("queryLanguage parameter is required when speller is specified or queryType is set to 'semantic'");
    }

    const semanticOptions = {
      queryType: "semantic",
      semanticConfiguration: params.semsconfig,
      queryLanguage: params.lang,
      answers: "extractive",
      captions: "extractive",
      speller: "lexicon"
    };

    return { ...baseOptions, ...semanticOptions };
  }

  return baseOptions;
}

export const handleFetchSearchContext =  async (params: Params): Promise<SearchResult> => {
  console.log("handleFetchSearchContext", params);
  try {
    const client = new SearchClient(
      `https://${searchServiceName}.search.windows.net/`,
      params.indexname || '',
      new AzureKeyCredential(apiKey)
    );

    const searchTerm = params.q || "*";
    const searchOptions = getSearchOptions(params, params.type);
    const searchResults = await client.search(searchTerm, searchOptions);

    const output: any[] = [];
    for await (const result of searchResults.results) {
      output.push(result);
    }

    console.log(searchResults.count);

    return {
      count: searchResults.count,
      results: output,
    };
  } catch (error: any) {
    console.error(error);

    return {
      status: 400,
      innerStatusCode: error.statusCode || error.code,
      error: error.details || error.message,
      results: [],  // Ensuring `results` is always an array
    };
  }
};
