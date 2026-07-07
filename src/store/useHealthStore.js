import { create } from 'zustand';

const useHealthStore = create((set) => ({
  user: null,
  vitalityPoints: 0,
  weatherData: null,
  
  // Actions to update state
  setUser: (userData) => set({ user: userData }),
  setVP: (points) => set({ vitalityPoints: points }),
  setWeather: (data) => set({ weatherData: data }),
  
  // Call this after a workout or logging water
  addVP: (amount) => set((state) => ({ vitalityPoints: state.vitalityPoints + amount })),
}));

export default useHealthStore;