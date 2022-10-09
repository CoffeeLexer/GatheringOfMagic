<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/T4rt4ru5/GatheringOfMagic/main/docs/KTU%20white.png">
        <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/T4rt4ru5/GatheringOfMagic/main/docs/KTU%20black.png">
        <img width="50%" alt="KTU LOGO" src="https://user-images.githubusercontent.com/25423296/163456779-a8556205-d0a5-45e2-ac17-42d089e3c3f8.png">
    </picture>
</p>

# Informatics Faculty
### T120B165 Web Application Design
#### Project Gathering Of Magic
This projects mission is to create website for MTG enthusiasts for an easy way to create tournaments and optimal way to construct decks

# `/cards`
  - `GET`
    - `200`
      - Returns card list (default `GET` params: page = 1, pageSize = 10)
# `/cards/id`
  - `GET`
    - `200`
      - Returns card with specific **id**
    - `404`
      - Card with provided **id** was not found
# `/decks`
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
    - `POST` example body
    ```
    {
        "name": "Storm From Within8",
        "owner": "Master",
        "cards": [
            960 ,961 ,962 ,963 ,964 ,965 ,966 ,967 ,968 ,969 ,970 ,971 ,972 ,973 ,974 ,975 ,976 ,977 ,978 ,979 ,980 ,981 ,982 ,983 ,984 ,985 ,986 ,987 ,988 ,989 ,990 ,991 ,992 ,993 ,994 ,995 ,996 ,997 ,998 ,999 ,1000 ,1001 ,1002 ,1003 ,1004 ,1005 ,1006 ,1007 ,1008 ,1009 ,1010 ,1011 ,1012 ,1013 ,1014 ,1015 ,1016 ,1017 ,1018 ,1019 ,1020 ,1021 ,1022 ,1023 ,1024 ,1025 ,1026 ,1027 ,1028 ,1029 ,1030 ,1031 ,1032 ,1033 ,1034 ,1035 ,1036 ,1037 ,1038 ,1039 ,1040 ,1041 ,1042 ,1043 ,1044 ,1045 ,1046 ,1047 ,1048 ,1049 ,1050 ,1051 ,1052 ,1053 ,1054 ,1055 ,1056 ,1057 ,1058 ,1059 ,1060 ,1061 ,1062 ,1063 ,1064 ,1065 ,1066 ,1067 ,1068 ,1069 ,1070 ,1071 ,1072 ,1073 ,1074 ,1075 ,1076 ,1077 ,1078 ,1079
        ]
    }
# `/decks/id`
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
    - `PATCH` example body
    ```
    {
        "owner": "Master",
        "name": "Fiery Hail",
        "cards": [
            960 ,961 ,962 ,963 ,964 ,965 ,966 ,967 ,968 ,969 ,970 ,971 ,972 ,973 ,974 ,975 ,976 ,977 ,978 ,979 ,980 ,981 ,982 ,983 ,984 ,985 ,986 ,987 ,988 ,989 ,990 ,991 ,992 ,993 ,994 ,995 ,996 ,997 ,998 ,999 ,1000 ,1001 ,1002 ,1003 ,1004 ,1005 ,1006 ,1007 ,1008 ,1009 ,1010 ,1011 ,1012 ,1013 ,1014 ,1015 ,1016 ,1017 ,1018 ,1019 ,1020 ,1021 ,1022 ,1023 ,1024 ,1025 ,1026 ,1027 ,1028 ,1029 ,1030 ,1031 ,1032 ,1033 ,1034 ,1035 ,1036 ,1037 ,1038 ,1039 ,1040 ,1041 ,1042 ,1043 ,1044 ,1045 ,1046 ,1047 ,1048 ,1049 ,1050 ,1051 ,1052 ,1053 ,1054 ,1055 ,1056 ,1057 ,1058 ,1059 ,1060 ,1061 ,1062 ,1063 ,1064 ,1065 ,1066 ,1067 ,1068 ,1069 ,1070 ,1071 ,1072 ,1073 ,1074 ,1075 ,1076 ,1077 ,1078 ,1079
        ]
    }
  - `DELETE`
    - `204`
        - Success. Does not have body
    - `403`
      - Deck already used in tournament CAN NOT be deleted

# `/duels`
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
    - `POST` example body
  ```
  {
     "tournament": 2,
     "winner": 34,
     "decks": [37, 34]
  }
# `/duels/id`
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
    - `PATCH` example body
  ```
  {
     "tournament": 2,
     "winner": 2,
     "decks": [2, 5]
  }
- `DELETE`
    - `204`
        - Success. Does not have body


# `/tournaments`
- `GET`
    - `200`
        - Returns tournament list (default `GET` params: page = 1, pageSize = 10)
- `POST`
    - `201`
        - Success. Header Location has redirection to created resource
    - `400`
        - Missing required fields from body
    - `404`
        - Organiser not found
    - `POST` example body
  ```
  {
      "organiser": "Master",
      "location": "Antano Antanausko Gaming Lobby"
  }
# `/tournaments/id`
- `GET`
    - `200`
        - Returns duel with specific **id**
    - `404`
        - Resource not found
- `PATCH`
    - `204`
      - Success. Does not have body
    - `404`
      - Tournament not found
      - Organiser not found
    - `PATCH` example body
  ```
  {
      "organiser": "Master",
      "location": "Antano Antanausko Gaming Lobby"
  }
- `DELETE`
    - `204`
      - Success. Does not have body
    - `403`
      - Tournament with duels assigned to it CAN NOT be deleted