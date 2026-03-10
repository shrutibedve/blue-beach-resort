const router = require('express').Router();
const { supabase } = require('../supabase');
const { analyzeFeedback } = require('../gemini');
const { broadcast } = require('../ws');

// GET /api/feedback — fetch all with items
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('feedback')
        .select('*, feedback_items(*)')
        .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /api/feedback — submit new feedback + run AI analysis
router.post('/', async (req, res) => {
    const { roomNumber, guestName, items, gesture, photoUrl } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'No feedback items.' });

    try {
        // 1. Run AI analysis
        const fullText = items.map(i => `${i.category}: ${i.comment} (${i.rating}/5)`).join('\n');
        const analysis = await analyzeFeedback(fullText, gesture);

        // 2. Insert master record
        const { data: record, error: recErr } = await supabase
            .from('feedback')
            .insert([{
                room_number: roomNumber,
                guest_name: guestName || 'Anonymous',
                overall_sentiment: analysis.sentimentScore,
                gesture_type: gesture,
                photo_url: photoUrl || null,
                status: 'NEW',
                keywords: analysis.keywords,
                is_flagged: analysis.flagPriority
            }])
            .select()
            .single();
        if (recErr) throw recErr;

        // 3. Insert feedback items
        const itemRows = items.map(item => ({
            feedback_id: record.id,
            category: item.category,
            rating: item.rating,
            comment: item.comment || '',
            image_url: item.imageUrl || null
        }));
        const { error: itemsErr } = await supabase.from('feedback_items').insert(itemRows);
        if (itemsErr) throw itemsErr;

        // 4. Generate coupon
        const coupon = {
            code: `BLUE-${Math.floor(1000 + Math.random() * 9000)}`,
            description: 'Free Sunset Cocktail at The Sand Bar',
            expiryDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
        };

        // 5. Broadcast to all WS clients
        broadcast(req.app, 'feedback:new', { record: { ...record, items }, analysis, coupon });

        res.status(201).json({ record: { ...record, items }, analysis, coupon });
    } catch (err) {
        console.error('[POST /feedback]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/feedback/:id/status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    const { data, error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', req.params.id)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'feedback:updated', data);
    res.json(data);
});

module.exports = router;
