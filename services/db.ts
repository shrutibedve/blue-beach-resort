
import { FeedbackRecord, Coupon, GuestFeedbackSubmission, FeedbackStatus, GuestQuery, QueryStatus, MaintenanceTicket, StaffStat, TicketStatus, ServiceRequest, RoomStatus, RoomState, InventoryItem, StaffStatus, ResortEvent, DiningVenue } from "../types";
import { MOCK_FEEDBACK_DATA, MOCK_QUERIES, MOCK_MAINTENANCE_TICKETS, MOCK_STAFF_STATS, MOCK_ROOM_GRID, MOCK_INVENTORY, MOCK_EVENTS, MOCK_DINING } from "../constants";
import { analyzeFeedback, generateQueryResponse } from "./geminiService";
import { supabase } from "./supabaseClient";

// Helper for ID generation
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const submitFeedback = async (submission: GuestFeedbackSubmission): Promise<{ feedback: FeedbackRecord; coupon?: Coupon }> => {
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return { feedback: data.record, coupon: data.coupon };
  } catch (e) {
    console.warn('Fallback submitFeedback:', e);
    const mockRecord = {
      id: generateId(),
      guestName: submission.guestName || 'Anonymous',
      roomNumber: submission.roomNumber,
      createdAt: new Date().toISOString(),
      items: submission.items,
      gesture: submission.gesture,
      overallSentiment: submission.items.reduce((acc, curr) => acc + curr.rating, 0) / submission.items.length,
      status: FeedbackStatus.NEW,
    } as any;
    return { feedback: mockRecord };
  }
};

export const getFeedbackStats = async () => {
  try {
    const res = await fetch('/api/feedback');
    if (!res.ok) throw new Error('API Error');
    const records = await res.json();

    // Map API snake_case format to frontend camelCase format (and append mock records)
    const mappedRecords = records.map((r: any) => ({
      id: r.id,
      guestName: r.guest_name || 'Anonymous',
      roomNumber: r.room_number,
      createdAt: r.created_at,
      items: r.items || [],
      gesture: r.gesture_type,
      overallSentiment: r.overall_sentiment,
      status: r.status,
      keywords: r.keywords || [],
      isFlagged: r.is_flagged
    }));

    const combined = [...mappedRecords, ...MOCK_FEEDBACK_DATA];

    return {
      total: combined.length,
      avgSentiment: combined.length > 0
        ? combined.reduce((acc: number, curr: any) => acc + curr.overallSentiment, 0) / combined.length
        : 0,
      records: combined
    };
  } catch (error) {
    console.warn('Fallback to mock feedback stats:', error);
    return {
      total: MOCK_FEEDBACK_DATA.length,
      avgSentiment: MOCK_FEEDBACK_DATA.length > 0
        ? MOCK_FEEDBACK_DATA.reduce((acc: number, curr: any) => acc + curr.overallSentiment, 0) / MOCK_FEEDBACK_DATA.length
        : 0,
      records: MOCK_FEEDBACK_DATA
    };
  }
};

/* --- Query Service Methods --- */
export const getQueries = async () => {
  const { data, error } = await supabase
    .from('guest_queries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return MOCK_QUERIES;
  }
  return data;
};

export const updateQueryReply = async (id: string, reply: string, isAi: boolean) => {
  const { data, error } = await supabase
    .from('guest_queries')
    .update({
      reply_text: reply,
      status: isAi ? QueryStatus.AUTO_REPLIED : QueryStatus.REPLIED,
      is_ai_generated: isAi
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.warn('Fallback updateQueryReply', error);
    return { id, reply_text: reply, status: isAi ? QueryStatus.AUTO_REPLIED : QueryStatus.REPLIED, is_ai_generated: isAi };
  }
  return data;
};

export const autoReplyPendingQueries = async () => {
  const { data: pending, error } = await supabase
    .from('guest_queries')
    .select('*')
    .eq('status', QueryStatus.PENDING);

  if (error) throw error;

  for (const query of pending || []) {
    const aiResponse = await generateQueryResponse(query.query_text);
    await updateQueryReply(query.id, aiResponse, true);
  }

  return getQueries();
};

/* --- Maintenance & Staff --- */
export const getMaintenanceTickets = async () => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return MOCK_MAINTENANCE_TICKETS;
  }
  return data;
};

export const updateTicketStatus = async (id: string, status: TicketStatus) => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.warn('Fallback updateTicketStatus', error);
    return { id, status };
  }
  return data;
};

export const createWorkOrder = async (ticket: Partial<MaintenanceTicket>) => {
  const { data, error } = await supabase
    .from('maintenance_tickets')
    .insert([{
      room_number: ticket.roomNumber,
      issue_description: ticket.issueDescription,
      category: ticket.category,
      priority: ticket.priority,
      status: TicketStatus.OPEN
    }])
    .select()
    .single();

  if (error) {
    console.warn('Fallback createWorkOrder', error);
    return { id: generateId(), ...ticket, status: TicketStatus.OPEN };
  }
  return data;
};

