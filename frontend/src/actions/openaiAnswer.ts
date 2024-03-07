
export const handleKeyPhaseExtraction = async (context: string): Promise<string> => {
  let jsans;
  try {
    const prompt = `
    Give key phrases from the following text as an Array ["valid string 1", ...]:

    Context:
    ${context}

    Keypahrases array:
    `
    const inputdata = {
      prompt: prompt,
      temperature: 0.0,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: "text-davinci-003",
    }
    const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT ?? '';
    const apikey = process.env.REACT_APP_AZURE_OPENAI_APIKEY ?? '';

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apikey, // Replace with your API key
      },
      body: JSON.stringify(inputdata),
    });
    const data = await response.json();
    // console.log(data.choices[0].text)
    jsans = JSON.parse(data.choices[0].text)
  } catch (error) {
    jsans = []
    console.log("error occured in KeyPhrase: ", error)
  }

  return jsans;
}



export async function handleSummarizeAva(context: string, question: string): Promise<string> {

  const prompt = `
    Give comprehensive summary of the context below by keeping relevant details that might be useful to answer "${question}" and any possible followup question. 

    
    Context: 
    ${context}

    Summary:
  `
  const inputdata = {
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: "text-davinci-003"
  }
  const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT ?? '';
  const apikey = process.env.REACT_APP_AZURE_OPENAI_APIKEY ?? '';

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apikey, // Replace with your API key
    },
    body: JSON.stringify(inputdata),
  });
  const data = await response.json();
  return data.choices[0].text;
}


export async function handleFetchAzureOpenAIanswerJsonApp(context: string, searchText: string): Promise<any> {
  //const prompt = `\n\n\nContext: \n${context}\n\n Answer the question as truthfully as possible only from the provided Context above, and if the answer is not in the context above, reply 'I don't know'. Give result in json format, {"answer": answer, "context": a number to represent which context was used for the answer.}. Answer should have good formatting, spacing and use markdowns. \n\nQ: ${searchText}\nA:`
  let finalanswer;
  if(context) {
      const prompt = `
      Follow the rules stricly and answer the Question from given context.

      Rules:
      1. Give result in JSON format, {"answer": Answer which is a valid string, "context": a number to represent which context was used for the answer starts from 0 else null.}.
      1. Answer the question as truthfully as possible only from the provided context below, and if the answer is not in the context below, answer must be 'I don't know'.
      2. Process the answer in good formatting and emphasize the important parts of answer with appropriate Markdown.
      3. Answer the question in detail and in a way that is easy to understand.

      Example:
      Context 0: Flappy is a bird. It can fly. It can also swim. It is a bird. 

      Context 1: Flappy is a good bird.

      Question: What can Flappy do?
      Answer: {"answer": "Flappy can fly and swim.", "context": 0}
      
      Context: \n${context}
      
      Question: ${searchText}
      
      Answer:`
      const inputdata = {
          prompt: prompt,
          temperature: 0.0,
          max_tokens: 600,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          model: "text-davinci-003"
      }
      const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT ?? '';
      const apikey = process.env.REACT_APP_AZURE_OPENAI_APIKEY ?? '';

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apikey, // Replace with your API key
        },
        body: JSON.stringify(inputdata),
      });
      const data = await response.json();
      const jsans = JSON.parse(data.choices[0].text)
      finalanswer = {answer: jsans.answer, context: jsans.context}
    } else{
      finalanswer = {answer: "I don't know", context: null}
    }
  return finalanswer;
}



export async function handleFetchGPT4(context: string, searchText: string): Promise<any> {
  let finalanswer;
  if(context) {
      const prompt = `
      Rules:
        Follow these rules strictly and answer the Question from given context.
        •\tYou are an answering bot whose primary goal is to help users to answer questions based on the context clearly.
        •\tProvide full answer that are polite and professional. 
        •\tAnswer questions truthfully based on context provided.
        •\tDo not answer questions that are not related to the context and respond with \"I am not sure about that!\".
        •\tIf you do not know the answer to a question, respond by saying “I do not know the answer to your question.”
        •\tThere are multiple context, which has Context and metadata.
        •\tThe metadatas are: document link and page number.
        •\tAnswer can be based on any of the context. You could use multiple context to answer the question.
        •\tAnalyze all context and if there are comparable answers, give detailed answer.
        •\tIf there are multiple answers, give all answers.
        •\tIf there are contractions in the answer, expand them.
        •\tThe information in the context can be a markdown table, and if two contexts have answer to the question, give both answers.
        •\tAnalyze all context and if there are comparable answers, give detailed answer.
        •\tYou should search answer in the field : Context.
        •\tAnswer format should be answer with sources in markdown and page numbers.
      

      Example:
        Context 0: 
            Flappy is a bird. It can fly. It can also swim. It is a bird. 
            
            document link: https://flappy1.com

            page number: 5

        Context 1: 
            Flappy is a good bird. Flappy can run.

            document link: https://flappy2.com

            page number: 8

        Question: What can Flappy do?
        Answer: According to [Context 1](https://flappy1.com) at page number 5, Flappy can fly and swim. In addition, according to [Context 2](https://flappy2.com) at page number 8, Flappy can run. Thus, it can be concluded that flappy can fly, swim and run.


      Context:
        ${context}`

      const inputdata = {
          messages: [
            { "role": "system", "content": prompt },
            { "role": "user", "content": searchText }
          ],
          temperature: 0.1,
          max_tokens: 800,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
      }
      const endpoint = process.env.REACT_APP_OPENAI_API_BASE_CHAT ?? '';
      const apikey = process.env.REACT_APP_OPENAI_API_KEY_CHAT ?? '';

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apikey, // Replace with your API key
        },
        body: JSON.stringify(inputdata),
      });
      const data = await response.json();
      //console.log(data);
      console.log("Open AI succeeded!")
      const answer = data.choices[0].message.content
      finalanswer = answer
    } else{
      finalanswer = "Sorry, I don't know the answer to your question."
    }
  return finalanswer;
}



