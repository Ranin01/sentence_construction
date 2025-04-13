import { useEffect, useState } from 'react';
import './App.css';

const questions = [
  {
    sentence: 'The quick ___ fox jumps over the ___ dog.',
    blanks: 2,
    options: ['brown', 'lazy', 'red', 'fast'],
    correctAnswers: ['brown', 'lazy'],
  },
  {
    sentence: 'She sells ___ by the ___ shore.',
    blanks: 2,
    options: ['shells', 'sea', 'sand', 'snails'],
    correctAnswers: ['shells', 'sea'],
  },
  {
    sentence: 'The sky is ___ and the clouds are ___.',
    blanks: 2,
    options: ['blue', 'white', 'gray', 'clear'],
    correctAnswers: ['blue', 'white'],
  },
  {
    sentence: 'A journey of a thousand miles begins with a single ___.',
    blanks: 1,
    options: ['step', 'move', 'run', 'idea'],
    correctAnswers: ['step'],
  },
  {
    sentence: 'Practice makes ___.',
    blanks: 1,
    options: ['perfect', 'progress', 'easy', 'power'],
    correctAnswers: ['perfect'],
  },
  {
    sentence: 'To be or not to be, that is the ___.',
    blanks: 1,
    options: ['question', 'answer', 'truth', 'point'],
    correctAnswers: ['question'],
  },
  {
    sentence: 'All that glitters is not ___.',
    blanks: 1,
    options: ['gold', 'silver', 'real', 'bright'],
    correctAnswers: ['gold'],
  },
  {
    sentence: 'Better late than ___.',
    blanks: 1,
    options: ['never', 'early', 'sorry', 'rude'],
    correctAnswers: ['never'],
  },
  {
    sentence: 'A picture is worth a thousand ___.',
    blanks: 1,
    options: ['words', 'emotions', 'frames', 'colors'],
    correctAnswers: ['words'],
  },
  {
    sentence: 'Don’t count your ___ before they hatch.',
    blanks: 1,
    options: ['chickens', 'eggs', 'plans', 'coins'],
    correctAnswers: ['chickens'],
  },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(Array(questions[0].blanks).fill(null));
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          handleNext();
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [current]);

  const q = questions[current];

  const handleOptionClick = (word) => {
    if (selected.includes(word)) return;
    const nextBlank = selected.findIndex((s) => s === null);
    if (nextBlank !== -1) {
      const newSelected = [...selected];
      newSelected[nextBlank] = word;
      setSelected(newSelected);
    }
  };

  const handleUnselect = (index) => {
    const newSelected = [...selected];
    newSelected[index] = null;
    setSelected(newSelected);
  };

  const handleNext = () => {
    const correct = selected.every((word, i) => word === q.correctAnswers[i]);
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, selected]);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(Array(questions[current + 1].blanks).fill(null));
      setTimer(30);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="container">
        <h2 className="title">Quiz Completed!</h2>
        <p className="score">Your Score: {score} / {questions.length}</p>
        {questions.map((q, i) => (
          <div key={i} className="result">
            <p><strong>Q{i + 1}:</strong> {q.sentence}</p>
            <p>Your answers: <span>{answers[i].join(', ')}</span></p>
            <p>Correct answers: <span>{q.correctAnswers.join(', ')}</span></p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="title">Fill in the blanks</h2>
      <p className="timer">⏱ {timer}s</p>
      <p className="sentence">
        {q.sentence.split(' ').map((word, i) => {
          if (word === '___') {
            const blankIndex = q.sentence
              .split(' ')
              .slice(0, i + 1)
              .filter((w) => w === '___').length - 1;
            return (
              <button
                key={i}
                onClick={() => handleUnselect(blankIndex)}
                className="blank"
              >
                {selected[blankIndex] || '___'}
              </button>
            );
          }
          return <span key={i}>{word} </span>;
        })}
      </p>

      <div className="options">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleOptionClick(opt)}
            disabled={selected.includes(opt)}
            className="option-btn"
          >
            <em>{opt}</em>
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={selected.includes(null)}
        className="next-btn"
      >
        Next
      </button>
    </div>
  );
}
