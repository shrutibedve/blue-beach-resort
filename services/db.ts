
import { FeedbackRecord, Coupon, GuestFeedbackSubmission, FeedbackStatus, GuestQuery, QueryStatus, MaintenanceTicket, StaffStat, TicketStatus, ServiceRequest, RoomStatus, RoomState, InventoryItem, StaffStatus, ResortEvent, DiningVenue } from "../types";
import { MOCK_FEEDBACK_DATA, MOCK_QUERIES, MOCK_MAINTENANCE_TICKETS, MOCK_STAFF_STATS, MOCK_ROOM_GRID, MOCK_INVENTORY, MOCK_EVENTS, MOCK_DINING } from "../constants";
import { analyzeFeedback, generateQueryResponse } from "./geminiService";

// Initialize with the large generated dataset
let localFeedbackStore = [...MOCK_FEEDBACK_DATA];
let localQueriesStore = [...MOCK_QUERIES];
let localTicketsStore = [...MOCK_MAINTENANCE_TICKETS];
let localStaffStore = [...MOCK_STAFF_STATS];
let localServiceRequests: ServiceRequest[] = [];
let localRoomGrid = [...MOCK_ROOM_GRID];
let localInventory = [...MOCK_INVENTORY];

// Helper for ID generation
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const submitFeedback = async (submission: GuestFeedbackSubmission): Promise<{ feedback: FeedbackRecord; coupon?: Coupon }> => {
  const fullText = submission.items.map(i => `${i.category}: ${i.comment} (${i.rating}/5)`).join('\n');
  const analysis = await analyzeFeedback(fullText, submission.gesture);

  const newRecord: FeedbackRecord = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    guestName: submission.guestName || 'Anonymous',
    roomNumber: submission.roomNumber,
    items: submission.items,
    gesture: submission.gesture,
    photoUrl: submission.photoUrl,
    overallSentiment: analysis.sentimentScore,
    status: FeedbackStatus.NEW,
    keywords: analysis.keywords,
    isFlagged: analysis.flagPriority
  };

  localFeedbackStore.unshift(newRecord);

  const coupon: Coupon = {
      id: generateId(),
      code: `BLUE-${Math.floor(1000 + Math.random() * 9000)}`,
      description: "Free Sunset Cocktail at The Sand Bar",
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      isRedeemed: false
  };

  return { feedback: newRecord, coupon };
};

export const getFeedbackStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    total: localFeedbackStore.length,
    avgSentiment: localFeedbackStore.length > 0 
      ? localFeedbackStore.reduce((acc, curr) => acc + curr.overallSentiment, 0) / localFeedbackStore.length 
      : 0,
    records: [...localFeedbackStore]
  };
};

/* --- Query Service Methods --- */
export const getQueries = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...localQueriesStore];
};

export const updateQueryReply = async (id: string, reply: string, isAi: boolean) => {
  const index = localQueriesStore.findIndex(q => q.id === id);
  if (index !== -1) {
    localQueriesStore[index] = {
      ...localQueriesStore[index],
      status: isAi ? QueryStatus.AUTO_REPLIED : QueryStatus.REPLIED,
      replyText: reply,
      isAiGenerated: isAi
    };
  }
  return localQueriesStore[index];
};

export const autoReplyPendingQueries = async () => {
  const pending = localQueriesStore.filter(q => q.status === QueryStatus.PENDING);
  for (const query of pending) {
    await new Promise(r => setTimeout(r, 800));
    const aiResponse = await generateQueryResponse(query.queryText);
    await updateQueryReply(query.id, aiResponse, true);
  }
  return [...localQueriesStore];
};

/* --- Maintenance & Staff --- */
export const getMaintenanceTickets = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...localTicketsStore];
};

export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  const index = localTicketsStore.findIndex(t => t.id === id);
  if (index !== -1) {
     localTicketsStore[index] = { ...localTicketsStore[index], status };
  }
  return localTicketsStore[index];
};

export const createWorkOrder = async (ticket: Partial<MaintenanceTicket>) => {
    const newTicket: MaintenanceTicket = {
        id: generateId(),
        sourceFeedbackId: undefined,
        roomNumber: ticket.roomNumber || 'Unknown',
        issueDescription: ticket.issueDescription || '',
        category: ticket.category || 'General',
        priority: ticket.priority || 'MEDIUM',
        status: TicketStatus.OPEN,
        createdAt: new Date().toISOString(),
        assignedTo: ticket.assignedTo
    } as MaintenanceTicket;
    localTicketsStore.unshift(newTicket);
    return newTicket;
};

export const getStaffStats = async () => [...localStaffStore];

export const updateStaffStatus = async (id: string, status: StaffStatus) => {
    const idx = localStaffStore.findIndex(s => s.id === id);
    if (idx !== -1) localStaffStore[idx] = { ...localStaffStore[idx], status };
    return localStaffStore[idx];
};

/* --- Service Requests (e-Butler) --- */
export const submitServiceRequest = async (req: Omit<ServiceRequest, 'id' | 'status' | 'createdAt'>) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newReq: ServiceRequest = {
    id: generateId(),
    status: TicketStatus.OPEN,
    createdAt: new Date().toISOString(),
    estimatedTime: '15-30 mins',
    ...req
  };
  localServiceRequests.unshift(newReq);
  return newReq;
};

export const getServiceRequests = async () => [...localServiceRequests];

/* --- Room Grid (Live Ops) --- */
export const getRoomStatusGrid = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...localRoomGrid];
};

export const updateRoomStatus = async (roomNumber: string, newState: RoomState) => {
  const idx = localRoomGrid.findIndex(r => r.roomNumber === roomNumber);
  if(idx !== -1) {
    localRoomGrid[idx] = { ...localRoomGrid[idx], state: newState };
  }
  return localRoomGrid[idx];
};

/* --- Inventory --- */
export const getInventory = async () => [...localInventory];

/* --- Events & Dining --- */
export const getEvents = async () => [...MOCK_EVENTS];
export const getDining = async () => [...MOCK_DINING];
