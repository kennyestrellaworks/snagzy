CREATE POLICY "select_pins_anon" ON pins FOR SELECT
  TO anon USING (true);

CREATE POLICY "insert_pins_anon" ON pins FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "update_pins_anon" ON pins FOR UPDATE
  TO anon USING (true) WITH CHECK (true);

CREATE POLICY "delete_pins_anon" ON pins FOR DELETE
  TO anon USING (true);
