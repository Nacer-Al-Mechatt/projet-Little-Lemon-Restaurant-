import React, { useReducer } from 'react';
import BookingForm from '../components/BookingForm';

const timesReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TIMES':
      return ['17:00', '18:00', '19:00', '20:00', '21:00'];
    default:
      return state;
  }
};

const BookingPage = () => {
  const [availableTimes, dispatch] = useReducer(timesReducer, ['17:00', '18:00', '19:00', '20:00', '21:00']);

  const submitForm = (formData) => {
    alert(`Réservation confirmée pour ${formData.name} !`);
    console.log('Réservation:', formData);
  };

  return (
    <main>
      <BookingForm 
        availableTimes={availableTimes}
        dispatch={dispatch}
        submitForm={submitForm}
      />
    </main>
  );
};

export default BookingPage;