import React, { useState } from 'react';
import './BookingForm.css';

const BookingForm = ({ availableTimes, dispatch, submitForm }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 1,
    occasion: 'birthday',
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});

  // Validation des champs
  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (!value.trim()) error = 'Le nom est requis';
        else if (value.length < 2) error = 'Le nom doit contenir au moins 2 caractères';
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) error = 'L\'email est requis';
        else if (!emailRegex.test(value)) error = 'Email invalide';
        break;
      
      case 'phone':
        const phoneRegex = /^[0-9+\-\s]{10,}$/;
        if (!value) error = 'Le téléphone est requis';
        else if (!phoneRegex.test(value)) error = 'Numéro de téléphone invalide';
        break;
      
      case 'guests':
        if (value < 1) error = 'Minimum 1 personne';
        else if (value > 10) error = 'Maximum 10 personnes';
        break;
      
      case 'date':
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!value) error = 'La date est requise';
        else if (selectedDate < today) error = 'La date ne peut pas être dans le passé';
        break;
      
      default:
        break;
    }
    
    return error;
  };

  // Gestionnaire de changement
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Mettre à jour les données du formulaire
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Valider le champ
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Si c'est la date qui change, mettre à jour les créneaux disponibles
    if (name === 'date') {
      dispatch({ type: 'UPDATE_TIMES', payload: value });
    }
  };

  // Gestionnaire de soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Valider tous les champs
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    // Si pas d'erreurs, soumettre
    if (Object.keys(newErrors).length === 0) {
      submitForm(formData);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit} aria-label="Formulaire de réservation">
      <h2>Réserver une table</h2>
      
      {/* Nom */}
      <div className="form-group">
        <label htmlFor="name">Nom complet *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="Votre nom"
        />
        {errors.name && (
          <span id="name-error" className="error" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder="votre@email.com"
        />
        {errors.email && (
          <span id="email-error" className="error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {/* Téléphone */}
      <div className="form-group">
        <label htmlFor="phone">Téléphone *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          placeholder="06 12 34 56 78"
        />
        {errors.phone && (
          <span id="phone-error" className="error" role="alert">
            {errors.phone}
          </span>
        )}
      </div>

      {/* Date */}
      <div className="form-group">
        <label htmlFor="date">Date *</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          aria-required="true"
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? "date-error" : undefined}
        />
        {errors.date && (
          <span id="date-error" className="error" role="alert">
            {errors.date}
          </span>
        )}
      </div>

      {/* Heure */}
      <div className="form-group">
        <label htmlFor="time">Heure *</label>
        <select
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          aria-required="true"
        >
          <option value="">Sélectionnez une heure</option>
          {availableTimes.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>

      {/* Nombre de convives */}
      <div className="form-group">
        <label htmlFor="guests">Nombre de personnes *</label>
        <input
          type="number"
          id="guests"
          name="guests"
          min="1"
          max="10"
          value={formData.guests}
          onChange={handleChange}
          aria-required="true"
          aria-invalid={!!errors.guests}
          aria-describedby={errors.guests ? "guests-error" : undefined}
        />
        {errors.guests && (
          <span id="guests-error" className="error" role="alert">
            {errors.guests}
          </span>
        )}
      </div>

      {/* Occasion */}
      <div className="form-group">
        <label htmlFor="occasion">Occasion</label>
        <select
          id="occasion"
          name="occasion"
          value={formData.occasion}
          onChange={handleChange}
        >
          <option value="birthday">Anniversaire</option>
          <option value="anniversary">Anniversaire de mariage</option>
          <option value="business">Affaires</option>
          <option value="other">Autre</option>
        </select>
      </div>

      {/* Bouton de soumission */}
      <button 
        type="submit" 
        className="submit-btn"
        aria-label="Réserver maintenant"
      >
        Réserver
      </button>
    </form>
  );
};

export default BookingForm;