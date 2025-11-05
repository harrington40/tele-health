// Booking Service for managing appointments
export interface Booking {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

const BOOKINGS_KEY = 'telehealth_bookings';

export const bookingService = {
  // Get all bookings
  getAllBookings(): Booking[] {
    const bookings = localStorage.getItem(BOOKINGS_KEY);
    return bookings ? JSON.parse(bookings) : [];
  },

  // Get upcoming bookings
  getUpcomingBookings(): Booking[] {
    const bookings = this.getAllBookings();
    const now = new Date();
    return bookings
      .filter(booking => {
        const bookingDate = new Date(booking.date);
        return booking.status === 'upcoming' && bookingDate >= now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  // Add a new booking
  addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const bookings = this.getAllBookings();
    const newBooking: Booking = {
      ...booking,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking;
  },

  // Update booking status
  updateBookingStatus(bookingId: string, status: Booking['status']): boolean {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = status;
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      return true;
    }
    return false;
  },

  // Cancel booking
  cancelBooking(bookingId: string): boolean {
    return this.updateBookingStatus(bookingId, 'cancelled');
  },

  // Delete booking
  deleteBooking(bookingId: string): boolean {
    const bookings = this.getAllBookings();
    const filtered = bookings.filter(b => b.id !== bookingId);
    if (filtered.length < bookings.length) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filtered));
      return true;
    }
    return false;
  },

  // Calculate price based on appointment type
  calculatePrice(basePrice: number, appointmentType: 'video' | 'in-person'): number {
    // In-person visits typically cost more due to facility costs
    const multiplier = appointmentType === 'in-person' ? 1.2 : 1.0;
    return Math.round(basePrice * multiplier);
  },
};

export default bookingService;
