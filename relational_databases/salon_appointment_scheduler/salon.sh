#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=salon -t --no-align -c"

echo -e "\n~~~~~ MY SALON ~~~~~\n"
echo "Welcome to My Salon, how can I help you?"

display_services() {
    SERVICES=$($PSQL "SELECT service_id, name FROM services ORDER BY service_id")
    echo "$SERVICES" | while IFS='|' read SERVICE_ID NAME
    do
        echo "$SERVICE_ID) $NAME"
    done
}

MAIN_MENU() {
    display_services
    
    # Get service selection
    read SERVICE_ID_SELECTED
    
    # Check if input is a number
    if ! [[ "$SERVICE_ID_SELECTED" =~ ^[0-9]+$ ]]
    then
        echo -e "\nI could not find that service. What would you like today?"
        MAIN_MENU
        return
    fi
    
    # Check if service exists
    SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id = $SERVICE_ID_SELECTED")
    
    if [[ -z "$SERVICE_NAME" ]]
    then
        echo -e "\nI could not find that service. What would you like today?"
        MAIN_MENU
    else
        # Get phone number
        echo -e "\nWhat's your phone number?"
        read CUSTOMER_PHONE
        
        # Escape single quotes in phone number
        CUSTOMER_PHONE_ESCAPED=$(echo "$CUSTOMER_PHONE" | sed "s/'/''/g")
        
        # Check if customer exists
        CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone = '$CUSTOMER_PHONE_ESCAPED'")
        
        if [[ -z "$CUSTOMER_ID" ]]
        then
            # New customer - get name
            echo -e "\nI don't have a record for that phone number, what's your name?"
            read CUSTOMER_NAME
            
            # Escape single quotes in name
            CUSTOMER_NAME_ESCAPED=$(echo "$CUSTOMER_NAME" | sed "s/'/''/g")
            
            # Insert new customer
            INSERT_CUSTOMER_RESULT=$($PSQL "INSERT INTO customers(name, phone) VALUES('$CUSTOMER_NAME_ESCAPED', '$CUSTOMER_PHONE_ESCAPED')")
            
            if [[ "$INSERT_CUSTOMER_RESULT" == "INSERT 0 1" ]]
            then
                CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone = '$CUSTOMER_PHONE_ESCAPED'")
            fi
        fi
        
        # Get customer name if not already set
        if [[ -z "$CUSTOMER_NAME" ]]
        then
            CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE customer_id = $CUSTOMER_ID")
        fi
        
        # Get appointment time
        echo -e "\nWhat time would you like your $SERVICE_NAME, $CUSTOMER_NAME?"
        read SERVICE_TIME
        
        # Escape single quotes in time
        SERVICE_TIME_ESCAPED=$(echo "$SERVICE_TIME" | sed "s/'/''/g")
        
        # Insert appointment
        INSERT_APPOINTMENT_RESULT=$($PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME_ESCAPED')")
        
        # Output confirmation
        echo -e "\nI have put you down for a $SERVICE_NAME at $SERVICE_TIME, $CUSTOMER_NAME."
    fi
}

MAIN_MENU
