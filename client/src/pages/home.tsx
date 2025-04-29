import { useEffect } from "react";
import Link from "@/components/ui/link";
import { Ghost, Search, User, MapPin, Calendar, ArrowRight, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from "@/components/search/SearchBar";
import { extractExcerpt } from "@/lib/markdownUtils";
import { motion } from "framer-motion";
import { getAllDocuments, getCollectionsLength, getEventsLength, getPeopleLength, getPlacesLength } from "@/lib/contentLoader";

const Home = () => {
  // Fetch recent documents
  const documents = getAllDocuments();

  // Fetch collections
  const collectionsLength = getCollectionsLength();

  // Fetch people
  const peopleLength = getPeopleLength();

  // Fetch places
  const placesLength = getPlacesLength();

  // Fetch events
  const eventsLength = getEventsLength();

  // Prefetch for better UX
  useEffect(() => {
    document.title = "Ghost in the Archive";
  }, []);

  const recentDocuments = documents?.slice(0, 3) || [];
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Ghost className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-accent-900 dark:text-white mb-6">
              Ghost in the Archive
            </h1>
            <p className="text-xl text-accent-700 dark:text-primary-200 mb-8">
              A scholarly repository of transcribed historical documents, providing researchers and history enthusiasts with accessible primary sources
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <SearchBar className="max-w-xl mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Recent Transcriptions */}
      <section className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl font-bold text-accent-900 dark:text-white">
            Recent Transcriptions
          </h2>
          <Link href="/collections">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View all <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentDocuments.map((doc) => (
            <Card key={doc.id} className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-serif hover:text-primary transition-colors">
                  <Link href={`/documents/${doc.slug}`} className="text-black dark:text-white">
                    {doc.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" /> {doc.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-accent-700 dark:text-accent-200 line-clamp-3">
                  {extractExcerpt(doc.content)}
                </p>
                <Link href={`/documents/${doc.slug}`}>
                  <Button variant="link" className="mt-2 h-auto p-0 text-primary hover:text-primary/80">
                    Read more
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Browse Categories */}
      <section className="py-8">
        <h2 className="font-serif text-2xl font-bold text-accent-900 dark:text-white mb-6">
          Explore the Archives
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/collections">
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Archive className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-accent-900 dark:text-white">Collections</h3>
                    <p className="text-sm text-muted-foreground">
                      {collectionsLength === 1 ? `${collectionsLength} archival collection` : `${collectionsLength} archival collections`}
                    </p>
                  </div>
                </div>
                <p className="text-accent-700 dark:text-accent-200 text-sm">
                  Browse organized collections of related documents and materials.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/people">
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-accent-900 dark:text-white">People</h3>
                    <p className="text-sm text-muted-foreground">
                      {peopleLength === 1 ? `${peopleLength} biography` : `${peopleLength} biographies`}
                    </p>
                  </div>
                </div>
                <p className="text-accent-700 dark:text-accent-200 text-sm">
                  Discover historical figures mentioned in our transcriptions.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/places">
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-accent-900 dark:text-white">Places</h3>
                    <p className="text-sm text-muted-foreground">
                      {placesLength === 1 ? `${placesLength} location` : `${placesLength} locations`}
                    </p>
                  </div>
                </div>
                <p className="text-accent-700 dark:text-accent-200 text-sm">
                  Explore locations referenced in historical documents.
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/events">
            <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-accent-900 dark:text-white">Events</h3>
                    <p className="text-sm text-muted-foreground">
                      {eventsLength === 1 ? `${eventsLength} historical event` : `${eventsLength} historiacal events`}
                    </p>
                  </div>
                </div>
                <p className="text-accent-700 dark:text-accent-200 text-sm">
                  Learn about significant historical events mentioned in our archives.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 my-8 bg-accent dark:bg-accent-800 rounded-lg text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Discover Our Historical Archives
          </h2>
          <p className="text-primary-100 mb-8">
            Explore transcriptions of archival sources including letters, diaries, and official documents. 
            Each document is interconnected with related people, places, and events to provide rich historical context.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search">
              <Button className="bg-white text-accent-900 hover:bg-primary-100">
                <Search className="h-4 w-4 mr-2" />
                Search Archives
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="text-accent-900 border-white hover:bg-accent-700 dark:bg-white">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
