import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import { Layout } from "./components/Layout";

const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Services = lazy(() => import("./pages/Services").then(m => ({ default: m.Services })));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail").then(m => ({ default: m.ServiceDetail })));
const Compliance = lazy(() => import("./pages/Compliance").then(m => ({ default: m.Compliance })));
const Careers = lazy(() => import("./pages/Careers").then(m => ({ default: m.Careers })));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const Privacy = lazy(() => import("./pages/Privacy").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then(m => ({ default: m.Terms })));
const LabourLawAssist = lazy(() => import("./pages/LabourLawAssist").then(m => ({ default: m.LabourLawAssist })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

function Wrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <Wrap><Home /></Wrap> },
      { path: "about", element: <Wrap><About /></Wrap> },
      { path: "services", element: <Wrap><Services /></Wrap> },
      { path: "services/:slug", element: <Wrap><ServiceDetail /></Wrap> },
      { path: "compliance", element: <Wrap><Compliance /></Wrap> },
      { path: "careers", element: <Wrap><Careers /></Wrap> },
      { path: "assist", element: <Wrap><LabourLawAssist /></Wrap> },
      { path: "contact", element: <Wrap><Contact /></Wrap> },
      { path: "privacy", element: <Wrap><Privacy /></Wrap> },
      { path: "terms", element: <Wrap><Terms /></Wrap> },
      { path: "*", element: <Wrap><NotFound /></Wrap> },
    ],
  },
]);
