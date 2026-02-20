
import { ServiceCategory, FeedbackRecord, FeedbackStatus, GestureType, GuestQuery, QueryStatus, TimelineStage, Prize, MaintenanceTicket, TicketPriority, TicketStatus, StaffStat, RequestCategory, RoomStatus, RoomState, ServiceRequest, StaffStatus, InventoryItem, ResortEvent, DiningVenue } from './types';
import { Key, Bed, Utensils, Waves, UserCircle, LogOut, Sparkles, Umbrella } from 'lucide-react';

export const APP_NAME = "Blue Beach Resort";
export const BRAND_COLOR = "#0B78D1";

// Updated Timeline Categories (8 Stages now)
export const TIMELINE_STAGES: TimelineStage[] = [
  { id: ServiceCategory.CHECK_IN, label: "Arrival", icon: Key },
  { id: ServiceCategory.ROOM, label: "Room", icon: Bed },
  { id: ServiceCategory.DINING, label: "Dining", icon: Utensils },
  { id: ServiceCategory.SPA, label: "Spa", icon: Sparkles }, 
  { id: ServiceCategory.AMENITIES, label: "Pool", icon: Waves },
  { id: ServiceCategory.BEACH, label: "Beach", icon: Umbrella }, 
  { id: ServiceCategory.STAFF, label: "Staff", icon: UserCircle },
  { id: ServiceCategory.CHECK_OUT, label: "Departure", icon: LogOut },
];

export const EMOJI_RATINGS = [
  { emoji: "😤", score: 1, label: "Angry" },
  { emoji: "😕", score: 2, label: "Disappointed" },
  { emoji: "😐", score: 3, label: "Okay" },
  { emoji: "🙂", score: 4, label: "Good" },
  { emoji: "😍", score: 5, label: "Loved it!" },
];

export const WHEEL_PRIZES: Prize[] = [
  { id: 'drink', label: "Free Cocktail 🍹", color: "#f87171", probability: 0.3 },
  { id: 'spa', label: "20% Off Spa 💆‍♀️", color: "#60a5fa", probability: 0.1 },
  { id: 'snack', label: "Poolside Snack 🥨", color: "#fbbf24", probability: 0.3 },
  { id: 'checkout', label: "Late Checkout 🕒", color: "#34d399", probability: 0.2 },
  { id: 'discount', label: "10% Next Stay 🏷️", color: "#a78bfa", probability: 0.1 },
];

const randomDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date.toISOString();
};

