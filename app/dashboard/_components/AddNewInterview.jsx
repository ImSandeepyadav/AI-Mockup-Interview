"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);
    const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on this information, please give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format. Use 'question' and 'answer' as keys.`;
    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = result.response
      .text()
      .replace(/```json/, "")
      .replace(/```/, "");
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);

    if (MockJsonResp) {
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID:", resp);
      if (resp) {
        setOpenDailog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } else {
      console.log("error");
    }
    setLoading(false);
  };

  return (
    <div
      className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
      onClick={() => setOpenDailog(true)}
    >
      <div className="text-lg text-center">+ Add New</div>
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell Us More About Your JobInterview
            </DialogTitle>
            <DialogDescription asChild>
              <div>
                <form onSubmit={onSubmit}>
                  <div>
                    <p className="mb-4">
                      Add Details About Your Job Position/Role, Job Description
                      And Years of Experience
                    </p>
                    <div className="mt-7 my-3">
                      <label>Job Role/Job Position</label>
                      <Input
                        placeholder="Ex. Full Stack Developer"
                        required
                        onChange={(e) => setJobPosition(e.target.value)}
                      />
                    </div>
                    <div className="my-3">
                      <label>Job Description/Tech Stack (In Short)</label>
                      <Textarea
                        placeholder="Ex. JavaScript, React, Nextjs, Nodejs, Etc.."
                        required
                        onChange={(e) => setJobDesc(e.target.value)}
                      />
                    </div>
                    <div className="my-3">
                      <label>Years Of Experience</label>
                      <Input
                        placeholder="Ex. 5"
                        type="number"
                        required
                        max="100"
                        onChange={(e) => setJobExperience(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-5 justify-end mt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpenDailog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                      >
                        {loading ? (
                          <>
                            <LoaderCircle className="animate-spin mr-2" />
                            Generating From AI
                          </>
                        ) : (
                          "Start Interview"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
