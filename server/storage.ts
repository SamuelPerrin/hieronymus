import {
  users, 
  collections, 
  documents, 
  people, 
  places, 
  events, 
  relationships,
  type User, 
  type InsertUser,
  type Collection,
  type InsertCollection,
  type Document,
  type InsertDocument,
  type Person,
  type InsertPerson,
  type Place,
  type InsertPlace,
  type Event,
  type InsertEvent,
  type Relationship,
  type InsertRelationship,
  type EntityType,
  type RelatedItem
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Collections
  getCollections(): Promise<Collection[]>;
  getCollection(id: number): Promise<Collection | undefined>;
  getCollectionBySlug(slug: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: number, collection: Partial<InsertCollection>): Promise<Collection | undefined>;
  deleteCollection(id: number): Promise<boolean>;
  
  // Documents
  getDocuments(): Promise<Document[]>;
  getDocumentsByCollection(collectionId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentBySlug(slug: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // People
  getPeople(): Promise<Person[]>;
  getPerson(id: number): Promise<Person | undefined>;
  getPersonBySlug(slug: string): Promise<Person | undefined>;
  createPerson(person: InsertPerson): Promise<Person>;
  updatePerson(id: number, person: Partial<InsertPerson>): Promise<Person | undefined>;
  deletePerson(id: number): Promise<boolean>;
  
  // Places
  getPlaces(): Promise<Place[]>;
  getPlace(id: number): Promise<Place | undefined>;
  getPlaceBySlug(slug: string): Promise<Place | undefined>;
  createPlace(place: InsertPlace): Promise<Place>;
  updatePlace(id: number, place: Partial<InsertPlace>): Promise<Place | undefined>;
  deletePlace(id: number): Promise<boolean>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getEventBySlug(slug: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Relationships
  getRelationships(fromType: EntityType, fromId: number): Promise<Relationship[]>;
  createRelationship(relationship: InsertRelationship): Promise<Relationship>;
  deleteRelationship(id: number): Promise<boolean>;
  getRelatedItems(entityType: EntityType, entityId: number): Promise<RelatedItem[]>;
  getRelatedItemsBySlug(entityType: EntityType, slug: string): Promise<RelatedItem[]>;
  
  // Search
  search(query: string): Promise<{
    documents: Document[],
    people: Person[],
    places: Place[],
    events: Event[]
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private collections: Map<number, Collection>;
  private documents: Map<number, Document>;
  private people: Map<number, Person>;
  private places: Map<number, Place>;
  private events: Map<number, Event>;
  private relationships: Map<number, Relationship>;
  
  private userIdCounter: number;
  private collectionIdCounter: number;
  private documentIdCounter: number;
  private personIdCounter: number;
  private placeIdCounter: number;
  private eventIdCounter: number;
  private relationshipIdCounter: number;

  constructor() {
    this.users = new Map();
    this.collections = new Map();
    this.documents = new Map();
    this.people = new Map();
    this.places = new Map();
    this.events = new Map();
    this.relationships = new Map();
    
    this.userIdCounter = 1;
    this.collectionIdCounter = 1;
    this.documentIdCounter = 1;
    this.personIdCounter = 1;
    this.placeIdCounter = 1;
    this.eventIdCounter = 1;
    this.relationshipIdCounter = 1;
    
    // Initialize with sample data for development
    this.initSampleData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Collections
  async getCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async getCollectionBySlug(slug: string): Promise<Collection | undefined> {
    return Array.from(this.collections.values()).find(
      (collection) => collection.slug === slug
    );
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.collectionIdCounter++;
    const now = new Date();
    const collection: Collection = { 
      ...insertCollection, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.collections.set(id, collection);
    return collection;
  }

  async updateCollection(id: number, updateData: Partial<InsertCollection>): Promise<Collection | undefined> {
    const collection = this.collections.get(id);
    if (!collection) return undefined;
    
    const updatedCollection: Collection = { 
      ...collection, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.collections.set(id, updatedCollection);
    return updatedCollection;
  }

  async deleteCollection(id: number): Promise<boolean> {
    return this.collections.delete(id);
  }

  // Documents
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentsByCollection(collectionId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.collectionId === collectionId
    );
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentBySlug(slug: string): Promise<Document | undefined> {
    return Array.from(this.documents.values()).find(
      (document) => document.slug === slug
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentIdCounter++;
    const now = new Date();
    const document: Document = { 
      ...insertDocument, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument: Document = { 
      ...document, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // People
  async getPeople(): Promise<Person[]> {
    return Array.from(this.people.values());
  }

  async getPerson(id: number): Promise<Person | undefined> {
    return this.people.get(id);
  }

  async getPersonBySlug(slug: string): Promise<Person | undefined> {
    return Array.from(this.people.values()).find(
      (person) => person.slug === slug
    );
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const id = this.personIdCounter++;
    const now = new Date();
    const person: Person = { 
      ...insertPerson, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.people.set(id, person);
    return person;
  }

  async updatePerson(id: number, updateData: Partial<InsertPerson>): Promise<Person | undefined> {
    const person = this.people.get(id);
    if (!person) return undefined;
    
    const updatedPerson: Person = { 
      ...person, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.people.set(id, updatedPerson);
    return updatedPerson;
  }

  async deletePerson(id: number): Promise<boolean> {
    return this.people.delete(id);
  }

  // Places
  async getPlaces(): Promise<Place[]> {
    return Array.from(this.places.values());
  }

  async getPlace(id: number): Promise<Place | undefined> {
    return this.places.get(id);
  }

  async getPlaceBySlug(slug: string): Promise<Place | undefined> {
    return Array.from(this.places.values()).find(
      (place) => place.slug === slug
    );
  }

  async createPlace(insertPlace: InsertPlace): Promise<Place> {
    const id = this.placeIdCounter++;
    const now = new Date();
    const place: Place = { 
      ...insertPlace, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.places.set(id, place);
    return place;
  }

  async updatePlace(id: number, updateData: Partial<InsertPlace>): Promise<Place | undefined> {
    const place = this.places.get(id);
    if (!place) return undefined;
    
    const updatedPlace: Place = { 
      ...place, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.places.set(id, updatedPlace);
    return updatedPlace;
  }

  async deletePlace(id: number): Promise<boolean> {
    return this.places.delete(id);
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    return Array.from(this.events.values()).find(
      (event) => event.slug === slug
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const now = new Date();
    const event: Event = { 
      ...insertEvent, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, updateData: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent: Event = { 
      ...event, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Relationships
  async getRelationships(fromType: EntityType, fromId: number): Promise<Relationship[]> {
    return Array.from(this.relationships.values()).filter(
      (rel) => rel.fromType === fromType && rel.fromId === fromId
    );
  }

  async createRelationship(insertRelationship: InsertRelationship): Promise<Relationship> {
    const id = this.relationshipIdCounter++;
    const now = new Date();
    const relationship: Relationship = { 
      ...insertRelationship, 
      id, 
      createdAt: now
    };
    this.relationships.set(id, relationship);
    return relationship;
  }

  async deleteRelationship(id: number): Promise<boolean> {
    return this.relationships.delete(id);
  }

  async getRelatedItems(entityType: EntityType, entityId: number): Promise<RelatedItem[]> {
    // Get relationships where this entity is the source
    const outgoingRelationships = Array.from(this.relationships.values()).filter(
      (rel) => rel.fromType === entityType && rel.fromId === entityId
    );
    
    // Map to related items
    const relatedItems: RelatedItem[] = [];
    
    for (const rel of outgoingRelationships) {
      let item: RelatedItem | undefined;
      
      switch (rel.toType) {
        case 'document':
          const doc = this.documents.get(rel.toId);
          if (doc) {
            item = {
              id: doc.id,
              type: 'document',
              name: doc.title,
              slug: doc.slug,
              relationshipType: rel.relationshipType,
              description: doc.content?.substring(0, 100),
              date: doc.date
            };
          }
          break;
        case 'person':
          const person = this.people.get(rel.toId);
          if (person) {
            item = {
              id: person.id,
              type: 'person',
              name: person.name,
              slug: person.slug,
              relationshipType: rel.relationshipType,
              description: person.description
            };
          }
          break;
        case 'place':
          const place = this.places.get(rel.toId);
          if (place) {
            item = {
              id: place.id,
              type: 'place',
              name: place.name,
              slug: place.slug,
              relationshipType: rel.relationshipType,
              description: place.description
            };
          }
          break;
        case 'event':
          const event = this.events.get(rel.toId);
          if (event) {
            item = {
              id: event.id,
              type: 'event',
              name: event.name,
              slug: event.slug,
              relationshipType: rel.relationshipType,
              description: event.description,
              date: event.startDate
            };
          }
          break;
        case 'collection':
          const collection = this.collections.get(rel.toId);
          if (collection) {
            item = {
              id: collection.id,
              type: 'collection',
              name: collection.title,
              slug: collection.slug,
              relationshipType: rel.relationshipType,
              description: collection.description
            };
          }
          break;
      }
      
      if (item) {
        relatedItems.push(item);
      }
    }
    
    // Get relationships where this entity is the target
    const incomingRelationships = Array.from(this.relationships.values()).filter(
      (rel) => rel.toType === entityType && rel.toId === entityId
    );
    
    for (const rel of incomingRelationships) {
      let item: RelatedItem | undefined;
      
      switch (rel.fromType) {
        case 'document':
          const doc = this.documents.get(rel.fromId);
          if (doc) {
            item = {
              id: doc.id,
              type: 'document',
              name: doc.title,
              slug: doc.slug,
              relationshipType: rel.relationshipType,
              description: doc.content?.substring(0, 100),
              date: doc.date
            };
          }
          break;
        case 'person':
          const person = this.people.get(rel.fromId);
          if (person) {
            item = {
              id: person.id,
              type: 'person',
              name: person.name,
              slug: person.slug,
              relationshipType: rel.relationshipType,
              description: person.description
            };
          }
          break;
        case 'place':
          const place = this.places.get(rel.fromId);
          if (place) {
            item = {
              id: place.id,
              type: 'place',
              name: place.name,
              slug: place.slug,
              relationshipType: rel.relationshipType,
              description: place.description
            };
          }
          break;
        case 'event':
          const event = this.events.get(rel.fromId);
          if (event) {
            item = {
              id: event.id,
              type: 'event',
              name: event.name,
              slug: event.slug,
              relationshipType: rel.relationshipType,
              description: event.description,
              date: event.startDate
            };
          }
          break;
        case 'collection':
          const collection = this.collections.get(rel.fromId);
          if (collection) {
            item = {
              id: collection.id,
              type: 'collection',
              name: collection.title,
              slug: collection.slug,
              relationshipType: rel.relationshipType,
              description: collection.description
            };
          }
          break;
      }
      
      if (item) {
        relatedItems.push(item);
      }
    }
    
    return relatedItems;
  }

  async getRelatedItemsBySlug(entityType: EntityType, slug: string): Promise<RelatedItem[]> {
    let entityId: number | undefined;
    
    // Find the entity ID from the slug
    switch (entityType) {
      case 'document':
        const doc = Array.from(this.documents.values()).find(d => d.slug === slug);
        entityId = doc?.id;
        break;
      case 'person':
        const person = Array.from(this.people.values()).find(p => p.slug === slug);
        entityId = person?.id;
        break;
      case 'place':
        const place = Array.from(this.places.values()).find(p => p.slug === slug);
        entityId = place?.id;
        break;
      case 'event':
        const event = Array.from(this.events.values()).find(e => e.slug === slug);
        entityId = event?.id;
        break;
      case 'collection':
        const collection = Array.from(this.collections.values()).find(c => c.slug === slug);
        entityId = collection?.id;
        break;
    }
    
    if (entityId === undefined) {
      return [];
    }
    
    return this.getRelatedItems(entityType, entityId);
  }

  // Search
  async search(query: string): Promise<{
    documents: Document[],
    people: Person[],
    places: Place[],
    events: Event[]
  }> {
    const lowerQuery = query.toLowerCase();
    
    const documents = Array.from(this.documents.values()).filter(
      doc => 
        doc.title.toLowerCase().includes(lowerQuery) || 
        (doc.content && doc.content.toLowerCase().includes(lowerQuery))
    );
    
    const people = Array.from(this.people.values()).filter(
      person => 
        person.name.toLowerCase().includes(lowerQuery) || 
        (person.description && person.description.toLowerCase().includes(lowerQuery))
    );
    
    const places = Array.from(this.places.values()).filter(
      place => 
        place.name.toLowerCase().includes(lowerQuery) || 
        (place.description && place.description.toLowerCase().includes(lowerQuery))
    );
    
    const events = Array.from(this.events.values()).filter(
      event => 
        event.name.toLowerCase().includes(lowerQuery) || 
        (event.description && event.description.toLowerCase().includes(lowerQuery))
    );
    
    return { documents, people, places, events };
  }

  // Sample data for development
  private initSampleData() {
    // Sample collections
    const letters = {
      id: this.collectionIdCounter++,
      slug: 'letters',
      title: 'Historical Letters',
      description: 'A collection of important historical correspondence',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.collections.set(letters.id, letters);
    
    const journals = {
      id: this.collectionIdCounter++,
      slug: 'journals',
      title: 'Personal Journals',
      description: 'First-hand accounts from diaries and journals',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.collections.set(journals.id, journals);

    // Sample people
    const hamilton = {
      id: this.personIdCounter++,
      slug: 'alexander-hamilton',
      name: 'Alexander Hamilton',
      alternateNames: ['A. Hamilton'],
      birthDate: 'January 11, 1755/1757',
      deathDate: 'July 12, 1804',
      birthYear: 1755,
      deathYear: 1804,
      description: 'Founding Father, first Secretary of Treasury, and aide to George Washington during the Revolutionary War.',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.people.set(hamilton.id, hamilton);
    
    const washington = {
      id: this.personIdCounter++,
      slug: 'george-washington',
      name: 'George Washington',
      alternateNames: ['G. Washington'],
      birthDate: 'February 22, 1732',
      deathDate: 'December 14, 1799',
      birthYear: 1732,
      deathYear: 1799,
      description: 'First President of the United States and commander of the Continental Army during the American Revolutionary War.',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.people.set(washington.id, washington);

    // Sample places
    const newWindsor = {
      id: this.placeIdCounter++,
      slug: 'new-windsor',
      name: 'New Windsor',
      alternateNames: [],
      region: 'New York',
      country: 'United States',
      description: `Location of Washington's headquarters and Continental Army winter encampment during 1780-1781.`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.places.set(newWindsor.id, newWindsor);
    
    const philadelphia = {
      id: this.placeIdCounter++,
      slug: 'philadelphia',
      name: 'Philadelphia',
      alternateNames: [],
      region: 'Pennsylvania',
      country: 'United States',
      description: 'A major city in Pennsylvania, which served as the nation\'s capital during the Revolutionary War.',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.places.set(philadelphia.id, philadelphia);

    // Sample events
    const americanRevolution = {
      id: this.eventIdCounter++,
      slug: 'american-revolution',
      name: 'American Revolution',
      startDate: 'April 19, 1775',
      endDate: 'September 3, 1783',
      startYear: 1775,
      endYear: 1783,
      description: 'The American Revolution was a colonial revolt and political upheaval that took place between 1765 and 1783.',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.events.set(americanRevolution.id, americanRevolution);
    
    const yorktown = {
      id: this.eventIdCounter++,
      slug: 'battle-of-yorktown',
      name: 'Battle of Yorktown',
      startDate: 'September 28, 1781',
      endDate: 'October 19, 1781',
      startYear: 1781,
      endYear: 1781,
      description: 'The decisive victory by combined American and French forces that effectively ended the American Revolutionary War.',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.events.set(yorktown.id, yorktown);

    // Sample documents
    const hamiltonLetter = {
      id: this.documentIdCounter++,
      slug: 'hamilton-to-washington-1781',
      title: 'Letter from Alexander Hamilton to George Washington',
      content: `Sir,

I had the honor of receiving your letter of the 2d instant, and duly observed its contents. I am persuaded your Excellency is aware of the extent of our current predicament concerning supplies, and I have taken the liberty to detail my observations on this matter for your consideration.

The situation at New Windsor has been precarious since the late frost, and reports from General Greene confirm similar conditions to the south. Were the Continental Congress to address these concerns with greater haste, we might avoid the diminishing morale among the ranks.

Recent communications from Philadelphia suggest that supplementary provisions may be forthcoming, but I remain doubtful of their adequacy or timely arrival. The commissary's accounts show dwindling stores that cannot sustain the men through the coming month if circumstances remain unchanged.

I have dispatched riders to the neighboring counties with appeals for aid, though with winter's damage to local farms, their capacity to assist is limited. Several merchants have promised shipments at reduced rates, recognizing our cause, but transport remains a challenge with the condition of the roads.

Regarding your inquiry about preparations for the summer campaign, I have prepared detailed plans but hesitate to commit them fully until the supply situation clarifies. The proposed operation toward Yorktown requires provisions we cannot currently guarantee.

> I submit that we may need to reconsider our strategy should these conditions persist, though I remain hopeful that your influence with Congress might yield more favorable arrangements.

The officers under my command continue to demonstrate remarkable patience and ingenuity in managing these shortages, a testament to their character and dedication to our cause. Nevertheless, I fear testing their endurance much further.

Should you require more specific accounts of our situation, I would be pleased to provide them at your convenience.

I remain, with the greatest respect and attachment,

Your Excellency's most obedient servant,

A. Hamilton`,
      date: 'April 22, 1781',
      year: 1781,
      type: 'letter',
      source: 'Library of Congress, Washington Papers, vol. 276',
      location: 'New Windsor, New York',
      archiveReference: 'MSS-1234-AB-5678',
      collectionId: letters.id,
      transcribedBy: 'J. Smith, PhD.',
      transcriptionDate: new Date('2022-05-15'),
      lastUpdated: new Date('2023-03-15'),
      tags: ['Revolutionary War', 'Military', 'Letter'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.set(hamiltonLetter.id, hamiltonLetter);
    
    const washingtonResponse = {
      id: this.documentIdCounter++,
      slug: 'washington-to-hamilton-1781',
      title: 'Response from George Washington to Alexander Hamilton',
      content: `Dear Colonel Hamilton,

I acknowledge receipt of your detailed letter of April 22nd and appreciate your thorough assessment of our supply predicament. Your observations mirror my own concerns, which I have repeatedly communicated to Congress with increasing urgency.

You may take some comfort in knowing that I dispatched a special envoy to Philadelphia three days past with explicit instructions to convey the dire nature of our circumstances. I have impressed upon Congress that without immediate remedy, our position will become untenable regardless of the men's loyalty and forbearance.

Mr. Morris has assured me that a significant shipment of provisions is being assembled and should reach New Windsor within a fortnight, weather and roads permitting. While this will provide temporary relief, I concur that a more permanent solution must be established if we are to maintain our strategic advantage.

Regarding the Yorktown operation, I share your hesitation. The intelligence from our French allies suggests favorable naval circumstances may arise later this summer, but we must balance opportunity against capability. I would ask that you continue refinement of your plans while I pursue all avenues to secure the necessary supplies.

The ingenuity of your officers that you mention is indeed commendable, though as you rightly note, such resourcefulness has its limits. Please convey my personal appreciation for their fortitude.

On a separate matter, I am considering a brief visitation to inspect the situation firsthand. Please make appropriate arrangements for my arrival on or about the 5th of May, though I shall send confirmation ahead.

I remain, sir, your obedient servant,

G. Washington`,
      date: 'April 28, 1781',
      year: 1781,
      type: 'letter',
      source: 'Hamilton Papers, Library of Congress',
      location: 'Philadelphia, Pennsylvania',
      archiveReference: 'MSS-1234-AB-5679',
      collectionId: letters.id,
      transcribedBy: 'J. Smith, PhD.',
      transcriptionDate: new Date('2022-05-20'),
      lastUpdated: new Date('2023-03-15'),
      tags: ['Revolutionary War', 'Military', 'Letter'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.set(washingtonResponse.id, washingtonResponse);

    // Create relationships
    const rel1 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: hamiltonLetter.id,
      toType: 'person' as EntityType,
      toId: hamilton.id,
      relationshipType: 'author',
      createdAt: new Date()
    };
    this.relationships.set(rel1.id, rel1);
    
    const rel2 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: hamiltonLetter.id,
      toType: 'person' as EntityType,
      toId: washington.id,
      relationshipType: 'recipient',
      createdAt: new Date()
    };
    this.relationships.set(rel2.id, rel2);
    
    const rel3 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: hamiltonLetter.id,
      toType: 'place' as EntityType,
      toId: newWindsor.id,
      relationshipType: 'location',
      createdAt: new Date()
    };
    this.relationships.set(rel3.id, rel3);
    
    const rel4 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: hamiltonLetter.id,
      toType: 'place' as EntityType,
      toId: philadelphia.id,
      relationshipType: 'mentions',
      createdAt: new Date()
    };
    this.relationships.set(rel4.id, rel4);
    
    const rel5 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: hamiltonLetter.id,
      toType: 'event' as EntityType,
      toId: americanRevolution.id,
      relationshipType: 'context',
      createdAt: new Date()
    };
    this.relationships.set(rel5.id, rel5);
    
    const rel6 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: hamiltonLetter.id,
      toType: 'event' as EntityType,
      toId: yorktown.id,
      relationshipType: 'mentions',
      createdAt: new Date()
    };
    this.relationships.set(rel6.id, rel6);
    
    const rel7 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: hamiltonLetter.id,
      toType: 'document' as EntityType,
      toId: washingtonResponse.id,
      relationshipType: 'related',
      createdAt: new Date()
    };
    this.relationships.set(rel7.id, rel7);
    
    const rel8 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: washingtonResponse.id,
      toType: 'person' as EntityType,
      toId: washington.id,
      relationshipType: 'author',
      createdAt: new Date()
    };
    this.relationships.set(rel8.id, rel8);
    
    const rel9 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: washingtonResponse.id,
      toType: 'person' as EntityType,
      toId: hamilton.id,
      relationshipType: 'recipient',
      createdAt: new Date()
    };
    this.relationships.set(rel9.id, rel9);
    
    const rel10 = {
      id: this.relationshipIdCounter++,
      fromType: 'document' as EntityType,
      fromId: washingtonResponse.id,
      toType: 'place' as EntityType,
      toId: philadelphia.id,
      relationshipType: 'location',
      createdAt: new Date()
    };
    this.relationships.set(rel10.id, rel10);
  }
}

export const storage = new MemStorage();
