/**
 * Event Controller
 * Handles event-related operations
 */

const { formatResponse, validateFields } = require('../utils/helpers');

// Mock data - In a real app, this would come from a database
const events = [
  { id: 1, name: 'Opening Ceremony', date: '2025-02-28', location: 'Siebel Center', description: 'Kickoff event for HackIllinois 2025' },
  { id: 2, name: 'Hacking Begins', date: '2025-02-28', location: 'ECE Building', description: 'Start of the 36-hour hacking session' },
  { id: 3, name: 'Workshop: Intro to AI', date: '2025-03-01', location: 'ECEB 1002', description: 'Learn the basics of AI and machine learning' },
  { id: 4, name: 'Closing Ceremony', date: '2025-03-02', location: 'Siebel Center', description: 'Closing ceremony and project presentations' }
];

/**
 * Get all events
 */
const getAllEvents = (req, res) => {
  res.json(formatResponse(true, { events }));
};

/**
 * Get a single event by ID
 */
const getEventById = (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json(
      formatResponse(false, null, `Event with ID ${eventId} not found`)
    );
  }
  
  res.json(formatResponse(true, { event }));
};

/**
 * Create a new event (mock implementation)
 */
const createEvent = (req, res) => {
  const { name, date, location, description } = req.body;
  
  // Validate required fields
  const validation = validateFields(req.body, ['name', 'date', 'location']);
  
  if (!validation.isValid) {
    return res.status(400).json(
      formatResponse(false, null, `Missing required fields: ${validation.missingFields.join(', ')}`)
    );
  }
  
  // In a real app, this would be saved to a database
  const newEvent = {
    id: events.length + 1,
    name,
    date,
    location,
    description: description || ''
  };
  
  // Mock adding to database
  events.push(newEvent);
  
  res.status(201).json(formatResponse(true, { event: newEvent }));
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent
};