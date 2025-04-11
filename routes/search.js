import express from 'express';
const router = express.Router();

// Mock AI suggestions
router.post('/', async (req, res) => {
  const { query } = req.body;

  const destinations = ['Paris', 'Tokyo', 'New York', 'Dubai', 'Rome'];
  const filtered = destinations.filter((d) =>
    d.toLowerCase().includes(query.toLowerCase())
  );

  res.json({ suggestions: filtered });
});

export default router;
