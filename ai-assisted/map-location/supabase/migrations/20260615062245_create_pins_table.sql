CREATE TABLE pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_pins" ON pins FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_pins" ON pins FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_pins" ON pins FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_pins" ON pins FOR DELETE
  TO authenticated USING (true);

CREATE INDEX idx_pins_location ON pins(latitude, longitude);
