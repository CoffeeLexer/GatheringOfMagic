<picture>
    <img style="margin-left: auto; margin-right: auto" width="150" src="https://raw.githubusercontent.com/T4rt4ru5/GatheringOfMagic/79b34fca443e90f6c106d625ea09b5330f53f09c/docs/KTU.png" alt="KTU LOGO">
</picture>

# Informatics Faculty
### T120B165 Web Application Design
#### Project Gathering Of Magic
This projects mission is to create website for MTG enthusiasts for an easy way to create tournaments and optimal way to construct decks

#1. `/cards`
  - `GET`
    - `200`
      - Returns card list (default `GET` params: page = 1, pageSize = 10)
#2. `/cards/id`
  - `GET`
    - `200`
      - Returns card with specific **id**
    - `404`
      - Card with provided **id** was not found
#3. `/decks`
  - `GET`
    - `200`
      - Returns deck list (default `GET` params: page = 1, pageSize = 10)
  - `POST`
    - `201`
      - Success. Header Location has redirection to created resource
    - `400`
      - Missing required fields from body
      - Cards do not match integer array structure
    - `403`
      - Deck must have minimum of 60 cards
      - User already has a deck with same name
      - IDs in card array has values not matching any data
    - `404`
      - Owner of deck not found
#4. /decks/***id***
  - `GET`
    - `200`
      - Returns deck with specific **id**
    - `404`
      - Resource not found
  - `PATCH`
    - `204` 
      - Success. Does not have body
    - `400`
      - Cards have corrupted format
      - Card id is out of range of available cards
    - `403`
      - User already has deck named with same name
      - Deck must have minimum of 60 cards
    - `404`
      - Deck not found
      - User not found
  - `DELETE`
    - `204`
        - Success. Does not have body
    - `403`
      - Deck already used in tournament CAN NOT be deleted

#5. /duels
- `GET`
    - `200`
        - Returns duel list (default `GET` params: page = 1, pageSize = 10)
- `POST`
    - `201`
        - Success. Header Location has redirection to created resource
    - `400`
        - Missing required fields from body
        - Decks do not match integer array structure
    - `403`
        - Duel do not consist of exact number of 2 decks
        - Decks provided are same (can not play against itself)
        - Winner deck is not deck from dueling deck list
        - Provided decks have same owner, implying player is fighting against himself
    - `404`
        - Tournament not found
        - Winner deck not found
        - Provided decks are not found in database
#6. /duels/***id***
- `GET`
    - `200`
      - Returns duel with specific **id**
    - `404`
      - Resource not found
- `PATCH`
    - `204`
      - Success. Does not have body
    - `400`
      - Decks do not match integer array structure
    - `403`
      - Duel do not consist of exact number of 2 decks
      - Decks provided are same (can not play against itself)
      - Winner deck is not deck from dueling deck list
      - Provided decks have same owner, implying player is fighting against himself
    - `404`
      - Duel not found
      - Tournament not found
      - Winner deck not found
      - Provided decks are not found in database
- `DELETE`
    - `204`
        - Success. Does not have body