import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    // Navigate to a main portal or landing page
    window.location.href = "/";
  };

  const isAssessmentRoute = location.pathname.includes("/assessment/");
  const assessmentId = location.pathname
    .split("/assessment/")[1]
    ?.split("/")[0];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {isAssessmentRoute ? "Assessment Not Found" : "Page Not Found"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isAssessmentRoute
              ? "The assessment link you're trying to access is invalid, expired, or doesn't exist."
              : "The page you're looking for doesn't exist or may have been moved."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAssessmentRoute && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Possible reasons:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• The assessment link has expired</li>
                <li>• The assessment ID is incorrect</li>
                <li>• You don't have permission to access this assessment</li>
                <li>• The assessment has been completed or cancelled</li>
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={handleGoBack}
              className="w-full bg-transparent"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>

            <Button onClick={handleGoHome} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Return to Portal
            </Button>
          </div>

          {isAssessmentRoute && assessmentId && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 text-center">
                <strong>Assessment ID:</strong> {assessmentId}
                <br />
                <strong>Requested Path:</strong> {location.pathname}
                <br />
                <strong>Timestamp:</strong> {new Date().toISOString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
