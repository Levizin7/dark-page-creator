-- Add dedicated timestamp for when manual_balance was last set
ALTER TABLE public.profiles ADD COLUMN balance_set_at TIMESTAMP WITH TIME ZONE;

-- Enable realtime on transactions and profiles
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;