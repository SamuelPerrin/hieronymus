import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/AppLayout";
import Home from "@/pages/home";
import Document from "@/pages/document";
import Collection from "@/pages/collection";
import Person from "@/pages/person";
import Place from "@/pages/place";
import Event from "@/pages/event";
import Search from "@/pages/search";
import About from "@/pages/about";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/documents/:slug" component={Document} />
      <Route path="/collections/:slug" component={Collection} />
      <Route path="/people/:slug" component={Person} />
      <Route path="/places/:slug" component={Place} />
      <Route path="/events/:slug" component={Event} />
      <Route path="/search" component={Search} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <Router />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
