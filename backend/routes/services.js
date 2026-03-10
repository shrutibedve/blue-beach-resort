const router = require('express').Router();
const { supabase } = require('../supabase');
const { broadcast } = require('../ws');

// GET /api/services
router.get('/', async (req, res) => {
    const { roomNumber } = req.query;
    let query = supabase
        .from('butler_requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (roomNumber) query = query.eq('room_number', roomNumber);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /api/services — guest submits service request
router.post('/', async (req, res) => {
    const { roomNumber, guestName, category, item, note } = req.body;
    if (!item) return res.status(400).json({ error: 'item is required.' });

    const { data, error } = await supabase
        .from('butler_requests')
        .insert([{
            room_number: roomNumber,
            guest_name: guestName,
            category,
            item,
            note: note || null,
            status: 'OPEN',
            estimated_time: '15-30 mins'
        }])
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });

    broadcast(req.app, 'service:new', data);
    res.status(201).json(data);
});

// PATCH /api/services/:id/status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    const { data, error } = await supabase
        .from('butler_requests')
        .update({ status })
        .eq('id', req.params.id)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'service:updated', data);
    res.json(data);
});

module.exports = router;
