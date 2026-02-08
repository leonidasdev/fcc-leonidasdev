#!/bin/bash

# Check if argument is provided
if [ $# -eq 0 ]; then
    echo "Please provide an element as an argument."
    exit 0
fi

# Set up PSQL connection
PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"

# Check if argument is a number (atomic number)
if [[ "$1" =~ ^[0-9]+$ ]]; then
    QUERY_RESULT=$($PSQL "SELECT e.atomic_number, e.name, e.symbol, t.type, p.atomic_mass, p.melting_point_celsius, p.boiling_point_celsius FROM elements e INNER JOIN properties p ON e.atomic_number = p.atomic_number INNER JOIN types t ON p.type_id = t.type_id WHERE e.atomic_number = $1")
else
    # Check if argument is a symbol (1-2 letters) or name
    QUERY_RESULT=$($PSQL "SELECT e.atomic_number, e.name, e.symbol, t.type, p.atomic_mass, p.melting_point_celsius, p.boiling_point_celsius FROM elements e INNER JOIN properties p ON e.atomic_number = p.atomic_number INNER JOIN types t ON p.type_id = t.type_id WHERE e.symbol = '$1' OR e.name = '$1'")
fi

# Check if element was found
if [ -z "$QUERY_RESULT" ]; then
    echo "I could not find that element in the database."
    exit 0
fi

# Parse the result
IFS='|' read -r atomic_number name symbol type atomic_mass melting_point boiling_point <<< "$QUERY_RESULT"

# Output the information
echo "The element with atomic number $atomic_number is $name ($symbol). It's a $type, with a mass of $atomic_mass amu. $name has a melting point of $melting_point celsius and a boiling point of $boiling_point celsius."
