import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/AppLayout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Home from "@/pages/home";
import Document from "@/pages/document";
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

const base = process.env.NODE_ENV === "production" ? "/hieronymus" : "/";

function MyRouter() {
  return (
    <Router base={base}>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/documents/:slug" component={Document} />
        <Route path="/collections/:slug" component={Collection} />
        <Route path="/collections" component={Collections} />
        <Route path="/people/:slug" component={Person} />
        <Route path="/people" component={People} />
        <Route path="/places/:slug" component={Place} />
        <Route path="/places" component={Places} />
        <Route path="/events/:slug" component={Event} />
        <Route path="/events" component={Events} />
        <Route path="/search" component={Search} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
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
