const router = require('express').Router();
const { supabase } = require('../supabase');

// GET /api/staff
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('staff_stats')
        .select('*, profiles(full_name, avatar_url, role)');
    if (error) return res.status(500).json({ error: error.message });
    const mapped = data.map(s => ({
        ...s,
        name: s.profiles?.full_name || 'Staff Member',
        avatar: s.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.staff_id}`,
        role: s.profiles?.role || 'Staff'
    }));
    res.json(mapped);
});

// PATCH /api/staff/:id/status
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    const { data, error } = await supabase
        .from('staff_stats')
        .update({ status })
        .eq('staff_id', req.params.id)
        .select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;
