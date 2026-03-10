const router = require('express').Router();
const { supabase } = require('../supabase');
const { broadcast } = require('../ws');

// GET /api/inventory
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('inventory').select('*').order('name');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /api/inventory — add item
router.post('/', async (req, res) => {
    const { name, category, quantity, unit, minThreshold, supplierId } = req.body;
    const { data, error } = await supabase
        .from('inventory')
        .insert([{ name, category, quantity, unit, min_threshold: minThreshold, supplier_id: supplierId }])
        .select().single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'inventory:new', data);
    res.status(201).json(data);
});

// PATCH /api/inventory/:id — update quantity
router.patch('/:id', async (req, res) => {
    const { quantity } = req.body;
    const { data, error } = await supabase
        .from('inventory')
        .update({ quantity })
        .eq('id', req.params.id)
        .select().single();
    if (error) return res.status(500).json({ error: error.message });
    broadcast(req.app, 'inventory:updated', data);
    res.json(data);
});

module.exports = router;
