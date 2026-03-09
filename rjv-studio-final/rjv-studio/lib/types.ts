export type UserRole = 'admin' | 'customer';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'recording' | 'podcast' | 'production' | 'marketing' | 'branding';
  price_type: 'hourly' | 'block' | 'flat';
  price: number;
  duration_hours?: number;
  is_active: boolean;
  created_at: string;
}

export interface TimeSlot {
  id: string;
  service_id: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  is_available: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  customer_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined
  customer?: Profile;
  service?: Service;
}

export interface BookingWithDetails extends Booking {
  customer: Profile;
  service: Service;
}

export interface DashboardStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  revenue_this_month: number;
  bookings_this_week: number;
}
