const express = require('express');
const app = express();
const port = 8000;
var bodyParser = require('body-parser')
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(cors({
  origin: '*'
}));


// Configuration for facilities
const facilities = [
  { facilityName: 'Clubhouse', slots: [{ start: 10, end: 16, rate: 100 }, { start: 16, end: 22, rate: 500 }] },
  { facilityName: 'Tennis Court', slots: [{ start: 0, end: 24, rate: 50 }] }
];

const bookings = [];
const slotbooklist = [];



app.post('/', (req, res) => {
  let { name, facility, date, startTime, endTime } = req.body;

  startTime = parseInt(startTime);
  endTime = parseInt(endTime);

  // Check if the converted values are valid integers
  if (isNaN(startTime) || isNaN(endTime)) {
    return res.status(400).json({ message: 'Invalid time' });
  }

  // Check if the facility is already booked for the given time slot
  for (const booking of bookings) {
    if (
      booking.facilityName === facility &&
      booking.date === date &&
      !(endTime <= booking.startTime || startTime >= booking.endTime)
    ) {
      return res.status(400).json({ message: 'Booking Failed, Slot Already Booked' });
    }
  }

  // Find the facility configuration
  const facilityConfig = facilities.find((value) => value.facilityName === facility);
  if (!facilityConfig) {
    console.log('Facility not found:', facility);
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
  for (const booking of bookings) {
    if (booking.date === date &&
      !(endTime <= booking.startTime || startTime >= booking.endTime)) {
        slotbooklist.push(true);

      return res.status(400).json({ message: 'Booking Failed, Slot Already Booked' });
    }
    else 
    {
      slotbooklist.push(false);
    }
  }

  // Add the booking record
  const newBooking = { name, facility, date, startTime, endTime, amount: bookingAmount };

  // Check if the same time slot is already booked

 const isSlot= slotbooklist.find=(booking)=>booking===false
  if(isSlot){
    const conflictingBooking = bookings.find(
      (booking) =>
        booking.facilityName === facility &&
        booking.startTime === startTime &&
        booking.date === date && 
        booking.endTime === endTime
    );
    if (conflictingBooking) {
      return res.status(400).json({ message: 'Booking Failed, Slot Already Booked' });
    }

  }else{
    return res.status(400).json({ message: 'Booking Failed, Slot Already Booked' });
  }
  

 

  bookings.push(newBooking);
  console.log('Bookings:', bookings);
  res.status(200).json({ message: 'Booked', amount: bookingAmount, data: bookings });
});
 

app.listen(port,()=>{
    console.log("server is running on ",port)
})