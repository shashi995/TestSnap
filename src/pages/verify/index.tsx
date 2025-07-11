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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Clock,
  FileText,
  Mic,
  Monitor,
  Play,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

// Mock assessment data - in real app this would come from API
const mockAssessment = {
  id: "1",
  title: "Senior Frontend Developer Assessment",
  company: "TechCorp Inc.",
  duration: 90,
  type: "Technical Interview",
  sections: [
    { name: "Coding Challenge", duration: 45, type: "practical" },
    { name: "System Design", duration: 30, type: "discussion" },
    { name: "Behavioral Questions", duration: 15, type: "interview" },
  ],
  requirements: {
    webcam: true,
    microphone: true,
    fullscreen: true,
    recording: true,
  },
  instructions: [
    "Ensure you have a stable internet connection throughout the assessment",
    "Find a quiet, well-lit environment free from distractions",
    "Have a valid ID ready for verification if requested",
    "You may use external resources and documentation during coding challenges",
    "Screen sharing and recording will be active during the session",
    "Contact support immediately if you experience technical difficulties",
  ],
};

export default function AssessmentVerify() {
  const navigate = useNavigate();
  const params = useParams();
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    fullscreen: false,
  });
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);

  const requestCameraPermission = async () => {
    setIsRequestingPermissions(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissions((prev) => ({ ...prev, camera: true }));
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream after permission granted
    } catch (error) {
      console.error("Camera permission denied:", error);
    }
    setIsRequestingPermissions(false);
  };

  const requestMicrophonePermission = async () => {
    setIsRequestingPermissions(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissions((prev) => ({ ...prev, microphone: true }));
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Microphone permission denied:", error);
    }
    setIsRequestingPermissions(false);
  };

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setPermissions((prev) => ({ ...prev, fullscreen: true }));
    }
  };

  const allRequirementsMet =
    permissions.camera &&
    permissions.microphone &&
    permissions.fullscreen &&
    instructionsAccepted;

  const startAssessment = () => {
    console.log("params", params);
    navigate(`/assessment/${params.assessment_id}/test`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}

        {/* Assessment Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {mockAssessment.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {mockAssessment.company}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {mockAssessment.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-sm">
                  Duration: {mockAssessment.duration} minutes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-sm">
                  {mockAssessment.sections.length} sections
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                <span className="text-sm">Proctored assessment</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="font-medium mb-2">Assessment Sections:</h4>
              <div className="space-y-2">
                {mockAssessment.sections.map((section, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{section.name}</span>
                    <Badge variant="outline">{section.duration} min</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>System Requirements</CardTitle>
            <CardDescription>
              Grant the following permissions to proceed with your assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera Permission */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="font-medium">Camera Access</p>
                  <p className="text-sm text-slate-600">
                    Required for identity verification and proctoring
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {permissions.camera ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Button
                    onClick={requestCameraPermission}
                    disabled={isRequestingPermissions}
                    size="sm"
                  >
                    Grant Access
                  </Button>
                )}
              </div>
            </div>

            {/* Microphone Permission */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="font-medium">Microphone Access</p>
                  <p className="text-sm text-slate-600">
                    Required for audio recording during the assessment
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {permissions.microphone ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Button
                    onClick={requestMicrophonePermission}
                    disabled={isRequestingPermissions}
                    size="sm"
                  >
                    Grant Access
                  </Button>
                )}
              </div>
            </div>

            {/* Fullscreen Mode */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="font-medium">Fullscreen Mode</p>
                  <p className="text-sm text-slate-600">
                    Assessment must be taken in fullscreen mode
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {permissions.fullscreen ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Button onClick={requestFullscreen} size="sm">
                    Enable Fullscreen
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Instructions</CardTitle>
            <CardDescription>
              Please read and accept the following instructions before
              proceeding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {mockAssessment.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{instruction}</p>
                </div>
              ))}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This assessment is monitored and recorded. Any suspicious
                activity may result in disqualification.
              </AlertDescription>
            </Alert>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="instructions"
                checked={instructionsAccepted}
                onCheckedChange={(checked) =>
                  setInstructionsAccepted(checked as boolean)
                }
              />
              <label
                htmlFor="instructions"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and accept the assessment instructions
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Start Assessment */}
        <div className="text-center">
          <Button
            onClick={startAssessment}
            disabled={!allRequirementsMet}
            size="lg"
            className="px-8"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Assessment
          </Button>
          {!allRequirementsMet && (
            <p className="text-sm text-slate-600 mt-2">
              Please complete all setup requirements above to start your
              assessment
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
