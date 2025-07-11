"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ClipboardCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

type TestData =
  | {
      name?: string;
      email?: string;
      test?: string;
      success?: boolean;
      message?: string;
      ended_at?: string;
    }
  | {
      error?: string;
    };

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading test data from URL params or API
    const loadTestData = async () => {
      try {
        // Get data from URL search params
        const name = searchParams.get("name");
        const email = searchParams.get("email");
        const test = searchParams.get("test");
        const success = searchParams.get("success");
        const message = searchParams.get("message");
        const ended_at = searchParams.get("ended_at");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          setTestData({ error: errorParam });
        } else {
          setTestData({
            name: name || undefined,
            email: email || undefined,
            test: test || undefined,
            success: success === "true",
            message: message || undefined,
            ended_at: ended_at || new Date().toISOString(),
          });
        }
      } catch (err) {
        setError("Failed to load test data");
        console.error("Error loading test data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTestData();
  }, [searchParams]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !testData || ("error" in testData && testData.error)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                An error occurred while loading your test results
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format the date for display with fallback
  let formattedDate = "Not available";
  try {
    if ("ended_at" in testData && testData.ended_at) {
      const completedAt = new Date(testData.ended_at);
      formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(completedAt);
    }
  } catch (dateErr) {
    console.error("Error formatting date:", dateErr);
    // Keep the fallback value
  }

  // Success state
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="flex flex-col items-center space-y-3 pb-2 text-center">
          <ClipboardCheck className="h-10 w-10 text-green-600" />
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Assessment Completed</h1>
            <p className="text-sm text-slate-600">
              {"message" in testData && testData.message
                ? testData.message
                : "Your assessment has been submitted successfully"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm font-medium text-slate-500">Name:</p>
              <p className="text-sm text-right">
                {"name" in testData
                  ? testData.name || "Not provided"
                  : "Not provided"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm font-medium text-slate-500">Email:</p>
              <p className="text-sm text-right">
                {"email" in testData
                  ? testData.email || "Not provided"
                  : "Not provided"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm font-medium text-slate-500">Test:</p>
              <p className="text-sm text-right">
                {"test" in testData
                  ? testData.test || "Not specified"
                  : "Not specified"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm font-medium text-slate-500">
                Completed at:
              </p>
              <p className="text-sm text-right">{formattedDate}</p>
            </div>
            {"success" in testData && testData.success === false && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  There may have been an issue with your submission. Please
                  contact support.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
