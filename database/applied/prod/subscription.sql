CREATE TABLE subscriptions (
    stripe_customer_id TEXT NOT NULL UNIQUE PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    subscription_id TEXT NOT NULL UNIQUE,
    subscription_status TEXT NOT NULL DEFAULT 'inactive',
    subscription_end_date INTEGER,
    subscription_end_date_utc TIMESTAMP GENERATED ALWAYS AS (
        CASE
            WHEN subscription_end_date IS NOT NULL
            THEN to_timestamp(subscription_end_date) AT TIME ZONE 'UTC'
            ELSE NULL
        END
    ) STORED,
    subscription_start_date INTEGER,
    subscription_start_date_utc TIMESTAMP GENERATED ALWAYS AS (
        CASE
            WHEN subscription_start_date IS NOT NULL
            THEN to_timestamp(subscription_start_date) AT TIME ZONE 'UTC'
            ELSE NULL
        END
    ) STORED,
    billing_period_start_date INTEGER,
    billing_period_start_date_utc TIMESTAMP GENERATED ALWAYS AS (
        CASE
            WHEN billing_period_start_date IS NOT NULL
            THEN to_timestamp(billing_period_start_date) AT TIME ZONE 'UTC'
            ELSE NULL
        END
    ) STORED,
    canceled_at INTEGER,
    canceled_at_utc TIMESTAMP GENERATED ALWAYS AS (
        CASE
            WHEN canceled_at IS NOT NULL
            THEN to_timestamp(canceled_at) AT TIME ZONE 'UTC'
            ELSE NULL
        END
    ) STORED,
    cancel_at INTEGER,
    cancel_at_utc TIMESTAMP GENERATED ALWAYS AS (
        CASE
            WHEN cancel_at IS NOT NULL
            THEN to_timestamp(cancel_at) AT TIME ZONE 'UTC'
            ELSE NULL
        END
    ) STORED,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    amount NUMERIC,
    currency TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
);

-- Create a trigger to automatically set the updated_at column
CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Create a trigger to set the is_subscribed column in the users table when changed to active
CREATE TRIGGER trigger_set_is_subscribed
AFTER UPDATE OF subscription_status ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION set_is_subscribed();

