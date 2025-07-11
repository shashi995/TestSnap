"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Camera, CheckCircle, Clock, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function AssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const [isProctoring] = useState(true);
  const [proctoringFlags, setProctoringFlags] = useState(0);
  const params = useParams();
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const navigate = useNavigate();
  // Mock questions
  const questions = [
    {
      id: 1,
      type: "mcq",
      question: "What is the primary purpose of React hooks?",
      options: [
        "To replace class components entirely",
        "To manage state and lifecycle in functional components",
        "To improve performance of React applications",
        "To handle routing in React applications",
      ],
      skill: "React Development",
      difficulty: "Medium",
    },
    {
      id: 2,
      type: "mcq",
      question: "Which of the following is NOT a valid HTTP status code?",
      options: ["200", "404", "500", "999"],
      skill: "Web Development",
      difficulty: "Easy",
    },
    {
      id: 3,
      type: "subjective",
      question:
        "Explain the concept of database normalization and provide an example of how you would normalize a denormalized table.",
      skill: "Database Management",
      difficulty: "Hard",
    },
  ];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Proctoring simulation
  useEffect(() => {
    if (isProctoring) {
      const proctoringInterval = setInterval(() => {
        // Simulate random proctoring events
        if (Math.random() < 0.1) {
          // 10% chance of flag
          setProctoringFlags((prev) => prev + 1);
        }
      }, 5000); // Every 5 seconds

      return () => clearInterval(proctoringInterval);
    }
  }, [isProctoring]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || "");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || "");
    }
  };

  console.log("params", params);

  const handleSubmitAssessment = () => {
    navigate(`/assessment/${params.assessment_id}/success`, {
      replace: true,
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Assessment Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold">Technical Assessment</h1>
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Proctoring Status */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Camera className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Recording</span>
                </div>
                {proctoringFlags > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {proctoringFlags} flags
                  </Badge>
                )}
              </div>

              {/* Timer */}
              <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="font-mono text-red-600">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      Question {currentQuestion + 1}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">{currentQ.skill}</Badge>
                      <Badge
                        variant={
                          currentQ.difficulty === "Easy"
                            ? "secondary"
                            : currentQ.difficulty === "Medium"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {currentQ.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Type: {currentQ.type.toUpperCase()}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {currentQ.question}
                </div>

                {/* MCQ Options */}
                {currentQ.type === "mcq" && currentQ.options && (
                  <RadioGroup
                    value={selectedAnswer}
                    onValueChange={handleAnswerChange}
                  >
                    <div className="space-y-3">
                      {currentQ.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`option-${index}`}
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {/* Subjective Answer */}
                {currentQ.type === "subjective" && (
                  <div className="space-y-2">
                    <Label htmlFor="subjective-answer">Your Answer</Label>
                    <Textarea
                      id="subjective-answer"
                      placeholder="Type your detailed answer here..."
                      value={selectedAnswer}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <p className="text-sm text-gray-500">
                      Minimum 100 words recommended for detailed evaluation
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>

                  <div className="space-x-2">
                    {currentQuestion === questions.length - 1 ? (
                      <Button
                        onClick={handleSubmitAssessment}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Submit Assessment
                      </Button>
                    ) : (
                      <Button onClick={handleNext}>Next Question</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Proctoring Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Proctoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Camera Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <Camera className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Face Detection</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Integrity Flags</span>
                  <Badge
                    variant={proctoringFlags > 0 ? "destructive" : "secondary"}
                  >
                    {proctoringFlags}
                  </Badge>
                </div>

                {proctoringFlags > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Proctoring flags detected. Please ensure you're looking at
                      the screen.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Question Navigator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        index === currentQuestion
                          ? "default"
                          : answers[index]
                          ? "secondary"
                          : "outline"
                      }
                      size="sm"
                      className="aspect-square p-0"
                      onClick={() => {
                        setCurrentQuestion(index);
                        setSelectedAnswer(answers[index] || "");
                      }}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border border-gray-300 rounded"></div>
                    <span>Not Answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assessment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span>{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span>{Object.keys(answers).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span>{questions.length - Object.keys(answers).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Limit:</span>
                  <span>60 minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
