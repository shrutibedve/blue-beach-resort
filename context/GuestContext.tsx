
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GuestContextType } from '../types';

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guestName, setGuestName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('blue_beach_guest_name');
    const storedRoom = localStorage.getItem('blue_beach_room');
    if (storedName) setGuestName(storedName);
    if (storedRoom) setRoomNumber(storedRoom);
  }, []);

  const setGuestInfo = (name: string, room: string) => {
    setGuestName(name);
    setRoomNumber(room);
    localStorage.setItem('blue_beach_guest_name', name);
    localStorage.setItem('blue_beach_room', room);
  };

  const logout = () => {
    setGuestName('');
    setRoomNumber('');
    localStorage.removeItem('blue_beach_guest_name');
    localStorage.removeItem('blue_beach_room');
  };

  return (
    <GuestContext.Provider value={{ 
      guestName, 
      roomNumber, 
      setGuestInfo, 
      logout,
      isAuthenticated: !!guestName && !!roomNumber 
    }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) throw new Error("useGuest must be used within a GuestProvider");
  return context;
};
