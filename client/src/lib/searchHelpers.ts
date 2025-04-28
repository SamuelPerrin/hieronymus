import { Collection, Document, EntityType, Event, Person, Place } from "@/models/schema";
import { getAllDocuments, getAllEvents, getAllPeople, getAllPlaces } from "./contentLoader";
import { formatDate } from "./utils";

export const tokenize = (queryString: string): string[] => {
  // Split the query string into tokens based on spaces but respect quotes
  const regex = /"([^"]+)"|(\S+)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(queryString)) !== null) {
    matches.push(match[1] ?? match[2]);
  }

  return matches.map(token => token.trim().toLowerCase()).filter(token => token.length > 0);
}

interface DocumentSearchResult {
  document: Document;
  score: number; // A score indicating the relevance of the document to the query
}
interface PersonSearchResult {
  person: Person;
  score: number; // A score indicating the relevance of the person to the query
}
interface EventSearchResult {
  event: Event;
  score: number; // A score indicating the relevance of the event to the query
}
interface PlaceSearchResult {
  place: Place;
  score: number; // A score indicating the relevance of the place to the query
}
export interface SearchResults {
  documents: Document[]; // Array of documents that match the search query
  people: Person[]; // Array of people that match the search query
  events: Event[]; // Array of events that match the search query
  collections: Collection[]; // Array of collections that match the search query
  places: Place[]; // Array of places that match the search query
  totalResults: number; // Total number of results found
  order: EntityType[]; // Sorted order in which to display results
}

export const searchDocuments = (tokens: string[]): [Document[], number] => {
  const results: DocumentSearchResult[] = [];

  const documents: Document[] = getAllDocuments();

  for (const doc of documents) {
    let score = 0;

    const docTitle = doc.title.toLowerCase();
    const docAuthor = doc.authors?.join(", ").toLowerCase();
    const docDate = doc.date ? formatDate(doc.date).toLowerCase() : "";
    const docText = doc.content.toLowerCase();
    const docConcat = `${docTitle} ${docAuthor} ${docDate} ${docText}`;

    // Skip documents that don't match all tokens
    if (!tokens.every(token => docConcat.includes(token))) continue;

    for (const token of tokens) {
      if (docTitle === token) score += 1000; // Exact title match
      else if (docTitle.includes(token)) score += 10; // Title match
      if (docAuthor?.includes(token)) score += 10; // Author match
      if (docDate.includes(token)) score += 1; // Date match
      if (docText.includes(token)) {
        score += docText.match(new RegExp(token, "g"))?.length || 0; // +1 for each text match
      }
    }
    results.push({ document: doc, score });
    console.log(doc.title, score);
  }

  // Sort results by score in descending order and return the documents
  const sortedResults = results.sort((a,b) => b.score - a.score);
  return [sortedResults.map(result => result.document), sortedResults[0]?.score ?? 0];
}

export const searchPeople = (tokens: string[]): [Person[], number] => {
  const results: PersonSearchResult[] = [];

  const people: Person[] = getAllPeople();

  for (const person of people) {
    let score = 0;

    const personName = person.name.toLowerCase();
    const personAliases = person.alternateNames?.join(", ").toLowerCase() || "";
    const personText = person.description?.toLowerCase() || "";
    const personConcat = `${personName} ${personAliases} ${personText}`;

    // Skip people that don't match all tokens
    if (!tokens.every(token => personConcat.includes(token))) continue;

    for (const token of tokens) {
      if (personName === token) score += 1000; // Exact name match
      else if (personName.includes(token)) score += 10; // Name match
      if (personAliases.includes(token)) score += 10; // Alias match
      if (personText.includes(token)) {
        score += personText.match(new RegExp(token, "g"))?.length || 0; // +1 for each text match
      }
    }
    results.push({ person, score });
    console.log(person.name, score);
  }

  // Sort results by score in descending order and return the people
  const sortedResults = results.sort((a,b) => b.score - a.score);
  return [sortedResults.map(result => result.person), sortedResults[0]?.score ?? 0];
}

export const searchEvents = (tokens: string[]): [Event[], number] => {
  const results: EventSearchResult[] = [];

  const events: Event[] = getAllEvents();

  for (const event of events) {
    let score = 0;

    const eventName = event.name.toLowerCase();
    const eventStartDate = event.startDate ? formatDate(event.startDate!) : "";
    const eventEndDate = event.endDate ? formatDate(event.endDate!) : "";
    const eventText = event.description?.toLowerCase() || "";
    const eventConcat = `${eventName} ${eventStartDate} ${eventEndDate} ${eventText}`;

    // Skip events that don't match all tokens
    if (!tokens.every(token => eventConcat.includes(token))) continue;

    for (const token of tokens) {
      if (eventName === token) score += 1000; // Exact name match
      else if (eventName.includes(token)) score += 10; // Name match
      if (eventStartDate.includes(token) || eventEndDate.includes(token)) score += 5; // Year match
      if (eventText.includes(token)) {
        score += eventText.match(new RegExp(token, "g"))?.length || 0; // +1 for each text match
      }
    }
    results.push({ event, score });
    console.log(event.name, score);
  }

  // Sort results by score in descending order and return the events
  const sortedResults = results.sort((a,b) => b.score - a.score);
  return [sortedResults.map(result => result.event), sortedResults[0]?.score ?? 0];
}

export const searchPlaces = (tokens: string[]): [Place[], number] => {
  const results: PlaceSearchResult[] = [];

  const places: Place[] = getAllPlaces();

  for (const place of places) {
    let score = 0;

    const placeName = place.name.toLowerCase();
    const placeAliases = place.alternateNames?.join(", ") || "";
    const placeText = place.description?.toLowerCase() || "";
    const placeConcat = `${placeName} ${placeAliases} ${placeText}`;

    // Skip places that don't match all tokens
    if (!tokens.every(token => placeConcat.includes(token))) continue;

    for (const token of tokens) {
      if (placeName === token) score += 1000; // Exact name match
      else if (placeName.includes(token)) score += 10; // Name match
      if (placeAliases.includes(token)) score += 10; // Alias match
      if (placeText.includes(token)) {
        score += placeText.match(new RegExp(token, "g"))?.length || 0; // +1 for each text match
      }
    }
    results.push({ place, score });
    console.log(place.name, score);
  }

  // Sort results bys core in descending order and return the events
  const sortedResults = results.sort((a,b) => b.score - a.score);
  return [sortedResults.map(result => result.place), sortedResults[0]?.score ?? 0];
}

export const globalSearch = (query: string): SearchResults => {
  const tokens = tokenize(query);

  // Perform searches for each entity type
  const [documents, documentsTopScore] = searchDocuments(tokens);
  const [people, peopleTopScore] = searchPeople(tokens);
  const [events, eventsTopScore] = searchEvents(tokens);
  const [places, placesTopScore] = searchPlaces(tokens);

  // Create an array of entity types with their top scores
  const scores = [
    { type: EntityType.document, score: documentsTopScore },
    { type: EntityType.person, score: peopleTopScore },
    { type: EntityType.event, score: eventsTopScore },
    { type: EntityType.place, score: placesTopScore },
  ];

  // Sort the entity types by score in descending order
  const order = scores
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.type);

  return {
    documents,
    people,
    events,
    places,
    collections: [], // Placeholder for collections search results
    totalResults: documents.length + people.length + events.length + places.length,
    order, // Sorted order of entity types
  };
};