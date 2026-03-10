const router = require('express').Router();
const { supabase } = require('../supabase');
const { broadcast } = require('../ws');

// GET /api/dining
router.get('/', async (req, res) => {
    const { roomNumber } = req.query;
    let query = supabase
        .from('dining_bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (roomNumber) query = query.eq('room_number', roomNumber);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /api/dining - create dining booking
router.post('/', async (req, res) => {
    const { roomNumber, guestName, venueId, venueName, bookingTime, guestCount } = req.body;

    const { data, error } = await supabase
        .from('dining_bookings')
        .insert([{
            room_number: roomNumber,
            venue_id: venueId,
            venue_name: venueName,
            booking_time: bookingTime,
            guest_count: guestCount,
            status: 'OPEN'
        }])
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });

    broadcast(req.app, 'dining_booking:new', data);
    res.status(201).json(data);
});

// PATCH /api/dining/:id/status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    const { data, error } = await supabase
        .from('dining_bookings')
        .update({ status })
        .eq('id', req.params.id)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'dining_booking:updated', data);
    res.json(data);
});

module.exports = router;