const generateMockData = (count: number): FeedbackRecord[] => {
  const sentiments = [
    { score: 0.9, text: "Absolutely loved it!", gesture: GestureType.THUMBS_UP, keywords: ['amazing', 'love'] },
    { score: 0.7, text: "Great experience overall.", gesture: GestureType.THUMBS_UP, keywords: ['good', 'nice'] },
    { score: 0.2, text: "It was okay, nothing special.", gesture: GestureType.WAVE, keywords: ['okay', 'average'] },
    { score: -0.3, text: "Wait times were too long.", gesture: GestureType.THUMBS_DOWN, keywords: ['slow', 'waiting'] },
    { score: -0.8, text: "Terrible service, very rude.", gesture: GestureType.THUMBS_DOWN, keywords: ['rude', 'dirty', 'bad'] },
  ];

  const records: FeedbackRecord[] = [];

  for (let i = 0; i < count; i++) {
    const stage = TIMELINE_STAGES[Math.floor(Math.random() * TIMELINE_STAGES.length)];
    const category = stage.id;
    const sentimentProfile = sentiments[Math.floor(Math.random() * sentiments.length)];
    const daysBack = Math.random() > 0.8 ? 365 : (Math.random() > 0.5 ? 30 : 7); 
    
    records.push({
      id: `mock-${i}`,
      guestName: `Guest ${Math.floor(Math.random() * 1000)}`,
      roomNumber: `${Math.floor(100 + Math.random() * 400)}`,
      createdAt: randomDate(daysBack),
      items: [{ 
          category: category, 
          rating: Math.max(1, Math.min(5, Math.floor((sentimentProfile.score + 1) * 2.5))), 
          comment: sentimentProfile.text,
          emoji: sentimentProfile.score > 0.5 ? "😍" : (sentimentProfile.score < -0.5 ? "😤" : "😐")
        }],
      gesture: sentimentProfile.gesture,
      overallSentiment: sentimentProfile.score + (Math.random() * 0.2 - 0.1), 
      status: sentimentProfile.score < 0 ? FeedbackStatus.NEW : FeedbackStatus.RESOLVED,
      keywords: sentimentProfile.keywords,
      isFlagged: sentimentProfile.score < -0.5
    });
  }
  
  return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const MOCK_FEEDBACK_DATA: FeedbackRecord[] = generateMockData(300);

const generateMockTickets = (feedback: FeedbackRecord[]): MaintenanceTicket[] => {
  const negativeFeedback = feedback.filter(f => 
    f.overallSentiment < -0.2 && 
    (f.items[0].category === ServiceCategory.ROOM || f.items[0].category === ServiceCategory.AMENITIES)
  );

  // Add some standalone maintenance tasks
  const manualTickets: MaintenanceTicket[] = [
    { id: 'mt-1', roomNumber: '105', issueDescription: 'Light bulb flickering in bathroom', category: 'Electrical', priority: TicketPriority.LOW, status: TicketStatus.OPEN, createdAt: new Date().toISOString() },
    { id: 'mt-2', roomNumber: 'Pool', issueDescription: 'Filter pump making noise', category: 'Amenities', priority: TicketPriority.HIGH, status: TicketStatus.IN_PROGRESS, createdAt: new Date().toISOString(), assignedTo: 'Mike Jones' },
  ];

  const feedbackTickets = negativeFeedback.slice(0, 15).map((f, i) => ({
    id: `ticket-${i}`,
    sourceFeedbackId: f.id,
    roomNumber: f.roomNumber || 'Unknown',
    issueDescription: f.items[0].comment,
    category: f.items[0].category,
    priority: f.overallSentiment < -0.6 ? TicketPriority.URGENT : TicketPriority.MEDIUM,
    status: i < 5 ? TicketStatus.DONE : (i < 10 ? TicketStatus.IN_PROGRESS : TicketStatus.OPEN),
    createdAt: f.createdAt,
    assignedTo: i < 10 ? ['Mike', 'Sarah', 'John'][Math.floor(Math.random() * 3)] : undefined
  }));

  return [...manualTickets, ...feedbackTickets];
};

export const MOCK_MAINTENANCE_TICKETS: MaintenanceTicket[] = generateMockTickets(MOCK_FEEDBACK_DATA);

export const MOCK_QUERIES: GuestQuery[] = [
  { id: 'q1', guestName: 'Smith', roomNumber: '202', queryText: 'Late checkout?', status: QueryStatus.REPLIED, replyText: 'Yes, 1pm is fine.', createdAt: new Date().toISOString(), isAiGenerated: false },
  { id: 'q2', guestName: 'Doe', roomNumber: '305', queryText: 'Wifi pass?', status: QueryStatus.AUTO_REPLIED, replyText: 'BlueGuest / sandytoes2025', createdAt: new Date().toISOString(), isAiGenerated: true },
];

export const MOCK_STAFF_STATS: StaffStat[] = [
  { id: 's1', name: 'Alice Chen', role: 'Front Desk Agent', department: 'Front Office', avatar: 'https://i.pravatar.cc/150?u=a', status: StaffStatus.ON_SHIFT, positiveMentions: 42, avgRating: 4.8, shiftStart: '08:00 AM' },
  { id: 's2', name: 'Roberto G.', role: 'Executive Chef', department: 'Kitchen', avatar: 'https://i.pravatar.cc/150?u=b', status: StaffStatus.ON_SHIFT, positiveMentions: 38, avgRating: 4.9, shiftStart: '10:00 AM' },
  { id: 's3', name: 'Sarah Smith', role: 'Housekeeping Mgr', department: 'Housekeeping', avatar: 'https://i.pravatar.cc/150?u=c', status: StaffStatus.OFF_SHIFT, positiveMentions: 25, avgRating: 4.6 },
  { id: 's4', name: 'Mike Jones', role: 'Technician', department: 'Maintenance', avatar: 'https://i.pravatar.cc/150?u=d', status: StaffStatus.ON_LEAVE, positiveMentions: 15, avgRating: 4.7 },
  { id: 's5', name: 'Jessica Wu', role: 'Spa Therapist', department: 'Spa', avatar: 'https://i.pravatar.cc/150?u=e', status: StaffStatus.ON_SHIFT, positiveMentions: 30, avgRating: 4.9, shiftStart: '09:00 AM' },
  { id: 's6', name: 'Tom Wilson', role: 'Bell Hop', department: 'Front Office', avatar: 'https://i.pravatar.cc/150?u=f', status: StaffStatus.BREAK, positiveMentions: 12, avgRating: 4.8, shiftStart: '07:00 AM' },
];

export const SERVICE_REQUEST_OPTIONS = [
  { category: RequestCategory.HOUSEKEEPING, items: ['Extra Towels', 'Pillows', 'Toiletries', 'Cleaning Service', 'Turn Down Service'] },
  { category: RequestCategory.ROOM_SERVICE, items: ['Club Sandwich', 'Fruit Platter', 'Champagne', 'Breakfast Menu', 'Water Bottles'] },
  { category: RequestCategory.MAINTENANCE, items: ['AC Issue', 'TV Remote', 'Plumbing', 'Light Bulb', 'Safe Unlock'] },
  { category: RequestCategory.TRANSPORT, items: ['Taxi Booking', 'Airport Shuttle', 'Valet Car Retrieval', 'Rent a Bike'] },
];

const generateRoomGrid = (): RoomStatus[] => {
  const rooms: RoomStatus[] = [];
  const floors = [1, 2, 3, 4];
  floors.forEach(floor => {
    for(let i=1; i<=8; i++) {
      const roomNum = `${floor}0${i}`;
      const rand = Math.random();
      let state = RoomState.CLEAN;
      if(rand > 0.7) state = RoomState.OCCUPIED;
      else if(rand > 0.5) state = RoomState.DIRTY;
      else if(rand > 0.4) state = RoomState.DND;
      else if(rand > 0.95) state = RoomState.MAINTENANCE;

      rooms.push({
        roomNumber: roomNum,
        floor: floor,
        state: state,
        guestName: state === RoomState.OCCUPIED || state === RoomState.DND ? `Guest ${Math.floor(Math.random()*500)}` : undefined,
        nextTask: state === RoomState.DIRTY ? 'Needs Cleaning' : undefined
      });
    }
  });
  return rooms;
};

export const MOCK_ROOM_GRID: RoomStatus[] = generateRoomGrid();

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Bath Towels (White)', category: 'Linens', quantity: 450, unit: 'pcs', status: 'OK', lastRestocked: '2 days ago' },
  { id: 'inv-2', name: 'Shampoo (Mini)', category: 'Toiletries', quantity: 45, unit: 'bottles', status: 'CRITICAL', lastRestocked: '1 week ago' },
  { id: 'inv-3', name: 'Pool Towels (Blue)', category: 'Linens', quantity: 120, unit: 'pcs', status: 'LOW', lastRestocked: '3 days ago' },
  { id: 'inv-4', name: 'Coffee Pods', category: 'F&B', quantity: 800, unit: 'pcs', status: 'OK', lastRestocked: 'Yesterday' },
  { id: 'inv-5', name: 'Toilet Paper', category: 'Toiletries', quantity: 1200, unit: 'rolls', status: 'OK', lastRestocked: 'Yesterday' },
];

