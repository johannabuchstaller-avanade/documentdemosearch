export const appConfig = {
    "appName": "Market Data Extraction POC",
    "loadingText": "Connecting to App",
    "searchVariables": {
        "searchInputPlaceholder": "Search for documents...",
        "indexName": "index-tables-from-pdf-bahamas-v4",
        "semanticConfigName": "documentsearch-bahamas-semantic-config",
        "language": "en-us",
    },
    "showChatbot": false,
    "showSummary": false,
    "searchBarInHeader": false,
    "uploadEnabled": false,
    "displayWelcomeMessage": true,
    "welcomeOneLiner": " your intelligent virtual assistant portal, powered by GenAI!",
    "welcomeMessage": "Experience the future of knowledge discovery and effortless document management with MyBrand, harnessing the power of Azure Cognitive Search, Azure OpenAI, Abby powered by Power Virtual Agents, and Power Automate for seamless, intelligent information retrieval.",
    "tips": [
        {
          "title": "Be as specific as possible and use keywords",
          "description": 'Instead of searching for broad terms, try to narrow it down. The Search currently uses full text search instead of semantic so using key words works well. \n \n For example: \'What is the GDP of the Bahamas in 2023\' gives no answer while \'GDP Bahamas in 2023\' gives correct answer.'
        },
        {
          "title": "Other examples",
          "description": `
          - GDP Bahamas in 2023 million bahamian dollars?
          - Real GDP change % Bahamas 2023?
          - What is the unemployment rate of the bahamas 2023?
          - Bahamas visitors by air in April 2023?`
        },
        
      ],
      "disclaimer": "Remember, responses generated by AI models, such as OpenAI's GPT-3, are simulated and don't have access to real-time or personal data unless shared during the interaction. The AI's responses are based on patterns and information it learned during its training and do not necessarily reflect real-world up-to-date information or the views or beliefs of the AI developers. It's always good to cross-check important information from multiple sources."
};
