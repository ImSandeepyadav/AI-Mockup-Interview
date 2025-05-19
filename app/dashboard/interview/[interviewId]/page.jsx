"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const { interviewId } = use(params);
  const [interviewData, setInterviewData] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));
    setInterviewData(result[0]);
  };

  return (
    <div className="my-10 max-w-5xl mx-auto px-4">
      <h2 className="font-bold text-3xl mb-6">🎯 Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section - Interview Info */}
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-lg border shadow-sm bg-white">
            <h2 className="mb-2">
              <strong>Job Role / Position: </strong>
              {interviewData?.jobPosition}
            </h2>
            <h2 className="mb-2">
              <strong>Tech Stack / Description: </strong>
              {interviewData?.jobDesc}
            </h2>
            <h2>
              <strong>Years of Experience: </strong>
              {interviewData?.jobExperience}
            </h2>
          </div>

          <div className="p-5 rounded-lg border border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-600 font-semibold">
              <Lightbulb /> Important Information
            </h2>
            <p className="mt-3 text-yellow-600 text-sm leading-relaxed">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </p>
          </div>
        </div>

        {/* Right Section - Webcam */}
        <div className="flex flex-col items-center justify-center gap-4 p-5 border rounded-lg bg-white shadow-sm">
          {webcamEnabled ? (
            <Webcam
              audio
              mirrored
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={() => setWebcamEnabled(false)}
              style={{ height: 300, width: 300, borderRadius: "12px" }}
            />
          ) : (
            <>
              <WebcamIcon className="h-60 w-60 p-6 text-gray-400 bg-gray-100 rounded-xl border" />
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                onClick={() => setWebcamEnabled(true)}
              >
                Enable Webcam & Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Start Interview Button */}
      <div className="flex justify-end mt-10">
        <Link href={`/dashboard/interview/${interviewId}/start`}>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
