import { useState, useEffect } from "react";

function App() {
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [speed, setSpeed] = useState(0.50);

  useEffect(() => {
    speechSynthesis.getVoices();
  }, []);

  // 🔥 ADVANCED ENGLISH → SANSKRIT
  const toSanskrit = (input: string) => {
    return input
      .toLowerCase()
      .trim()

      // core mantra mappings
      .replace(/\bom\b/g, "ॐ")
      .replace(/\bnamah\b/g, "नमः")
      .replace(/\bshivaya\b/g, "शिवाय")
      .replace(/\bshiv\b/g, "शिव")
      .replace(/\bgovinda\b/g, "गोविन्द")
      .replace(/\braam\b/g, "राम")
      .replace(/\bkrishna\b/g, "कृष्ण")

      // phonetic fallback (basic)
      .replace(/aa/g, "आ")
      .replace(/ii/g, "ई")
      .replace(/uu/g, "ऊ")
      .replace(/sh/g, "श")
      .replace(/ch/g, "च")
      .replace(/dh/g, "ध")
      .replace(/th/g, "थ")
      .replace(/ph/g, "फ")
      .replace(/bh/g, "भ");
  };

  // 🔥 Split text
  const splitChant = (text: string) => {
    return text
      .replace(/।/g, " । ")
      .replace(/,/g, " , ")
      .split(/\s+/);
  };

  // 🔥 Chant elongation
  const elongate = (word: string) => {
    return word
      .replace("ॐ", "ओओओम्")
      .replace(/ा/g, "ाऽ")
      .replace(/ी/g, "ीऽ")
      .replace(/ू/g, "ूऽ")
      .replace(/ं/g, "ं…")
      .replace(/ः/g, "ः…");
  };

  // 🔥 MAIN CHANT FUNCTION
  const speak = () => {
    if (!text.trim()) return;

    const isEnglish = /^[a-zA-Z\s]+$/.test(text);

    const processed = isEnglish ? toSanskrit(text) : text;

    const parts = splitChant(processed);

    let i = 0;

    const speakNext = () => {
      if (i >= parts.length) {
        setCurrentIndex(-1);
        return;
      }

      setCurrentIndex(i);

      const word = elongate(parts[i]);

      const utter = new SpeechSynthesisUtterance(word);

      utter.lang = "hi-IN";
      utter.rate = speed;
      utter.pitch = 1.5;

      const voices = speechSynthesis.getVoices();
      const v =
        voices.find(v => v.lang === "hi-IN") ||
        voices.find(v => v.lang.includes("hi"));

      if (v) utter.voice = v;

      utter.onend = () => {
        i++;

        let delay = 180;
        if (word === "।") delay = 700;
        else if (word.length > 6) delay = 280;

        setTimeout(speakNext, delay);
      };

      speechSynthesis.speak(utter);
    };

    speechSynthesis.cancel();
    speakNext();
  };

  return (
    <div style={styles.bg}>
      <h1 style={styles.title}>
        Sanskrit <span style={styles.highlight}>Vākya</span> Synthesizer
      </h1>

      {/* DISPLAY */}
      <div style={styles.display}>
        {text.split(" ").map((w, i) => (
          <span
            key={i}
            style={{
              color: i === currentIndex ? "#ff7a18" : "#333",
              fontWeight: i === currentIndex ? "bold" : "normal",
              marginRight: "8px",
            }}
          >
            {w}
          </span>
        ))}
      </div>

      {/* INPUT */}
      <textarea
        style={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type English (om namah shivaya) or Sanskrit"
      />

      {/* SPEED */}
      <div style={{ marginTop: "20px" }}>
        <label>Chant Speed: {speed.toFixed(2)}</label>
        <br />
        <input
          type="range"
          min="0.25"
          max="0.7"
          step="0.02"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          style={{ width: "300px" }}
        />
      </div>

      {/* BUTTON */}
      <button style={styles.button} onClick={speak}>
        🕉️ Chant
      </button>
    </div>
  );
}

// 🎨 UI
const styles: any = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8e7c9, #f4d7a1)",
    padding: "40px",
    textAlign: "center",
    fontFamily: "serif",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#2c2c2c",
  },
  highlight: {
    color: "#ff7a18",
  },
  display: {
    fontSize: "22px",
    margin: "20px",
    lineHeight: "2",
  },
  textarea: {
    width: "70%",
    height: "140px",
    padding: "15px",
    borderRadius: "12px",
  },
  button: {
    marginTop: "20px",
    padding: "12px 30px",
    background: "#ff7a18",
    color: "white",
    border: "none",
    borderRadius: "20px",
    fontSize: "18px",
  },
};

export default App;