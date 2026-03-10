const router = require('express').Router();
const { supabase } = require('../supabase');
const { broadcast } = require('../ws');

// GET /api/rooms
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('room_number');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// PATCH /api/rooms/:roomNumber/state — update room state
router.patch('/:roomNumber/state', async (req, res) => {
    const { state } = req.body;
    const { data, error } = await supabase
        .from('rooms')
        .update({ state })
        .eq('room_number', req.params.roomNumber)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'room:updated', data);
    res.json(data);
});

// PATCH /api/rooms/:roomNumber/guest — assign/unassign guest
router.patch('/:roomNumber/guest', async (req, res) => {
    const { guestName, checkIn, checkOut } = req.body;
    const { data, error } = await supabase
        .from('rooms')
        .update({ guest_name: guestName, check_in: checkIn, check_out: checkOut })
        .eq('room_number', req.params.roomNumber)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'room:updated', data);
    res.json(data);
});

module.exports = router;
