-- ============================================================
-- Rate Limiting: table, RPC functions, cleanup
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Rate limits table (used by Edge Function for email throttling)
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_limits_lookup ON rate_limits (ip, action, created_at DESC);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access — only service role (Edge Function) can read/write
-- RLS with no policies = deny all for anon/authenticated roles


-- 2. Rate-limited share insert (max 10 shares per session per minute)
CREATE OR REPLACE FUNCTION rate_limited_share(
  p_user_id uuid,
  p_platform text,
  p_display_name text DEFAULT NULL,
  p_avatar_url text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recent_count int;
BEGIN
  SELECT count(*) INTO recent_count
  FROM shares
  WHERE user_id = p_user_id
    AND created_at > now() - interval '1 minute';

  IF recent_count >= 10 THEN
    RETURN json_build_object('success', false, 'error', 'Rate limit exceeded. Please wait a moment.');
  END IF;

  INSERT INTO shares (user_id, platform, display_name, avatar_url)
  VALUES (p_user_id, p_platform, p_display_name, p_avatar_url);

  RETURN json_build_object('success', true);
END;
$$;


-- 3. Rate-limited submission insert (max 3 submissions per user per 10 minutes)
CREATE OR REPLACE FUNCTION rate_limited_submission(
  p_user_id uuid DEFAULT NULL,
  p_file_url text DEFAULT NULL,
  p_file_type text DEFAULT 'video',
  p_consent boolean DEFAULT true,
  p_display_name text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recent_count int;
  check_id uuid;
BEGIN
  -- For anonymous users, allow but still limit by IP (handled client-side)
  -- For logged-in users, check DB rate
  IF p_user_id IS NOT NULL THEN
    SELECT count(*) INTO recent_count
    FROM challenge_submissions
    WHERE user_id = p_user_id
      AND created_at > now() - interval '10 minutes';

    IF recent_count >= 3 THEN
      RETURN json_build_object('success', false, 'error', 'Upload limit reached. Please wait before submitting again.');
    END IF;
  END IF;

  INSERT INTO challenge_submissions (user_id, file_url, file_type, consent, display_name)
  VALUES (p_user_id, p_file_url, p_file_type, p_consent, p_display_name);

  RETURN json_build_object('success', true);
END;
$$;


-- 4. Cleanup function for rate_limits (call via pg_cron daily)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE sql
AS $$
  DELETE FROM rate_limits WHERE created_at < now() - interval '1 hour';
$$;

-- To schedule daily cleanup (requires pg_cron extension enabled in Supabase):
-- SELECT cron.schedule('cleanup-rate-limits', '0 * * * *', 'SELECT cleanup_rate_limits()');
