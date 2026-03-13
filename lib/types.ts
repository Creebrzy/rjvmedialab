export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'customer';
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  category: 'recording' | 'podcast' | 'production' | 'marketing' | 'branding';
  price_type: 'hourly' | 'block' | 'flat';
  price: number;
  duration_hours?: number;
  is_active: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  customer_id: string;
  service_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type BookingWithDetails = Booking & {
  service: Service;
  customer: Profile;
};
