const router = require('express').Router();
const { supabase } = require('../supabase');
const { broadcast } = require('../ws');

// GET /api/tickets
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('maintenance_tickets')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /api/tickets — create new work order
router.post('/', async (req, res) => {
    const { roomNumber, issueDescription, category, priority, assignedTo, sourceFeedbackId } = req.body;
    if (!issueDescription) return res.status(400).json({ error: 'issueDescription is required.' });

    const { data, error } = await supabase
        .from('maintenance_tickets')
        .insert([{
            room_number: roomNumber,
            issue_description: issueDescription,
            category: category || 'General',
            priority: priority || 'MEDIUM',
            status: 'OPEN',
            assigned_to: assignedTo || null,
            source_feedback_id: sourceFeedbackId || null
        }])
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'ticket:new', data);
    res.status(201).json(data);
});

// PATCH /api/tickets/:id/status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    const { data, error } = await supabase
        .from('maintenance_tickets')
        .update({ status })
        .eq('id', req.params.id)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'ticket:updated', data);
    res.json(data);
});

// PATCH /api/tickets/:id/assign
router.patch('/:id/assign', async (req, res) => {
    const { assignedTo } = req.body;
    const { data, error } = await supabase
        .from('maintenance_tickets')
        .update({ assigned_to: assignedTo })
        .eq('id', req.params.id)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'ticket:updated', data);
    res.json(data);
});

module.exports = router;
