import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactGA from "react-ga4";
import AppLayout from "@/components/layout/AppLayout";
import TrackedRoute from "@/components/layout/TrackedRoute";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Home from "@/pages/home";
import Document from "@/pages/document";
import Documents from "@/pages/documents";
import Collection from "@/pages/collection";
import Collections from "@/pages/collections";
import Person from "@/pages/person";
import People from "@/pages/people";
import Place from "@/pages/place";
import Places from "@/pages/places";
import Event from "@/pages/event";
import Events from "@/pages/events";
import Search from "@/pages/search";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

ReactGA.initialize([
  {
    trackingId: "G-BSMMFGB9DW",
    gaOptions: { anonymizeIp: true },
  },
]);

function MyRouter() {
  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <TrackedRoute path="/" component={Home} />
        <TrackedRoute path="/documents/:slug" component={Document} />
        <TrackedRoute path="/documents" component={Documents} />
        <TrackedRoute path="/collections/:slug" component={Collection} />
        <TrackedRoute path="/collections" component={Collections} />
        <TrackedRoute path="/people/:slug" component={Person} />
        <TrackedRoute path="/people" component={People} />
        <TrackedRoute path="/places/:slug" component={Place} />
        <TrackedRoute path="/places" component={Places} />
        <TrackedRoute path="/events/:slug" component={Event} />
        <TrackedRoute path="/events" component={Events} />
        <TrackedRoute path="/search" component={Search} />
        <TrackedRoute path="/about" component={About} />
        <TrackedRoute path="/contact" component={Contact} />
        <TrackedRoute component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <MyRouter />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
