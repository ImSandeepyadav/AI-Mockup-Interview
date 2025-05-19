import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionSection({ mockInterviewQuestion, activeQuestion, setActiveQuestion }) {
  const textToSpeach = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support Text To Speech');
    }
  };

  return mockInterviewQuestion && (
    <div className="p-6 border rounded-lg my-10 bg-white shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockInterviewQuestion.map((_, index) => (
          <h2
            key={index}
            onClick={() => setActiveQuestion(index)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm text-center cursor-pointer transition-all duration-300
              ${
                activeQuestion === index
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3">
        <h2 className="text-md md:text-lg font-medium flex-1">
          {mockInterviewQuestion[activeQuestion]?.question}
        </h2>
        <Volume2
          className="cursor-pointer text-blue-600 hover:text-blue-800 transition"
          onClick={() =>
            textToSpeach(mockInterviewQuestion[activeQuestion]?.question)
          }
        />
      </div>

      <div className="border rounded-lg p-5 bg-gradient-to-r from-blue-100 to-blue-200 mt-12">
        <h2 className="flex gap-2 items-center text-blue-700 font-semibold">
          <Lightbulb />
          Note:
        </h2>
        <h2 className="text-sm text-blue-800 mt-2">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </h2>
      </div>
    </div>
  );
}

export default QuestionSection;
