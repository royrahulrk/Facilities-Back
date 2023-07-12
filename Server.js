const express = require('express');
const app = express();
const port = 8000;
var bodyParser = require('body-parser')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(cors({
  origin: '*'
}));


// Configuration for facilities
const facilities = [
  { name: 'Clubhouse', slots: [{ start: 10, end: 16, rate: 100 }, { start: 16, end: 22, rate: 500 }] },
  { name: 'Tennis Court', slots: [{ start: 0, end: 24, rate: 50 }] }
];

const bookings = [];
app.post('/', (req, res) => {
  const { facility, date, startTime, endTime } = req.body;

  // Check if the facility is already booked for the given time slot
  for (const booking of bookings) {
    if (
      booking.facility === facility &&
      booking.date === date &&
      booking.startTime <= startTime &&
      booking.endTime >= endTime
    ) {
      return res.status(400).json({ message: 'Booking Failed, Already Booked' });
    }
  }

  // Find the facility configuration
  const facilityConfig = facilities.find((f) => f.name === facility);
  if (!facilityConfig) {
    return res.status(404).json({ message: 'Booking Failed, Facility Not Found' });
  }

  // Calculate the booking amount based on the facility configuration
  let bookingAmount = 0;
  for (const slot of facilityConfig.slots) {
    if (startTime >= slot.start && endTime <= slot.end) {
      bookingAmount = (endTime - startTime) * slot.rate;
      break;
    }
  }

  // Add the booking record
  bookings.push({ facility, date, startTime, endTime, amount: bookingAmount });
  console.log(bookings)
  res.status(200).json({ message: 'Booked', amount: bookingAmount });
});

app.listen(port,()=>{
    console.log("server is running on ",port)
})