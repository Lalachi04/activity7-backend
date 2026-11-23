const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const file = path.join(__dirname, '..', 'data', 'records.json');

// Read records from the JSON file
function readRecords() {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

// Save records to the JSON file
function saveRecords(records) {
  fs.writeFileSync(file, JSON.stringify(records, null, 2));
}

// Validate title
function validTitle(title) {
  return (
    typeof title === 'string' &&
    title.trim().length >= 3 &&
    title.trim().length <= 80
  );
}

// Validate record ID
function validId(id) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

// Valid statuses
const validStatuses = ['pending', 'in-progress', 'completed'];

// GET all records
router.get('/', (req, res) => {
  res.json(readRecords());
});

// GET a single record
router.get('/:id', (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  const records = readRecords();
  const record = records.find(r => r.id === Number(req.params.id));

  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }

  res.json(record);
});

// POST create a new record
router.post('/', (req, res) => {
  const { title, description, status } = req.body || {};

  if (!validTitle(title)) {
    return res.status(400).json({
      error: 'title must be 3-80 characters'
    });
  }

  if (
    status !== undefined &&
    !validStatuses.includes(status)
  ) {
    return res.status(400).json({
      error: 'status must be pending, in-progress, or completed'
    });
  }

  const records = readRecords();

  const newRecord = {
    id: records.length
      ? Math.max(...records.map(r => r.id)) + 1
      : 1,
    title: title.trim(),
    description:
      typeof description === 'string'
        ? description.trim()
        : '',
    status: status || 'pending',
    createdAt: new Date().toISOString()
  };

  records.push(newRecord);
  saveRecords(records);

  res.status(201).json(newRecord);
});

// PUT update a record
router.put('/:id', (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  const records = readRecords();
  const index = records.findIndex(
    r => r.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Record not found' });
  }

  const { title, description, status } = req.body || {};

  if (!validTitle(title)) {
    return res.status(400).json({
      error: 'title must be 3-80 characters'
    });
  }

  if (
    status !== undefined &&
    !validStatuses.includes(status)
  ) {
    return res.status(400).json({
      error: 'status must be pending, in-progress, or completed'
    });
  }

  records[index] = {
    ...records[index],
    title: title.trim(),
    description:
      typeof description === 'string'
        ? description.trim()
        : '',
    status: status || records[index].status,
    updatedAt: new Date().toISOString()
  };

  saveRecords(records);

  res.status(200).json(records[index]);
});

// DELETE a record
router.delete('/:id', (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  const records = readRecords();
  const filteredRecords = records.filter(
    r => r.id !== Number(req.params.id)
  );

  if (filteredRecords.length === records.length) {
    return res.status(404).json({ error: 'Record not found' });
  }

  saveRecords(filteredRecords);

  res.status(200).json({
    message: 'Record deleted successfully'
  });
});

module.exports = router;