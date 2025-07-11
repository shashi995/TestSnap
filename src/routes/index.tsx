import ErrorPage from "@/pages/errors/misc-errors";
import PreTestPage from "@/pages/pre-test";
import SuccessPage from "@/pages/success";
import AssessmentVerify from "@/pages/verify";
import { createBrowserRouter, Navigate } from "react-router";

const router = createBrowserRouter([
  {
    path: "/assessment/:assessment_id/pre-check",
    element: <AssessmentVerify />,
  },
  {
    path: "/assessment/:assessment_id/test",
    element: <PreTestPage />,
  },
  {
    path: "/assessment/:assessment_id/submit",
    element: <>submit</>,
  },
  {
    path: "/assessment/:assessment_id/success",
    element: <SuccessPage />,
  },
  {
    path: "/assessment/:assessment_id/result",
    element: <>result</>,
  },
  {
    path: "/error",
    element: <ErrorPage />,
  },
  {
    path: "*",
    element: <Navigate to="/error" replace />,
  },
]);

export default router;