export const getStaffStats = async () => {
  const { data, error } = await supabase
    .from('staff_stats')
    .select(`
      *,
      profiles(*)
    `);

  if (error || !data || data.length === 0) {
    return MOCK_STAFF_STATS;
  }
  return data.map(s => ({
    ...s,
    name: s.profiles?.full_name || 'Staff Member',
    avatar: s.profiles?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff'
  }));
};

export const updateStaffStatus = async (id: string, status: StaffStatus) => {
  const { data, error } = await supabase
    .from('staff_stats')
    .update({ status })
    .eq('staff_id', id)
    .select()
    .single();

  if (error) {
    console.warn('Fallback updateStaffStatus', error);
    return { staff_id: id, status };
  }
  return data;
};

/* --- Service Requests (e-Butler) --- */
export const submitServiceRequest = async (req: Omit<ServiceRequest, 'id' | 'status' | 'createdAt'>) => {
  try {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (e) {
    console.warn('Fallback submitServiceRequest:', e);
    return { id: generateId(), ...req, status: 'OPEN', created_at: new Date().toISOString() };
  }
};

export const getServiceRequests = async () => {
  try {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();

    // Create some placeholder live ops if nothing is loaded yet
    const fallbackRequests = [
      { id: 'bh-01', room_number: '102', item: 'Pillows', note: 'Extra soft please', status: 'OPEN', created_at: new Date().toISOString() },
      { id: 'bh-02', room_number: '204', item: 'Towels', note: '', status: 'IN_PROGRESS', created_at: new Date(Date.now() - 600000).toISOString() },
    ];
    return [...data, ...(data.length === 0 ? fallbackRequests : [])];
  } catch (error) {
    console.warn('Fallback getting service requests:', error);
    return [
      { id: 'bh-01', room_number: '102', item: 'Pillows', note: 'Extra soft please', status: 'OPEN', created_at: new Date().toISOString() },
      { id: 'bh-02', room_number: '204', item: 'Towels', note: '', status: 'IN_PROGRESS', created_at: new Date(Date.now() - 600000).toISOString() },
    ];
  }
};

export const submitDiningBooking = async (req: any) => {
  try {
    const res = await fetch('/api/dining', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (e) {
    console.warn('Fallback submitDiningBooking:', e);
    return { id: generateId(), ...req, status: 'CONFIRMED', created_at: new Date().toISOString() };
  }
};

export const getDiningBookings = async () => {
  try {
    const res = await fetch('/api/dining');
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();

    const fallbackBookings = [
      { id: 'db-1', room_number: '302', venue_name: 'The Azure Grill', booking_time: '7:30 PM', guest_count: 2, status: 'CONFIRMED', created_at: new Date().toISOString() },
      { id: 'db-2', room_number: '105', venue_name: 'Luna Rooftop Bar', booking_time: '8:00 PM', guest_count: 4, status: 'SEATED', created_at: new Date(Date.now() - 3600000).toISOString() },
    ];
    return [...data, ...(data.length === 0 ? fallbackBookings : [])];
  } catch (error) {
    console.warn('Fallback fetching dining bookings:', error);
    return [
      { id: 'db-1', room_number: '302', venue_name: 'The Azure Grill', booking_time: '7:30 PM', guest_count: 2, status: 'CONFIRMED', created_at: new Date().toISOString() },
      { id: 'db-2', room_number: '105', venue_name: 'Luna Rooftop Bar', booking_time: '8:00 PM', guest_count: 4, status: 'SEATED', created_at: new Date(Date.now() - 3600000).toISOString() },
    ];
  }
};

/* --- Room Grid (Live Ops) --- */
export const getRoomStatusGrid = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('room_number', { ascending: true });

  if (error || !data || data.length === 0) {
    return MOCK_ROOM_GRID;
  }
  return data;
};

export const updateRoomStatus = async (roomNumber: string, newState: RoomState) => {
  const { data, error } = await supabase
    .from('rooms')
    .update({ state: newState })
    .eq('room_number', roomNumber)
    .select()
    .single();

  if (error) {
    console.warn('Fallback updateRoomStatus', error);
    return { room_number: roomNumber, state: newState };
  }
  return data;
};

/* --- Inventory --- */
export const getInventory = async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*');

  if (error || !data || data.length === 0) {
    return MOCK_INVENTORY;
  }
  return data;
};

/* --- Events & Dining --- */
export const getEvents = async () => {
  const { data, error } = await supabase.from('resort_events').select('*');
  return (!data || data.length === 0 || error) ? MOCK_EVENTS : data;
};

export const getDining = async () => {
  const { data, error } = await supabase.from('dining_venues').select('*');
  return (!data || data.length === 0 || error) ? MOCK_DINING : data;
};
