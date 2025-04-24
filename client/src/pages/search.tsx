import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Document, Person, Place, Event } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, User, MapPin, Calendar, ExternalLink } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";
import { extractExcerpt } from "@/lib/markdownUtils";
import { motion } from "framer-motion";

const SearchPage = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const queryParam = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("all");

  // Fetch search results
  const { data: results, isLoading } = useQuery({
    queryKey: [`/api/search?q=${encodeURIComponent(queryParam)}`],
    enabled: queryParam.length > 0,
  });

  // Update title
  useEffect(() => {
    document.title = queryParam
      ? `Search: ${queryParam} | Archival Histories`
      : "Search | Archival Histories";
  }, [queryParam]);

  // Count total results
  const totalResults =
    (results?.documents?.length || 0) +
    (results?.people?.length || 0) +
    (results?.places?.length || 0) +
    (results?.events?.length || 0);

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Search", current: true },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-serif font-bold text-accent-900 dark:text-white mb-6">
            {queryParam ? `Search Results: "${queryParam}"` : "Search Archives"}
          </h1>

          <div className="mb-8">
            <SearchBar initialQuery={queryParam} />
          </div>

          {queryParam ? (
            isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : results ? (
              <div>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Found {totalResults} result{totalResults !== 1 ? "s" : ""}
                  </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">
                      All Results ({totalResults})
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                      Documents ({results.documents?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="people">
                      People ({results.people?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="places">
                      Places ({results.places?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="events">
                      Events ({results.events?.length || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-6">
                    {totalResults === 0 ? (
                      <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                        <CardContent className="pt-6">
                          <p className="text-accent-700 dark:text-primary-200">
                            No results found for "{queryParam}".
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        {results.documents && results.documents.length > 0 && (
                          <div>
                            <h2 className="text-lg font-serif font-bold text-accent-900 dark:text-white mb-4 flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-primary" /> Documents
                            </h2>
                            <div className="space-y-4">
                              {results.documents.slice(0, 3).map((doc) => (
                                <SearchResultDocument key={doc.id} document={doc} />
                              ))}
                              {results.documents.length > 3 && (
                                <div className="text-right">
                                  <button
                                    onClick={() => setActiveTab("documents")}
                                    className="text-primary hover:text-primary/80 text-sm"
                                  >
                                    View all {results.documents.length} documents
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {results.people && results.people.length > 0 && (
                          <div>
                            <h2 className="text-lg font-serif font-bold text-accent-900 dark:text-white mb-4 flex items-center">
                              <User className="h-5 w-5 mr-2 text-primary" /> People
                            </h2>
                            <div className="space-y-4">
                              {results.people.slice(0, 3).map((person) => (
                                <SearchResultPerson key={person.id} person={person} />
                              ))}
                              {results.people.length > 3 && (
                                <div className="text-right">
                                  <button
                                    onClick={() => setActiveTab("people")}
                                    className="text-primary hover:text-primary/80 text-sm"
                                  >
                                    View all {results.people.length} people
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {results.places && results.places.length > 0 && (
                          <div>
                            <h2 className="text-lg font-serif font-bold text-accent-900 dark:text-white mb-4 flex items-center">
                              <MapPin className="h-5 w-5 mr-2 text-primary" /> Places
                            </h2>
                            <div className="space-y-4">
                              {results.places.slice(0, 3).map((place) => (
                                <SearchResultPlace key={place.id} place={place} />
                              ))}
                              {results.places.length > 3 && (
                                <div className="text-right">
                                  <button
                                    onClick={() => setActiveTab("places")}
                                    className="text-primary hover:text-primary/80 text-sm"
                                  >
                                    View all {results.places.length} places
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {results.events && results.events.length > 0 && (
                          <div>
                            <h2 className="text-lg font-serif font-bold text-accent-900 dark:text-white mb-4 flex items-center">
                              <Calendar className="h-5 w-5 mr-2 text-primary" /> Events
                            </h2>
                            <div className="space-y-4">
                              {results.events.slice(0, 3).map((event) => (
                                <SearchResultEvent key={event.id} event={event} />
                              ))}
                              {results.events.length > 3 && (
                                <div className="text-right">
                                  <button
                                    onClick={() => setActiveTab("events")}
                                    className="text-primary hover:text-primary/80 text-sm"
                                  >
                                    View all {results.events.length} events
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    {results.documents && results.documents.length > 0 ? (
                      results.documents.map((doc) => (
                        <SearchResultDocument key={doc.id} document={doc} />
                      ))
                    ) : (
                      <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                        <CardContent className="pt-6">
                          <p className="text-accent-700 dark:text-primary-200">
                            No document results found for "{queryParam}".
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="people" className="space-y-4">
                    {results.people && results.people.length > 0 ? (
                      results.people.map((person) => (
                        <SearchResultPerson key={person.id} person={person} />
                      ))
                    ) : (
                      <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                        <CardContent className="pt-6">
                          <p className="text-accent-700 dark:text-primary-200">
                            No people results found for "{queryParam}".
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="places" className="space-y-4">
                    {results.places && results.places.length > 0 ? (
                      results.places.map((place) => (
                        <SearchResultPlace key={place.id} place={place} />
                      ))
                    ) : (
                      <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                        <CardContent className="pt-6">
                          <p className="text-accent-700 dark:text-primary-200">
                            No place results found for "{queryParam}".
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="events" className="space-y-4">
                    {results.events && results.events.length > 0 ? (
                      results.events.map((event) => (
                        <SearchResultEvent key={event.id} event={event} />
                      ))
                    ) : (
                      <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                        <CardContent className="pt-6">
                          <p className="text-accent-700 dark:text-primary-200">
                            No event results found for "{queryParam}".
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
                <CardContent className="pt-6">
                  <p className="text-accent-700 dark:text-primary-200">
                    No results found.
                  </p>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-primary/60" />
                <h2 className="text-xl font-serif font-bold text-accent-900 dark:text-white mb-2">
                  Search the Archives
                </h2>
                <p className="text-accent-700 dark:text-primary-200 mb-4">
                  Enter a search term above to find documents, people, places, and events in our archives.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

interface SearchResultDocumentProps {
  document: Document;
}

const SearchResultDocument = ({ document }: SearchResultDocumentProps) => {
  return (
    <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <FileText className="h-3 w-3 mr-1" /> Document
              {document.date && (
                <>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-1" /> {document.date}
                </>
              )}
            </div>
            <CardTitle className="text-lg font-serif hover:text-primary transition-colors">
              <Link href={`/documents/${document.slug}`}>{document.title}</Link>
            </CardTitle>
          </div>
          <Link href={`/documents/${document.slug}`}>
            <a className="text-primary hover:text-primary/80">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-accent-700 dark:text-primary-300 line-clamp-2">
          {extractExcerpt(document.content)}
        </p>
      </CardContent>
    </Card>
  );
};

interface SearchResultPersonProps {
  person: Person;
}

const SearchResultPerson = ({ person }: SearchResultPersonProps) => {
  return (
    <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <User className="h-3 w-3 mr-1" /> Person
              {person.birthYear && person.deathYear && (
                <>
                  <span className="mx-2">•</span>
                  {person.birthYear}–{person.deathYear}
                </>
              )}
            </div>
            <CardTitle className="text-lg font-serif hover:text-primary transition-colors">
              <Link href={`/people/${person.slug}`}>{person.name}</Link>
            </CardTitle>
          </div>
          <Link href={`/people/${person.slug}`}>
            <a className="text-primary hover:text-primary/80">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {person.description && (
          <p className="text-sm text-accent-700 dark:text-primary-300 line-clamp-2">
            {person.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface SearchResultPlaceProps {
  place: Place;
}

const SearchResultPlace = ({ place }: SearchResultPlaceProps) => {
  return (
    <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <MapPin className="h-3 w-3 mr-1" /> Place
              {place.region && place.country && (
                <>
                  <span className="mx-2">•</span>
                  {place.region}, {place.country}
                </>
              )}
            </div>
            <CardTitle className="text-lg font-serif hover:text-primary transition-colors">
              <Link href={`/places/${place.slug}`}>{place.name}</Link>
            </CardTitle>
          </div>
          <Link href={`/places/${place.slug}`}>
            <a className="text-primary hover:text-primary/80">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {place.description && (
          <p className="text-sm text-accent-700 dark:text-primary-300 line-clamp-2">
            {place.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface SearchResultEventProps {
  event: Event;
}

const SearchResultEvent = ({ event }: SearchResultEventProps) => {
  return (
    <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <Calendar className="h-3 w-3 mr-1" /> Event
              {event.startYear && event.endYear && (
                <>
                  <span className="mx-2">•</span>
                  {event.startYear === event.endYear 
                    ? event.startYear 
                    : `${event.startYear}–${event.endYear}`}
                </>
              )}
            </div>
            <CardTitle className="text-lg font-serif hover:text-primary transition-colors">
              <Link href={`/events/${event.slug}`}>{event.name}</Link>
            </CardTitle>
          </div>
          <Link href={`/events/${event.slug}`}>
            <a className="text-primary hover:text-primary/80">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {event.description && (
          <p className="text-sm text-accent-700 dark:text-primary-300 line-clamp-2">
            {event.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchPage;
