"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, Filter, Search, PlusCircle } from "lucide-react";

function Questions() {
  const { user, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", description: "" });
  
  // Example questions data
  const [questions, setQuestions] = useState([
    {
      id: "1",
      title: "How do I implement authentication in my Next.js project?",
      description: "I'm trying to add user authentication to my project. What are the best practices?",
      author: {
        name: "Alex Johnson",
        avatar: "/api/placeholder/40/40"
      },
      date: "3 days ago",
      replies: 8,
      likes: 12,
      tags: ["next.js", "authentication"]
    },
    {
      id: "2",
      title: "What's the best way to handle form submission in React?",
      description: "I need to create a complex form with validation. Any recommendations?",
      author: {
        name: "Jamie Smith",
        avatar: "/api/placeholder/40/40"
      },
      date: "1 week ago",
      replies: 15,
      likes: 24,
      tags: ["react", "forms"]
    },
    {
      id: "3",
      title: "How can I optimize image loading in my application?",
      description: "My website is loading slowly because of large images. What should I do?",
      author: {
        name: "Taylor Wilson",
        avatar: "/api/placeholder/40/40"
      },
      date: "2 weeks ago",
      replies: 6,
      likes: 9,
      tags: ["performance", "images"]
    }
  ]);

  // Filter questions based on active tab and search query
  const filteredQuestions = questions.filter(question => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = question.title.toLowerCase().includes(query);
      const matchesDescription = question.description.toLowerCase().includes(query);
      const matchesTags = question.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!(matchesTitle || matchesDescription || matchesTags)) {
        return false;
      }
    }
    
    if (activeTab === "my" && user?.fullName !== question.author.name) {
      return false;
    }
    
    return true;
  });

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    
    if (newQuestion.title.trim() === "" || newQuestion.description.trim() === "") {
      return;
    }
    
    const newQuestionObj = {
      id: (questions.length + 1).toString(),
      title: newQuestion.title,
      description: newQuestion.description,
      author: {
        name: user?.fullName || "Anonymous User",
        avatar: user?.imageUrl || "/api/placeholder/40/40"
      },
      date: "Just now",
      replies: 0,
      likes: 0,
      tags: ["new"]
    };
    
    setQuestions([newQuestionObj, ...questions]);
    setNewQuestion({ title: "", description: "" });
    setShowAskForm(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Questions</h1>
          <p className="text-gray-500">Find answers, ask questions, and connect with our community</p>
        </div>
        
        {isSignedIn && (
          <Button 
            className="flex items-center gap-2" 
            onClick={() => setShowAskForm(!showAskForm)}
          >
            <PlusCircle className="h-4 w-4" />
            Ask a Question
          </Button>
        )}
      </div>
      
      {showAskForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ask a New Question</CardTitle>
            <CardDescription>
              Be specific and provide details to get better answers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitQuestion}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="question-title">
                  Question Title
                </label>
                <Input 
                  id="question-title"
                  placeholder="What do you want to know?"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="question-details">
                  Details
                </label>
                <Textarea 
                  id="question-details"
                  placeholder="Provide more context about your question..."
                  rows={5}
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({...newQuestion, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">Post Question</Button>
                <Button variant="outline" type="button" onClick={() => setShowAskForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Questions</TabsTrigger>
            {isSignedIn && <TabsTrigger value="my">My Questions</TabsTrigger>}
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search questions..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-xl">{question.title}</CardTitle>
                  <div className="flex gap-1">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <CardDescription className="mt-2">{question.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={question.author.avatar} alt={question.author.name} />
                    <AvatarFallback>{question.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-medium">{question.author.name}</span>
                    <span className="text-gray-500 ml-2">{question.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{question.replies}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{question.likes}</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-xl font-medium">No questions found</p>
          <p className="text-gray-500 mt-2">
            {searchQuery ? "Try adjusting your search" : "Be the first to ask a question!"}
          </p>
        </div>
      )}
    </div>
  );
}

export default Questions;