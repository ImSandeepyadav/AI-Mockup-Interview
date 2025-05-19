'use client'
import { Button } from "@/components/ui/button";
import { Mic, WebcamIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import moment from "moment";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestion, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const user = useUser();
  const [loading, setloading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    results.map((result) =>
      setUserAnswer(prevAns => prevAns + result?.transcript)
    )
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  }

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);

    setloading(true);
    const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestion]?.question +
      ", User Answer:" + userAnswer + ", Depends on question and user answer for give interview question " +
      " please give us rating for answer and feedback as area of improvment if any " +
      "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    const result = await chatSession.sendMessage(feedbackPrompt);
    const MockJsonResp = result.response
      .text()
      .replace(/```json/, "")
      .replace(/```/, "");
    console.log(JSON.parse(MockJsonResp));
    const JsonFeedbackResp = JSON.parse(MockJsonResp);

    const resp = await db.insert(UserAnswer)
      .values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestion]?.question,
        correctAns: mockInterviewQuestion[activeQuestion]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY')
      });

    if (resp) {
      toast('User Answer Recorded Successfully');
      setUserAnswer('');
      setResults([]);
    }

    setResults([]);
    setloading(false);
  }

  return (
    <div className="flex justify-center items-center flex-col px-4">
      <div className="flex flex-col justify-center mt-20 items-center bg-white border rounded-xl p-5 shadow-md w-full max-w-xl relative overflow-hidden">
        <WebcamIcon width={180} height={180} className="absolute opacity-10" />
        <Webcam
          mirrored={true}
          className="z-10 relative rounded-lg object-cover w-full h-[350px]"
        />
      </div>

      <Button
        variant="default"
        className="my-10 px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        onClick={StartStopRecording}
        disabled={loading}
      >
        {isRecording ? (
          <h2 className="text-white flex gap-2 items-center">
            <Mic className="animate-pulse" /> Recording...
          </h2>
        ) : (
          "🎤 Record Answer"
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
