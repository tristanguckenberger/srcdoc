#!/bin/bash

# Variables
POSTGRES_VERSION="14"

# Prompt the user for input
read -p "Enter the new db name: " DB_NAME
read -p "Enter the new db user: " DB_USER
read -s -p "Enter the new db password: " DB_PASSWORD
echo

# Check if the user provided all necessary inputs
if [[ -z "$DB_NAME" || -z "$DB_USER" || -z "$DB_PASSWORD" ]]; then
    echo "Error: You must provide a database name, user, and password."
    exit 1
fi


# Check if PostgreSQL is installed
check_postgresql_installed() {
    if brew list postgresql &>/dev/null; then
        echo "PostgreSQL is already installed."
        return 0
    else
        return 1
    fi
}

# Install PostgreSQL if not already installed
if ! check_postgresql_installed; then
    echo "PostgreSQL not found. Installing PostgreSQL..."
    brew update
    brew install postgresql
else
    echo "Skipping PostgreSQL installation."
fi

# Start PostgreSQL service
brew services start postgresql

role_exists() {
    psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1
}

# Create PostgreSQL role if it doesn't exist
if ! role_exists; then
    echo "Creating PostgreSQL role: $DB_USER"
    createuser -s "$DB_USER"
    psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
else
    echo "Role $DB_USER already exists."
fi

# Set PostgreSQL password for the user
psql -U postgres -c "ALTER USER postgres PASSWORD '$DB_PASSWORD';"

# Create the database
createdb -U postgres $DB_NAME

# Create the tables
psql -U postgres -d $DB_NAME -c "
-- Table Definition ----------------------------------------------

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username character varying(50) NOT NULL UNIQUE,
    password character varying(100) NOT NULL,
    email character varying(50),
    google_id text,
    github_id text,
    profile_photo text,
    bio text,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp without time zone,
    is_active boolean DEFAULT false,
    verification_token text,
    tsv tsvector,
    reset_password_token text,
    reset_password_expires timestamp without time zone
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX users_pkey ON users(id int4_ops);
CREATE UNIQUE INDEX users_username_key ON users(username text_ops);


CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    title text,
    description text,
    published boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    thumbnail text,
    tsv tsvector
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX games_pkey ON games(id int4_ops);
CREATE INDEX tsv_idx ON games USING GIN (tsv tsvector_ops);
CREATE INDEX idx_files_user_id ON games(user_id int4_ops);
CREATE INDEX idx_games_user_id ON games(user_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    game_id integer,
    issue_text text
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX issues_pkey ON issues(id int4_ops);

-- Table Definition ----------------------------------------------

CREATE TABLE libraries (
    id SERIAL PRIMARY KEY,
    name character varying(255) NOT NULL UNIQUE,
    url text NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX libraries_name_key ON libraries(name text_ops);
CREATE UNIQUE INDEX libraries_pkey ON libraries(id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    recipient_id integer NOT NULL,
    sender_id integer NOT NULL,
    type character varying(50) NOT NULL,
    entity_id integer,
    entity_type character varying(50),
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    read boolean DEFAULT false
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX notifications_pkey ON notifications(id int4_ops);


CREATE TABLE playlist (
    id SERIAL PRIMARY KEY,
    owner_id integer REFERENCES users(id) ON DELETE CASCADE,
    name text,
    description text,
    is_public boolean DEFAULT false,
    is_category boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tsv tsvector,
    thumbnail text
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX playlist_pkey ON playlist(id int4_ops);
CREATE INDEX idx_playlist_owner_id ON playlist(owner_id int4_ops);
CREATE INDEX idx_playlist_is_public ON playlist(is_public bool_ops);
CREATE INDEX idx_playlist_is_category ON playlist(is_category bool_ops);

-- Table Definition ----------------------------------------------

CREATE TABLE playlist_session (
    session_id SERIAL PRIMARY KEY,
    user_id integer,
    playlist_id integer,
    completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX playlist_session_pkey ON playlist_session(session_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE playlist_user_activity (
    playlist_user_activity_id SERIAL PRIMARY KEY,
    playlist_session_id integer NOT NULL REFERENCES playlist_session(session_id),
    action character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX playlist_user_activity_pkey ON playlist_user_activity(playlist_user_activity_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    game_id integer REFERENCES games(id),
    rating integer NOT NULL CHECK (rating >= 0 AND rating <= 5),
    title text,
    body text,
    difficulty text,
    recommended boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_user_id_game_id_key UNIQUE (user_id, game_id)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX reviews_pkey ON reviews(id int4_ops);
CREATE UNIQUE INDEX reviews_user_id_game_id_key ON reviews(user_id int4_ops,game_id int4_ops);



-- Table Definition ----------------------------------------------

CREATE TABLE review_tags (
    id SERIAL PRIMARY KEY,
    tag_id integer REFERENCES tags(id),
    review_id integer REFERENCES reviews(id),
    timestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tags_review_id_tag_id_key UNIQUE (review_id, tag_id)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX review_tags_pkey ON review_tags(id int4_ops);
CREATE UNIQUE INDEX tags_review_id_tag_id_key ON review_tags(review_id int4_ops,tag_id int4_ops);





CREATE TABLE activity (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id),
    target_id integer NOT NULL,
    primary_text character varying(255),
    activity_type character varying(50) NOT NULL CHECK (activity_type::text = ANY (ARRAY['passive'::character varying::text, 'active'::character varying::text])),
    target_type character varying(50) NOT NULL CHECK (target_type::text = ANY (ARRAY['favorite'::character varying::text, 'game'::character varying::text, 'game_session'::character varying::text, 'playlist'::character varying::text, 'review'::character varying::text, 'comment'::character varying::text, 'share'::character varying::text])),
    timestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_target CHECK ((target_type::text = ANY (ARRAY['favorite'::character varying::text, 'game'::character varying::text, 'game_session'::character varying::text, 'playlist'::character varying::text, 'review'::character varying::text, 'comment'::character varying::text, 'share'::character varying::text])) AND target_id IS NOT NULL)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX activity_pkey ON activity(id int4_ops);
CREATE INDEX idx_activity_user_id ON activity(user_id int4_ops);
CREATE INDEX idx_activity_target_id ON activity(target_id int4_ops);
CREATE INDEX idx_activity_timestamp ON activity(timestamp timestamp_ops);
CREATE INDEX idx_activity_type ON activity(activity_type text_ops);
CREATE INDEX idx_activity_target_type ON activity(target_type text_ops);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    game_id integer,
    parent_comment_id integer REFERENCES comments(id),
    comment_text text,
    tsv tsvector,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX comments_pkey ON comments(id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE dynamic_item (
    item_id SERIAL PRIMARY KEY,
    item_type character varying(50),
    content jsonb,
    created_at timestamp without time zone
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX dynamic_item_pkey ON dynamic_item(item_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE dynamic_item_priority (
    item_id integer REFERENCES dynamic_item(item_id),
    user_id integer,
    priority_score integer,
    CONSTRAINT dynamic_item_priority_pkey PRIMARY KEY (item_id, user_id)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX dynamic_item_priority_pkey ON dynamic_item_priority(item_id int4_ops,user_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE dynamic_user_feed (
    user_id integer,
    item_id integer REFERENCES dynamic_item(item_id),
    feed_timestamp timestamp without time zone,
    CONSTRAINT dynamic_user_feed_pkey PRIMARY KEY (user_id, item_id)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX dynamic_user_feed_pkey ON dynamic_user_feed(user_id int4_ops,item_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    game_id integer,
    timestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT favorites_user_id_game_id_key UNIQUE (user_id, game_id)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX favorites_pkey ON favorites(id int4_ops);
CREATE UNIQUE INDEX favorites_user_id_game_id_key ON favorites(user_id int4_ops,game_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    game_id integer,
    parent_file_id integer REFERENCES files(id) ON DELETE CASCADE,
    name character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    content text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX files_pkey ON files(id int4_ops);
CREATE INDEX idx_files_game_id ON files(game_id int4_ops);
CREATE INDEX idx_files_parent_file_id ON files(parent_file_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE follows (
    follow_id SERIAL PRIMARY KEY,
    follower_id integer REFERENCES users(id),
    following_id integer REFERENCES users(id),
    timestamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX follows_pkey ON follows(follow_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE game_libraries (
    gameid integer,
    libraryid integer REFERENCES libraries(id),
    CONSTRAINT game_libraries_pkey PRIMARY KEY (gameid, libraryid)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX game_libraries_pkey ON game_libraries(gameid int4_ops,libraryid int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE game_playlist (
    id SERIAL PRIMARY KEY,
    game_id integer REFERENCES games(id) ON DELETE CASCADE,
    playlist_id integer REFERENCES playlist(id) ON DELETE CASCADE,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    item_order integer
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX game_playlist_pkey ON game_playlist(id int4_ops);
CREATE INDEX idx_game_playlist_game_id ON game_playlist(game_id int4_ops);
CREATE INDEX idx_game_playlist_playlist_id ON game_playlist(playlist_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE game_session (
    game_session_id SERIAL PRIMARY KEY,
    game_id integer NOT NULL REFERENCES games(id),
    user_id integer NOT NULL REFERENCES users(id),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    session_total_time interval,
    session_total_score integer
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX game_session_pkey ON game_session(game_session_id int4_ops);
CREATE INDEX idx_game_session_game_id ON game_session(game_id int4_ops);
CREATE INDEX idx_game_session_user_id ON game_session(user_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE game_tags (
    game_id integer,
    tag_id integer REFERENCES tags(id),
    CONSTRAINT game_tags_pkey PRIMARY KEY (game_id, tag_id)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX game_tags_pkey ON game_tags(game_id int4_ops,tag_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE game_user_activity (
    game_user_activity_id SERIAL PRIMARY KEY,
    game_session_id integer NOT NULL REFERENCES game_session(game_session_id),
    action game_action NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX game_user_activity_pkey ON game_user_activity(game_user_activity_id int4_ops);
CREATE INDEX idx_game_user_activity_game_session_id ON game_user_activity(game_session_id int4_ops);

-- Table Definition ----------------------------------------------

CREATE TABLE user_activity_feed (
    id SERIAL PRIMARY KEY,
    activity_id integer NOT NULL REFERENCES activity(id),
    user_id integer NOT NULL REFERENCES users(id),
    viewed boolean DEFAULT false
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX user_activity_feed_pkey ON user_activity_feed(id int4_ops);
CREATE INDEX idx_user_activity_feed_activity_id ON user_activity_feed(activity_id int4_ops);
CREATE INDEX idx_user_activity_feed_user_id ON user_activity_feed(user_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE user_personas (
    user_id integer PRIMARY KEY,
    persona jsonb,
    last_updated timestamp without time zone
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX user_personas_pkey ON user_personas(user_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE user_playlist (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id) ON DELETE CASCADE,
    playlist_id integer REFERENCES playlist(id) ON DELETE CASCADE,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX user_playlist_pkey ON user_playlist(id int4_ops);
CREATE INDEX idx_user_playlist_user_id ON user_playlist(user_id int4_ops);
CREATE INDEX idx_user_playlist_playlist_id ON user_playlist(playlist_id int4_ops);


-- Table Definition ----------------------------------------------

CREATE TABLE user_review_approval (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id),
    review_id integer REFERENCES reviews(id),
    approval_status boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_review_id_user_id_key UNIQUE (user_id, review_id)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX user_review_approval_pkey ON user_review_approval(id int4_ops);
CREATE UNIQUE INDEX users_review_id_user_id_key ON user_review_approval(user_id int4_ops,review_id int4_ops);



-- Table Definition ----------------------------------------------

CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id),
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_date timestamp without time zone,
    hide_pop_up_info boolean DEFAULT false,
    dark_mode boolean DEFAULT false,
    hide_pop_up_info_home boolean DEFAULT false,
    hide_pop_up_info_games boolean DEFAULT false,
    hide_pop_up_info_editor boolean DEFAULT false
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX user_settings_pkey ON user_settings(id int4_ops);


-- Triggers and other such content

-- User triggers --

-- Create trigger to automatically update 'updated_date'
CREATE OR REPLACE FUNCTION set_initial_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = NEW.created_date;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_initial_updated_date_trigger
BEFORE INSERT ON users
FOR EACH ROW EXECUTE FUNCTION set_initial_updated_date();

-- Create or replace function to update 'updated_date'
CREATE OR REPLACE FUNCTION update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = current_timestamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_updated_date_trigger
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_date();

-- game triggers

-- Create or replace function to update 'updated_date'
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = current_timestamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update 'updated_date'
CREATE TRIGGER update_updated_at_trigger
BEFORE UPDATE ON games
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION set_initial_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NEW.created_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_initial_updated_at_trigger
BEFORE INSERT ON games
FOR EACH ROW EXECUTE FUNCTION set_initial_updated_at();

CREATE TRIGGER set_initial_updated_at
AFTER INSERT ON games
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE games ADD COLUMN IF NOT EXISTS tsv TSVECTOR;
ALTER TABLE playlist ADD COLUMN IF NOT EXISTS tsv TSVECTOR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS tsv TSVECTOR;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS tsv TSVECTOR;

UPDATE games
SET tsv = to_tsvector('english', title || ' ' || description || ' ');

-- For games
CREATE OR REPLACE FUNCTION games_tsv_trigger() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('english', coalesce(NEW.title,'') || ' ' || coalesce(NEW.description,''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- For playlist
CREATE OR REPLACE FUNCTION playlist_tsv_trigger() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('english', coalesce(NEW.name,'') || ' ' || coalesce(NEW.description,''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- For users
CREATE OR REPLACE FUNCTION users_tsv_trigger() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('english', coalesce(NEW.username,'') || ' ' || coalesce(NEW.bio,''));
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- For comments
CREATE OR REPLACE FUNCTION comments_tsv_trigger() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('english', NEW.comment_text);
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- For games
CREATE TRIGGER tsvupdate_games BEFORE INSERT OR UPDATE ON games
FOR EACH ROW EXECUTE FUNCTION games_tsv_trigger();

-- For playlist
CREATE TRIGGER tsvupdate_playlist BEFORE INSERT OR UPDATE ON playlist
FOR EACH ROW EXECUTE FUNCTION playlist_tsv_trigger();

-- For users
CREATE TRIGGER tsvupdate_users BEFORE INSERT OR UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION users_tsv_trigger();

-- For comments
CREATE TRIGGER tsvupdate_comments BEFORE INSERT OR UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION comments_tsv_trigger();

CREATE INDEX tsv_idx ON games USING GIN (tsv);
CREATE INDEX tsv_idx ON playlist USING GIN (tsv);
CREATE INDEX tsv_idx ON users USING GIN (tsv);
CREATE INDEX tsv_idx ON comments USING GIN (tsv);


UPDATE users
SET tsv = to_tsvector('english', username || ' ' || bio || ' ');
UPDATE comments
SET tsv = to_tsvector('english', comment_text || ' ');

CREATE INDEX idx_games_user_id ON games(user_id);

CREATE INDEX idx_game_user_activity_game_session_id ON game_user_activity(game_session_id);

CREATE INDEX idx_files_parent_file_id ON files(parent_file_id);

CREATE INDEX idx_game_session_game_id ON game_session(game_id);

CREATE INDEX idx_game_session_user_id ON game_session(user_id);

CREATE INDEX idx_game_playlist_game_id ON game_playlist(game_id);

CREATE INDEX idx_game_playlist_playlist_id ON game_playlist(playlist_id);

CREATE INDEX idx_playlist_owner_id ON playlist(owner_id);

CREATE INDEX idx_playlist_is_public ON playlist(is_public);

CREATE INDEX idx_playlist_is_category ON playlist(is_category);

CREATE INDEX idx_user_playlist_user_id ON user_playlist(user_id);

CREATE INDEX idx_user_playlist_playlist_id ON user_playlist(playlist_id);

CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_user_settings
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_user_settings();

CREATE OR REPLACE FUNCTION clear_expired_reset_tokens()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reset_password_expires < NOW() THEN
    NEW.reset_password_token := NULL;
    NEW.reset_password_expires := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER check_reset_token_expiry
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION clear_expired_reset_tokens();

CREATE OR REPLACE FUNCTION clear_expired_reset_tokens()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reset_password_expires IS NOT NULL AND NEW.reset_password_expires < NOW() THEN
    NEW.reset_password_token := NULL;
    NEW.reset_password_expires := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_reset_token_expiry
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION clear_expired_reset_tokens();

CREATE OR REPLACE FUNCTION clear_expired_reset_tokens()
RETURNS TRIGGER AS $$
BEGIN
  RAISE NOTICE 'Trigger fired for user ID: %', NEW.id;
  IF NEW.reset_password_expires IS NOT NULL AND NEW.reset_password_expires < NOW() THEN
    RAISE NOTICE 'Clearing reset token and expiration for user ID: %', NEW.id;
    NEW.reset_password_token := NULL;
    NEW.reset_password_expires := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_reset_token_expiry ON users;

CREATE TRIGGER check_reset_token_expiry
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION clear_expired_reset_tokens();


CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = current_timestamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update 'updated_at'
CREATE TRIGGER update_comments_updated_at_trigger
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_comments_updated_at();

CREATE OR REPLACE FUNCTION set_initial_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NEW.created_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_initial_comments_updated_at_trigger
BEFORE INSERT ON comments
FOR EACH ROW EXECUTE FUNCTION set_initial_comments_updated_at();


CREATE OR REPLACE FUNCTION set_initial_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.timestamp = NEW.timestamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_initial_updated_at_trigger
BEFORE INSERT ON favorites
FOR EACH ROW EXECUTE FUNCTION set_initial_updated_at();


CREATE OR REPLACE FUNCTION insert_user_activity_feed()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert records into the user_activity_feed table for each follower
    INSERT INTO user_activity_feed (activity_id, user_id)
    SELECT NEW.id, follows.follower_id
    FROM follows
    WHERE follows.following_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_activity_insert
AFTER INSERT ON activity
FOR EACH ROW
EXECUTE FUNCTION insert_user_activity_feed();
"

echo "Database and table setup complete."