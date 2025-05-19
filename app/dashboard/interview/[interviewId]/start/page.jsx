"use client";
import React, { use, useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionSection from "./_components/QuestionSection";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const RecordAnswerSection = dynamic(
  () => import("./_components/RecordAnswerSection"),
  {
    ssr: false,
  }
);

function StartInterview({ params }) {
  const { interviewId } = use(params);
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestion, setActiveQuestion] = useState(0);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));
    const jsonMockResp = JSON.parse(result[0].jsonMockResp);
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestion={activeQuestion}
          setActiveQuestion={setActiveQuestion}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestion={activeQuestion}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestion > 0 && <Button onClick={() => setActiveQuestion(activeQuestion - 1)}>Previous Question</Button>}
        {activeQuestion != mockInterviewQuestion?.length - 1 && (
          <Button onClick={() => setActiveQuestion(activeQuestion + 1)}>Next Question</Button>
        )}
        {activeQuestion == mockInterviewQuestion?.length - 1 && (
          <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
          <Button>End Question</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
