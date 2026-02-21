import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookingForm from './BookingForm';

describe('BookingForm', () => {
  const mockDispatch = jest.fn();
  const mockSubmit = jest.fn();
  const availableTimes = ['17:00', '18:00', '19:00'];

  beforeEach(() => {
    render(
      <BookingForm 
        availableTimes={availableTimes}
        dispatch={mockDispatch}
        submitForm={mockSubmit}
      />
    );
  });

  test('affiche tous les champs du formulaire', () => {
    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/heure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de personnes/i)).toBeInTheDocument();
  });

  test('valide les champs requis', () => {
    const submitButton = screen.getByText(/réserver/i);
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/le nom est requis/i)).toBeInTheDocument();
    expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
  });

  test('valide le format de l\'email', () => {
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'emailinvalide' } });
    expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(screen.queryByText(/email invalide/i)).not.toBeInTheDocument();
  });

  test('valide le nombre de personnes', () => {
    const guestsInput = screen.getByLabelText(/nombre de personnes/i);
    
    fireEvent.change(guestsInput, { target: { value: 0 } });
    expect(screen.getByText(/minimum 1 personne/i)).toBeInTheDocument();
    
    fireEvent.change(guestsInput, { target: { value: 11 } });
    expect(screen.getByText(/maximum 10 personnes/i)).toBeInTheDocument();
  });

  test('appelle dispatch lors du changement de date', () => {
    const dateInput = screen.getByLabelText(/date/i);
    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_TIMES',
      payload: '2024-12-25'
    });
  });

  test('soumet le formulaire avec des données valides', () => {
    // Remplir tous les champs correctement
    fireEvent.change(screen.getByLabelText(/nom complet/i), {
      target: { value: 'Jean Dupont' }
    });
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'jean@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/téléphone/i), {
      target: { value: '0612345678' }
    });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: tomorrowStr }
    });
    
    fireEvent.change(screen.getByLabelText(/heure/i), {
      target: { value: '18:00' }
    });
    
    fireEvent.change(screen.getByLabelText(/nombre de personnes/i), {
      target: { value: 4 }
    });

    const submitButton = screen.getByText(/réserver/i);
    fireEvent.click(submitButton);
    
    expect(mockSubmit).toHaveBeenCalled();
  });
});