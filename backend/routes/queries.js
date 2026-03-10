const router = require('express').Router();
const { supabase } = require('../supabase');
const { generateQueryResponse } = require('../gemini');
const { broadcast } = require('../ws');

// GET /api/queries
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('guest_queries')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /api/queries — guest submits a query
router.post('/', async (req, res) => {
    const { roomNumber, guestName, queryText } = req.body;
    if (!queryText) return res.status(400).json({ error: 'queryText is required.' });

    const { data, error } = await supabase
        .from('guest_queries')
        .insert([{ room_number: roomNumber, guest_name: guestName, query_text: queryText, status: 'PENDING' }])
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });

    broadcast(req.app, 'query:new', data);
    res.status(201).json(data);
});

// POST /api/queries/:id/reply — manual staff reply
router.post('/:id/reply', async (req, res) => {
    const { reply, isAi = false } = req.body;
    const { data, error } = await supabase
        .from('guest_queries')
        .update({
            reply_text: reply,
            status: isAi ? 'AUTO_REPLIED' : 'REPLIED',
            is_ai_generated: isAi
        })
        .eq('id', req.params.id)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'query:replied', data);
    res.json(data);
});

// POST /api/queries/auto-reply — AI replies to all PENDING queries
router.post('/auto-reply', async (req, res) => {
    const { data: pending, error } = await supabase
        .from('guest_queries')
        .select('*')
        .eq('status', 'PENDING');
    if (error) return res.status(500).json({ error: error.message });

    const results = [];
    for (const query of pending) {
        const aiReply = await generateQueryResponse(query.query_text);
        const { data: updated } = await supabase
            .from('guest_queries')
            .update({ reply_text: aiReply, status: 'AUTO_REPLIED', is_ai_generated: true })
            .eq('id', query.id)
            .select()
            .single();
        if (updated) {
            broadcast(req.app, 'query:replied', updated);
            results.push(updated);
        }
    }
    res.json({ count: results.length, results });
});

module.exports = router;
