-- Create a trigger function to automatically update the `updated_at` column
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Create a trigger function to automatically update isSubscribed column based on the subscription status
-- This trigger is applied to the subscriptions table
CREATE OR REPLACE FUNCTION set_is_subscribed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.subscription_status = 'active' THEN
        UPDATE users SET is_subscribed = TRUE where users.id = New.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
