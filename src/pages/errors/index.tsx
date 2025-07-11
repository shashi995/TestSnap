"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Mail } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Assessment Error
          </CardTitle>
          <CardDescription className="text-gray-600">
            We encountered an issue while loading your assessment. This may be
            due to a technical problem or an expired session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 text-center mb-3">
              If the problem persists, please contact support:
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
              <Mail className="h-4 w-4" />
              <span>support@assessments.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
