
import axios from "axios";

export async function getResponseFromOpenAI(context: string, searchText: string): Promise<any> {
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
          •\tThe metadatas are: document Name and page number.
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
              
              document Name: File_1.pdf
  
              page number: 5
  
          Context 1: 
              Flappy is a good bird. Flappy can run.
  
              document Name: File_2.pdf
              page number: 8
  
          Question: What can Flappy do?
          Answer: According to **File_1.pdf** at page number 5, Flappy can fly and swim. In addition, according to **File_2.pdf** at page number 8, Flappy can run. Thus, it can be concluded that flappy can fly, swim and run.
  
  
        Context:
          ${context}`

        const inputdata = {
            Messages: [
              { Role: "system", Content: prompt },
              { Role: "user", Content: searchText }
            ],
            Model: "Gpt4",
            Temperature: 0.1,
            MaxTokens: 800,
            TopP: 0.95,
            FrequencyPenalty: 0,
            PresencePenalty: 0,
        }
        const headers = {
            "Content-Type": "application/json",
            };
        const endpoint = "/api/completion";
  
        const response = await axios.post(endpoint, inputdata, {headers: headers});

        finalanswer = response.data.Message.Content
        
      } else{
        finalanswer = "Sorry, I don't know the answer to your question."
      }
    return finalanswer;
  }
  

  export async function getSearchResults(query: string): Promise<any> {
    const endpoint = "/api/search";
    const body = {
      q: query,
      top: 3
    }

    const response = await axios.post(endpoint, body);
    
    return response;
  }

  export async function handleDocumentDownload(e: React.MouseEvent, file_id: string, file_name: string): Promise<void> {
    e.stopPropagation();
    console.log(file_id)
    try {

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DocumentId: file_id }), // Send the ID in the request body
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log(response)

      const blob = await response.blob(); // Creates a Blob from the binary data
      console.log(blob)

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file_name; // Set the file name and extension
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error('Download error:', error);
    }
  };