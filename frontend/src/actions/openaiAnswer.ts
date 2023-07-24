
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



export async function handleFetchAzureOpenAIanswerJsonAccenture(context: string, searchText: string): Promise<any> {
  let finalanswer;

  try {
  
    if(context) {
        const prompt = `
        Follow the rules stricly and answer the Question from given context.

        Rules:
          1. Give result in JSON format, {"answer": Answer which is a valid string, "context": a number to represent which context was used for the answer starts from 0 else null.}.
          2. Answer the question as truthfully as possible only from the provided context below, and if the answer is not in the context below, answer must be 'I don't know'.
          3. Process the answer in good formatting and emphasize the important parts of answer with appropriate Markdown.
          4. Answer the question in detail and in a way that is easy to understand.

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
        const jsans = JSON.parse(data.choices[0].text)
        finalanswer = {answer: jsans.answer, context: jsans.context}
      } else{
        finalanswer = {answer: "I don't know", context: null}
      }
  } catch (error) {
    console.error("An error occurred in OpenAI: ", error);
    finalanswer = { answer: "I don't know", context: null };
  }
  // console.log("finalanswer: ", finalanswer);
  return finalanswer;
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




export async function handleFetchAzureOpenAIanswerJsonAppDE(context: string, searchText: string): Promise<any> {
  //const prompt = `\n\n\nContext: \n${context}\n\n Answer the question as truthfully as possible only from the provided Context above, and if the answer is not in the context above, reply 'I don't know'. Give result in json format, {"answer": answer, "context": a number to represent which context was used for the answer.}. Answer should have good formatting, spacing and use markdowns. \n\nQ: ${searchText}\nA:`
  let finalanswer;
  if(context) {
      const prompt = `
      Befolgen Sie die Regeln strikt und beantworten Sie die Frage aus dem gegebenen Kontext.

      Die Regeln:
        1. Geben Sie das Ergebnis im JSON-Format, {"answer": Antwort, die eine gültige Zeichenkette ist, "Kontext": eine Zahl, die angibt, welcher Kontext für die Antwort verwendet wurde, beginnend mit 0, sonst null.}.
        2. Beantworte die Frage so wahrheitsgetreu wie möglich nur aus dem unten angegebenen Kontext, und wenn die Antwort nicht aus dem unten angegebenen Kontext stammt, muss die Antwort "Ich weiß nicht" lauten.
        3. Verarbeiten Sie die Antwort in einer guten Formatierung und heben Sie die wichtigen Teile der Antwort mit einem geeigneten Markdown hervor.
        4. Beantworten Sie die Frage detailliert und in leicht verständlicher Form.

      Beispiel:
        0: Flappy ist ein Vogel. Er kann fliegen. Er kann auch schwimmen. Er ist ein Vogel.

        1: Flappy ist ein guter Vogel.

        Frage: Was kann Flappy tun?
        Antwort: {"answer": "Flappy kann fliegen und schwimmen.", "Kontext": 0}
      
      Kontext: \n${context}
      
      Frage: ${searchText}
      
      Antwort:`
      const inputdata = {
          prompt: prompt,
          temperature: 0.0,
          max_tokens: 550,
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
      console.log(data.choices[0].text);
      const jsans = JSON.parse(data.choices[0].text)
      finalanswer = {answer: jsans.answer, context: jsans.context}
    } else{
      finalanswer = {answer: "Ich weiß nicht", context: null}
    }
  return finalanswer;
}


