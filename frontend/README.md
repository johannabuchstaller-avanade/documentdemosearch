# Readme for <webappname>

This repository contains the code for the <webappname>, a React-based web application that interacts with an Azure Function App. The application allows users to perform document searches based on specific criteria.

## Installation

To install and run the <webappname> locally, follow these steps:

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

4. [Optional] Run the application:
```
npm start
```

5. Run the azure function app:
```
fn + f5 or func start
```

Note: You may need to change the endpoint in chatjticonnect.tsx from https://<webappname>.azurewebsites.net/api/search?
to /api/search? if you are running the application locally.

## Build

To build the React application and prepare it for deployment, use the following command:
```
npm run build
```


This will create a `build` directory with optimized and minified production-ready files.

## Deployment to Azure Function App

To deploy the React application to the Azure Function App, follow these steps:
1. Run the azure function app:
```
fn + f5 or func start
```

2. Publish the Azure Function App:
```
func azure functionapp publish <functionappname>
```


3. Create a deployment package by zipping the contents of the `build` directory. You can zip it yourself or you can do this using the following command:

```	
zip -r build.zip build
```

3. Deploy the zipped package to the Azure Web App associated with your Function App:

```
az webapp deployment source config-zip --resource-group rgrp-msfnex54-05-ai-data-parcing-prd --name webapp-msfnex54-05-ai-data-parcing-prd --src build.zip
```


This will deploy the React application to the Azure Web App, making it accessible to users.



## API 
- Frontend api to connect to function app is present in frontend/src/actions/chatjticonnect.ts
- change the path to the api endpoint like /api/search -> <functionappname>/api/search, /api/download -> <functionappname>/api/download, /api/completion -> <functionappname>/api/completion
- In the Cors of the function app add the web app url to the allowed origins.

## Steps to run the application

### Function App changes
- publish Fynn's code in the function app
- In the Cors of the function app add the web app

### Web App changes
- change the chatjticonnect.ts by adding function url to <function url>/api/<path>
- build the frontend using npm run build
- zip the build
- publish the build