export const MOCK_EVENTS: ResortEvent[] = [
  { id: 'evt-1', title: 'Sunrise Yoga', time: '07:00 AM', location: 'Beach Deck', category: 'Wellness', description: 'Start your day with peace and ocean views.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80' },
  { id: 'evt-2', title: 'Kids Sandcastle Contest', time: '10:30 AM', location: 'Main Beach', category: 'Kids', description: 'Prizes for the best castle! Buckets provided.', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80' },
  { id: 'evt-3', title: 'Sunset Jazz Hour', time: '06:00 PM', location: 'Horizon Bar', category: 'Nightlife', description: 'Live music and 2-for-1 signature cocktails.', image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d03?auto=format&fit=crop&w=800&q=80' },
  { id: 'evt-4', title: 'Seafood BBQ Buffet', time: '07:00 PM', location: 'The Grill', category: 'Food', description: 'Fresh catch of the day grilled to perfection.', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
];

export const MOCK_DINING: DiningVenue[] = [
  { id: 'din-1', name: 'The Horizon', cuisine: 'International Buffet', rating: 4.8, isOpen: true, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80' },
  { id: 'din-2', name: 'Salty Crab', cuisine: 'Seafood Grill', rating: 4.9, isOpen: false, image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80' },
  { id: 'din-3', name: 'Breeze Lounge', cuisine: 'Cocktails & Tapas', rating: 4.7, isOpen: true, image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80' },
];
