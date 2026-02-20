
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  GUEST = 'GUEST'
}

export enum ServiceCategory {
  CHECK_IN = 'Check-In',
  ROOM = 'Room & Comfort',
  DINING = 'Food & Dining',
  SPA = 'Spa & Wellness', 
  AMENITIES = 'Pool & Fun',
  BEACH = 'Beach Activities',
  STAFF = 'Staff & Service',
  CHECK_OUT = 'Check-Out'
}

export enum GestureType {
  THUMBS_UP = 'THUMBS_UP',
  THUMBS_DOWN = 'THUMBS_DOWN',
  WAVE = 'WAVE',
  NONE = 'NONE'
}

export enum FeedbackStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export enum QueryStatus {
  PENDING = 'PENDING',
  REPLIED = 'REPLIED',
  AUTO_REPLIED = 'AUTO_REPLIED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum RequestCategory {
  HOUSEKEEPING = 'Housekeeping',
  MAINTENANCE = 'Maintenance',
  ROOM_SERVICE = 'Room Service',
  CONCIERGE = 'Concierge',
  TRANSPORT = 'Transport'
}

export enum RoomState {
  CLEAN = 'CLEAN',
  DIRTY = 'DIRTY',
  OCCUPIED = 'OCCUPIED',
  DND = 'DND', // Do Not Disturb
  MAINTENANCE = 'MAINTENANCE'
}

export enum StaffStatus {
  ON_SHIFT = 'ON_SHIFT',
  OFF_SHIFT = 'OFF_SHIFT',
  ON_LEAVE = 'ON_LEAVE',
  BREAK = 'BREAK'
}

// --- Interfaces ---

export interface FeedbackItem {
  category: ServiceCategory;
  rating: number; // 1-5
  comment: string;
  emoji?: string; // The emoji used for rating
  imageUrl?: string; // Optional image proof
}

export interface GuestFeedbackSubmission {
  guestName?: string;
  roomNumber?: string;
  items: FeedbackItem[];
  gesture: GestureType;
  photoUrl?: string;
}

export interface FeedbackRecord extends GuestFeedbackSubmission {
  id: string;
  createdAt: string;
  overallSentiment: number; // -1 to 1
  status: FeedbackStatus;
  keywords: string[];
  isFlagged: boolean;
}

export interface GuestQuery {
  id: string;
  guestName: string;
  roomNumber: string;
  queryText: string;
  status: QueryStatus;
  replyText?: string;
  createdAt: string;
  isAiGenerated: boolean;
}

export interface MaintenanceTicket {
  id: string;
  sourceFeedbackId?: string;
  roomNumber: string;
  issueDescription: string;
  category: ServiceCategory | string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  assignedTo?: string;
  completedAt?: string;
}

export interface ServiceRequest {
  id: string;
  roomNumber: string;
  guestName: string;
  category: RequestCategory;
  item: string; 
  note?: string;
  status: TicketStatus; 
  createdAt: string;
  estimatedTime?: string;
}

export interface RoomStatus {
  roomNumber: string;
  floor: number;
  state: RoomState;
  guestName?: string; 
  nextTask?: string; 
}

export interface StaffStat {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  status: StaffStatus;
  positiveMentions: number;
  avgRating: number;
  shiftStart?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: 'OK' | 'LOW' | 'CRITICAL';
  lastRestocked: string;
}

export interface ResortEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: 'Kids' | 'Wellness' | 'Nightlife' | 'Food';
}

export interface DiningVenue {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  isOpen: boolean;
  rating: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  expiryDate: string;
  isRedeemed: boolean;
}

export interface AnalysisResult {
  sentimentScore: number;
  keywords: string[];
  suggestedReply: string;
  flagPriority: boolean;
}

export interface TimelineStage {
  id: ServiceCategory;
  label: string;
  icon: any; 
}

export interface Prize {
  id: string;
  label: string;
  color: string;
  probability: number;
}

export interface GuestContextType {
  guestName: string;
  roomNumber: string;
  setGuestInfo: (name: string, room: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
