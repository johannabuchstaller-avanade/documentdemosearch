# Readme for WeDocumentSearchDemoCaseAPI

This repository contains the code for the WeDocumentSearchDemoCaseAPI, a React-based web application that interacts with an Azure Function App. The application allows users to perform document searches based on specific criteria.

## Installation

To install and run the WeDocumentSearchDemoCaseAPI locally, follow these steps:

1. Clone the repository to your local machine:
```
git clone https://github.com/johannabuchstaller-avanade/documentdemosearch.git
```

2. Navigate to the project directory:
```
cd frontend
```

3. Install the dependencies:
```
npm install
```

4. Run the application:
```
npm start
```

5. Run the azure function app:
```
fn + f5
```

Note: You may need to change the endpoint in AbbySearch.tsx from https://wedocumentsearchdemocaseapi.azurewebsites.net/api/search?
to /api/search? if you are running the application locally.

## Build

To build the React application and prepare it for deployment, use the following command:
```
npm run build
```


This will create a `build` directory with optimized and minified production-ready files.

## Deployment to Azure Function App

To deploy the React application to the Azure Function App, follow these steps:

1. Publish the Azure Function App:
```
func azure functionapp publish wedocumentsearchdemocaseapi
```


2. Create a deployment package by zipping the contents of the `build` directory. You can do this using the following command:

```	
zip -r build.zip build
```

3. Deploy the zipped package to the Azure Web App associated with your Function App:

```
az webapp deployment source config-zip --resource-group we-documentsearchdemo-rg --name documentsearchUI --src build.zip
```


This will deploy the React application to the Azure Web App, making it accessible to users.

