import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
// import './site.css';

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState();
  const [persona, setPersona] = useState("eve");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input, persona }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Multi-Personality</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.jpg" className={styles.icon} />
        <h3>Choose your AI and say hello to begin!</h3>
        <div className={styles.content}>
          <div className={styles.imageflex}>
            <div className={persona === 'eve' ? styles.personapicselected : styles.personapic}>
              <img src="/AnimeBlogger.jpg" style={{ width: 150, height: 160 }} onClick={() => setPersona('eve')}/>
            </div>
            <div className={persona === 'vorgath' ? styles.personapicselected : styles.personapic}>
              <img src="/Vorgath.jpg" style={{ width: 150, height: 160 }} onClick={() => setPersona('vorgath')}/>      
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="input"
            placeholder="Enter an input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="Generate response" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}


