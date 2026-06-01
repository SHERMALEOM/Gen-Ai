import { GoogleGenAI, Type } from '@google/genai';
import readlineSync from "readline-sync"
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

async function crypto({coin}) {
    let response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`);
    let data=await response.json();
    return data;
}


async function wheather({city}) {
   let response=await fetch(`https://api.weatherapi.com/v1/current.json?key=7880366871a14e50aad173743250607&q=${city}&aqi=no`);
   let dataa=await response.json();
  return dataa;
}



const cryptoinfo={
    //name of the function
    name: 'crypto',
     description: 'Will get  crypto information like their prices and asking about any of the crypto coin info  like etherium and bitcoin',
     parameters:{
        type: Type.OBJECT,
        properties:{
            coin:{
                type:Type.STRING,
                 description: 'It will be the name  of Crypto Currency '

            }
        },
        required:["coin"]  // basically  what we needed 
     }
}


const weatherinfo={
    //name of the function
    name: 'wheather',
     description: "It will give the weather information lime the temperature and all the information related to climate etc of diff diff places like mumbai london basically based on  user input",

     parameters:{
        type: Type.OBJECT,
        properties:{
            city:{
                type:Type.STRING,
                 description: 'It will be the name  of Temperature information '

            }
        },
        required:["city"]  // basically  what we needed 
     }
}

const tools=[{
    functionDeclarations:[
        cryptoinfo,
        weatherinfo
    ]
}]
let History =[] // stores the history 
let toolFunctions={
    // make a reference so  in runagent dont have to manually right if else statement
    "cryptoinfo":cryptoinfo,
    "weatherinfo":weatherinfo
}


async   function  runAgent(){
    while (true) {
    const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:History,
    config: { tools },
  });

  if (result.functionCalls && result.functionCalls.length > 0) {
    const functionCall = result.functionCalls[0];

    const { name, args } = functionCall;

    // if(name=="cryptoinfo"){
    //     cryptoinfo(args)
    // }

    // else if(name=="weatherinfo"){
    //     weatherinfo(args)
    // }         // writing thise stuff  can increse the lines of code to improve thise make a refeerence ;
    
    const response= await toolFunctions[name](args)

    // Send the function response back to the model.
    History.push({
      role: "model",
      parts: [
        {
          functionCall: functionCall}],
    });

      const functionResponsePart = {   // function  to  store the result of the tool
      name: functionCall.name,
      response: {
        result: response,
      },
      id: functionCall.id,
    };

    History.push({
      role: "user",
      parts: [
        {
          functionResponse: functionResponsePart,
        },
      ],
    });
}
else{
    History.push({
        role:"model",
        parts:[{text:result.text}]
    }  )
    console.log(result.text)
    break;
}
}


} 

while(true){
    const question=readlineSync.question("Ask Me Anything:-");

    if(question=="exit")
        break;

    History.push({
        role:"user",
        parts:[{text:question}]

    });

    await runAgent();
}