#!/bin/bash

# Database setup
PSQL="psql --username=freecodecamp --dbname=postgres -t --no-align -c"

# Create database if it doesn't exist
$PSQL "CREATE DATABASE number_guess;" >/dev/null 2>&1

# Switch to number_guess database
PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

# Create tables if they don't exist
$PSQL "CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(22) UNIQUE NOT NULL
);" >/dev/null 2>&1

$PSQL "CREATE TABLE IF NOT EXISTS games (
    game_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    guesses INTEGER NOT NULL,
    secret_number INTEGER NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);" >/dev/null 2>&1

clear

# Prompt for username exactly as specified
echo "Enter your username:"
read username

# Trim to 22 characters if longer (database constraint)
username="${username:0:22}"

# Check if user exists in database and get user_id
USER_ID=$($PSQL "SELECT user_id FROM users WHERE username = '$username';")

if [[ -n "$USER_ID" ]]
then
    # User exists - get game statistics
    GAMES_PLAYED=$($PSQL "SELECT COUNT(*) FROM games WHERE user_id = $USER_ID;")
    BEST_GAME=$($PSQL "SELECT MIN(guesses) FROM games WHERE user_id = $USER_ID;")
    
    # If user has no games played, set appropriate values
    if [[ -z "$BEST_GAME" ]] || [[ "$BEST_GAME" == "null" ]]
    then
        BEST_GAME=0
        GAMES_PLAYED=0
    fi
    
    # Print exactly as specified for returning user
    echo "Welcome back, $username! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
else
    # New user - insert into database
    echo "Welcome, $username! It looks like this is your first time here."
    
    # Insert new user
    $PSQL "INSERT INTO users(username) VALUES('$username');" >/dev/null
    
    # Get the newly inserted user_id
    USER_ID=$($PSQL "SELECT user_id FROM users WHERE username = '$username';")
fi

# Generate random number between 1 and 1000
SECRET_NUMBER=$(( RANDOM % 1000 + 1 ))
GUESS_COUNT=0

echo "Guess the secret number between 1 and 1000:"

# Game loop
while true
do
    read GUESS
    GUESS_COUNT=$((GUESS_COUNT + 1))
    
    # Validate input is an integer
    if ! [[ "$GUESS" =~ ^-?[0-9]+$ ]]
    then
        echo "That is not an integer, guess again:"
        continue
    fi
    
    # Check if the guess is correct
    if [[ $GUESS -eq $SECRET_NUMBER ]]
    then
        echo "You guessed it in $GUESS_COUNT tries. The secret number was $SECRET_NUMBER. Nice job!"
        
        # Save the game to database
        $PSQL "INSERT INTO games (user_id, guesses, secret_number) VALUES ($USER_ID, $GUESS_COUNT, $SECRET_NUMBER);" >/dev/null
        break
    elif [[ $GUESS -gt $SECRET_NUMBER ]]
    then
        echo "It's lower than that, guess again:"
    else
        echo "It's higher than that, guess again:"
    fi
done