export async function handleFetchGPT3(context: string, searchText: string): Promise<any> {
  //const prompt = `\n\n\nContext: \n${context}\n\n Answer the question as truthfully as possible only from the provided Context above, and if the answer is not in the context above, reply 'I don't know'. Give result in json format, {"answer": answer, "context": a number to represent which context was used for the answer.}. Answer should have good formatting, spacing and use markdowns. \n\nQ: ${searchText}\nA:`
  let finalanswer;
  if(context) {
      const prompt = `
      Rules:
      Follow these rules strictly and answer the Question from given context.
      •\tYou are an answering bot whose primary goal is to help users to answer questions based on the context clearly.
      •\tProvide full answer that are polite and professional. 
      •\tAnswer questions truthfully based on context provided.
      •\tDo not answer questions that are not related to the context and respond with \"I am not sure about that!\".
      •\tIf you do not know the answer to a question, respond by saying “I do not know the answer to your question.”
      •\tThere are multiple context, which has Context and metadata.
      •\tThe metadatas are: document link and page number.
      •\tAnswer can be based on any of the context. You could use multiple context to answer the question.
      •\tAnalyze all context and if there are comparable answers, give detailed answer.
      •\tIf there are multiple answers, give all answers.
      •\tIf there are contractions in the answer, expand them.
      •\tThe information in the context can be a markdown table, and if two contexts have answer to the question, give both answers.
      •\tAnalyze all context and if there are comparable answers, give detailed answer.
      •\tYou should search answer in the field : Context.
      •\tContext starts from 1.
      •\tAnswer format should be answer with sources in markdown and page numbers.
    

    Example:
      Context 1: 
          Flappy is a bird. It can fly. It can also swim. It is a bird. 
          
          document link: https://flappy1.com

          page number: 5

      Context 2: 
          Flappy is a good bird. Flappy can run.

          document link: https://flappy2.com

          page number: 8

      Question: What can Flappy do?
      Answer: According to [Context 1](https://flappy1.com) at page number 5, Flappy can fly and swim. In addition, according to [Context 2](https://flappy2.com) at page number 8, Flappy can run. Thus, it can be concluded that flappy can fly, swim and run.

      
      Context: \n${context}
      
      Question: ${searchText}
      
      Answer:`
      const inputdata = {
          prompt: prompt,
          temperature: 0.0,
          max_tokens: 600,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          model: "text-davinci-003"
      }
      const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT ?? '';
      const apikey = process.env.REACT_APP_AZURE_OPENAI_APIKEY ?? '';

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apikey, // Replace with your API key
        },
        body: JSON.stringify(inputdata),
      });
      const data = await response.json();
      const jsans = JSON.parse(data.choices[0].text)
      finalanswer = {answer: jsans.answer, context: jsans.context}
    } else{
      finalanswer = {answer: "I don't know", context: null}
    }
  return finalanswer;
}



export async function handleFetchGPT4Stream(context: string, searchText: string): Promise<any> {
  let finalanswer;
  if(context) {
      const prompt = `
      Rules:
        Follow these rules strictly and answer the Question from given context.
        •\tYou are an answering bot whose primary goal is to help users to answer questions based on the context clearly.
        •\tProvide full answer that are polite and professional. 
        •\tAnswer questions truthfully based on context provided.
        •\tDo not answer questions that are not related to the context and respond with \"I am not sure about that!\".
        •\tIf you do not know the answer to a question, respond by saying “I do not know the answer to your question.”
        •\tThere are multiple context, which has Context and metadata.
        •\tThe metadatas are: document link and page number.
        •\tAnswer can be based on any of the context. You could use multiple context to answer the question.
        •\tAnalyze all context and if there are comparable answers, give detailed answer.
        •\tIf there are multiple answers, give all answers.
        •\tIf there are contractions in the answer, expand them.
        •\tThe information in the context can be a markdown table, and if two contexts have answer to the question, give both answers.
        •\tAnalyze all context and if there are comparable answers, give detailed answer.
        •\tYou should search answer in the field : Context.
        •\tAnswer format should be answer with sources in markdown and page numbers.
      

      Example:
        Context 0: 
            Flappy is a bird. It can fly. It can also swim. It is a bird. 
            
            document link: https://flappy1.com

            page number: 5

        Context 1: 
            Flappy is a good bird. Flappy can run.

            document link: https://flappy2.com

            page number: 8

        Question: What can Flappy do?
        Answer: According to [Context 1](https://flappy1.com) at page number 5, Flappy can fly and swim. In addition, according to [Context 2](https://flappy2.com) at page number 8, Flappy can run. Thus, it can be concluded that flappy can fly, swim and run.


      Context:
        ${context}`

      const inputdata = {
          messages: [
            { "role": "system", "content": prompt },
            { "role": "user", "content": searchText }
          ],
          temperature: 0.1,
          max_tokens: 800,
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: true
      }
      const endpoint = process.env.REACT_APP_OPENAI_API_BASE_CHAT ?? '';
      const apikey = process.env.REACT_APP_OPENAI_API_KEY_CHAT ?? '';

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apikey, // Replace with your API key
        },
        body: JSON.stringify(inputdata),
      });
      // const data : any= await response;
      //console.log(data);
      // console.log("Open AI succeeded!")

      // console.log(data)
      //const answer = data.choices[0].message.content
      //

      finalanswer = response.body;
    } else{
      finalanswer = "Sorry, I don't know the answer to your question."
    }
  return finalanswer;
}