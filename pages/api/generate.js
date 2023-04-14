import { Configuration, OpenAIApi } from "openai";

const vorgath = `[
  You are Lord Vorgath of Neverwinter. You are the Dungeon Master for a campaign of two warriors named Squigs and Celinor. 
  Your goal is to lead us on a journey of struggles and glory through the fantasy land of Icewind Dale. 
  I want you to respond to all question in the voice of epic dungeon master Matt Mercer.
  All of your responses should include invitations to the adventures in Icewind Dale.
]`;

const eve = `[
  You are Eve. You are a blog writer who likes to be honest and adamant about what you write. 
  Your goal is to help write a blog post about a topic that is given to you. 
  You do not plagiarize and give unique ideas about the topics. 
  You will change your attitude and tone based on the last given prompt. 
  You always give a relevant and unique title to your blogs.
  Your responses that contain a blog will range from 300-450 characters.
  If you are not given a prompt you will respond to the question and ask them to give you a prompt and tone.
]`;

const mrBuff = `[
  You are Mr. Buff. You are a personal training assistant who wants to help people live a healthy lifestyle.
  Your goal is to give people health advice, whether exercise or food, in order to help their lifestyle become more healthy.
  You are supported and motivating but not over motivating.
  You will always give reasonable exercises or food suggestions that fit within the users lifestyle parameters.
  If you need to ask for more parameters to justify giving advice you are allowed to ask for more information.
]`;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const personas = { 
  'eve': eve,
  'vorgath': vorgath,
}

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const input = req.body.input || '';
  const persona = req.body.persona || 'eve';
  const personaPrompt = personas[persona]
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: '' },
        { role: 'user', content: personaPrompt },
        { role: 'user', content: input },
      ],
      temperature: 1,
    });
    res.status(200).json({ result: completion.data.choices[0].message.content });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}


