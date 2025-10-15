import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Question from "./components/Question";
import Results from "./components/Results";
import UserForm from "./components/UserForm";
import { UserProvider } from "./components/UserContext";

// Quiz questions — add more as you wish!
const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  },
  {
    question: "Which activity do you prefer?",
    options: ["Hiking 🥾", "Swimming 🏊", "Flying ✈️", "Bonfire 🔥"],
  },
  {
    question: "Choose a pet:",
    options: ["Dog 🐶", "Cat 🐱", "Parrot 🦜", "Lizard 🦎"],
  },
];

// Keywords for Met Museum API search
const keywords = {
  Fire: "fire",
  Water: "water",
  Earth: "earth",
  Air: "air",
};

// Elements mapping
const elements = {
  "Red 🔴": "Fire",
  "Blue 🔵": "Water",
  "Green 🟢": "Earth",
  "Yellow 🟡": "Air",
  "Hiking 🥾": "Earth",
  "Swimming 🏊": "Water",
  "Flying ✈️": "Air",
  "Bonfire 🔥": "Fire",
  "Dog 🐶": "Earth",
  "Cat 🐱": "Fire",
  "Parrot 🦜": "Air",
  "Lizard 🦎": "Water",
};

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);
  const [dogImg, setDogImg] = useState(null);
  const [catImg, setCatImg] = useState(null);

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function determineElement(answers) {
    const counts = {};
    answers.forEach(function (answer) {
      const el = elements[answer];
      counts[el] = (counts[el] || 0) + 1;
    });
    return Object.keys(counts).reduce(function (a, b) {
      return counts[a] > counts[b] ? a : b;
    });
  }

  // Fetch Met Museum artwork based on element
  async function fetchArtwork(keyword) {
    try {
      const res = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}&hasImages=true`
      );
      const data = await res.json();
      if (data.objectIDs && data.objectIDs.length > 0) {
        const artId = data.objectIDs[0];
        const artRes = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artId}`
        );
        const artData = await artRes.json();
        setArtwork(artData);
      } else {
        setArtwork(null);
      }
    } catch {
      setArtwork(null);
    }
  }

  // Fetch random dog image
  async function fetchDog() {
    try {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await res.json();
      setDogImg(data.message);
    } catch {
      setDogImg(null);
    }
  }

  // Fetch random cat image
  async function fetchCat() {
    try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await res.json();
      setCatImg(data[0].url);
    } catch {
      setCatImg(null);
    }
  }

  useEffect(function () {
    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
      fetchDog();
      fetchCat();
    }
    // eslint-disable-next-line
  }, [currentQuestionIndex]);

  return (
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route
          path="/quiz"
          element={
            currentQuestionIndex < questions.length ? (
              <Question
                question={questions[currentQuestionIndex].question}
                options={questions[currentQuestionIndex].options}
                onAnswer={handleAnswer}
              />
            ) : (
              <Results
                element={element}
                artwork={artwork}
                dogImg={dogImg}
                catImg={catImg}
              />
            )
          }
        />
      </Routes>
    </UserProvider>
  );
}