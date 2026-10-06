-- Allow authenticated dashboard users to read and manage all offers
CREATE POLICY "Auth users can read all offers" ON offers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert offers" ON offers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update offers" ON offers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete offers" ON offers FOR DELETE TO authenticated USING (true);

-- Allow authenticated dashboard users to read and manage all events
CREATE POLICY "Auth users can read all events" ON offer_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert events" ON offer_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update events" ON offer_events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete events" ON offer_events FOR DELETE TO authenticated USING (true);
