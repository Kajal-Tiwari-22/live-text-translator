import React, { useState, useEffect } from "react";
import { FaTrash, FaSync, FaSun, FaMoon, FaCopy, FaBroom } from "react-icons/fa";
import "./App.css";

const languages = ["English", "Spanish", "French", "German", "Hindi"];
const WORD_LIMIT = 5;

const App = () => {
  const [input, setInput] = useState("");
  const [translated, setTranslated] = useState("");
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [theme, setTheme] = useState("light");
  const [recentTranslations, setRecentTranslations] = useState([]);
  const [lastRecordedText, setLastRecordedText] = useState("");
  const [showToast, setShowToast] = useState(false);

  const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;
  const mockTranslate = (text) => text.split("").reverse().join("");

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const handleDelete = () => {
    setInput("");
    setTranslated("");
  };

  const handleCopy = () => navigator.clipboard.writeText(translated);
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const clearHistory = () => {
    setRecentTranslations([]);
    setLastRecordedText("");
  };

  const recordRecent = (src, translatedText) => {
    const clean = src.trim();
    if (!clean || clean === lastRecordedText) return;
    setRecentTranslations((prev) => [{ output: translatedText }, ...prev.slice(0, 4)]);
    setLastRecordedText(clean);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!input.trim()) {
        setTranslated("");
        return;
      }

      if (wordCount(input) > WORD_LIMIT) {
        setShowToast(true);
        setTranslated("");
        return;
      }

      const output = mockTranslate(input);
      setTranslated(output);
      recordRecent(input, output);
    }, 400);

    return () => clearTimeout(delay);
  }, [input, sourceLang, targetLang]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className={`app ${theme}`}>
      {showToast && (
        <div className="toast">
          ⚠️ Word limit exceeded! Max {WORD_LIMIT} words allowed.
        </div>
      )}

      <header>
        <h1>🌐 Live Text Translator</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
      </header>

      <div className="translator-container">
        <div className="translator-panel">
          <div className="language-select">
            <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
              {languages.map((lang) => <option key={lang}>{lang}</option>)}
            </select>
          </div>

          <textarea
            placeholder="Enter text to translate..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="controls">
            <span>{input.length} characters | {wordCount(input)}/{WORD_LIMIT} words</span>
            <div>
              <button onClick={handleDelete} className="icon-btn"><FaTrash /></button>
            </div>
          </div>
        </div>

        <div className="translator-center">
          <button className="icon-btn big" onClick={handleSwap}><FaSync /></button>
        </div>

        <div className="translator-panel">
          <div className="language-select">
            <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
              {languages.map((lang) => <option key={lang}>{lang}</option>)}
            </select>
          </div>

          <div className="output-box">
            {translated || <span className="placeholder">Translation will appear here...</span>}
            {translated && (
              <button className="copy-btn" onClick={handleCopy}>
                <FaCopy />
              </button>
            )}
          </div>
        </div>
      </div>

      {recentTranslations.length > 0 && (
        <section className="recent">
          <div className="recent-header">
            <h2>🕘 Recent Translations</h2>
            <button className="clear-btn" onClick={clearHistory}><FaBroom /> Clear All</button>
          </div>
          <ul className="recent-list-only-input">
            {recentTranslations.map((item, idx) => (
              <li key={idx}>{item.output}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default App;
