-- backend/database.sql-->

-- Create Users table
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Create Lists table
CREATE TABLE Lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create ListTranslations table
CREATE TABLE ListTranslations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER,
    language TEXT NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY (list_id) REFERENCES Lists(id)
);

-- Create Items table
CREATE TABLE Items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (list_id) REFERENCES Lists(id)
);

-- Create ItemTranslations table
CREATE TABLE ItemTranslations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER,
    language TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES Items(id)
);