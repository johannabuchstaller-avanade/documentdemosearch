const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");

const apiKey = process.env["SearchApiKey"];
const searchServiceName = process.env["SearchServiceName"];

function getSearchOptions(params, searchType) {
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

        if (params.filter) {
            semanticOptions.filter = params.filter;
        }

        return { ...baseOptions, ...semanticOptions };
    }

    return baseOptions;
}


module.exports = async function (context, req) {
    try {
        const params = {
            q: req.query.q || (req.body && req.body.q),
            top: req.query.top || (req.body && req.body.top),
            skip: req.query.skip || (req.body && req.body.skip),
            type: req.query.type || (req.body && req.body.type),
            lang: req.query.lang || (req.body && req.body.lang),
            indexname: req.query.indexname || (req.body && req.body.indexname),
            semsconfig: req.query.semsconfig || (req.body && req.body.semsconfig),
            filter: req.query.filter || (req.body && req.body.filter)
        };
        let answer = '';


        const client = new SearchClient(
            `https://${searchServiceName}.search.windows.net/`,
            params.indexname,
            new AzureKeyCredential(apiKey)
        );

        const searchTerm = params.q || "*";
        const searchOptions = getSearchOptions(params, params.type);
        const searchResults = await client.search(searchTerm, searchOptions);

        

        const output = [];
        for await (const result of searchResults.results) {
            output.push(result);
        }

        if (params.type === "semantic") {
            answer = searchResults.answers[0]?.highlights || '';
        } else {
            answer = '';
        }


        // const answer = searchResults.answers[0]?.highlights || '';

        context.log(searchResults.count);

        context.res = {
            headers: {
                "Content-type": "application/json"
            },
            body: {
                count: searchResults.count,
                results: output,
                answer: answer
            }
        };
    } catch (error) {
        context.log.error(error);

        context.res = {
            status: 400,
            body: {
                innerStatusCode: error.statusCode || error.code,
                error: error.details || error.message
            }
        };
    }
};
