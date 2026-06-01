Steps:

1. XSS (Cross-Site-Scripting) attack is the type of attack in which the malicious script is injected in code base of the application. The most common way of injection is realiased as a user inputs in a fields such as "comments", "feedback", etc.
In our case we have such a page in /?page=feedback.

2. In a presented field we can enter the name and the messages. We can consider that we face to en example of Stored XSS Attack (the term from OWASP documentations). It means that th information typed into a boxes on a webpage is stored in database (that is confirmed after the webpage reloads - we got the content from the database back to the webpage representaion).

3. So we have a possibility to write some script, instead of text into the commentary box, and it will be executed after request to the stored information.

4. The first test will be to ented some simple script with an HTML tags into commentary box:

<script>test1</script>

We get:

<td>Name : test1</td>
<td>Comment : test1</td> (via DevTools)

As we can see, the input in a message field is sanitized.

5. Test2:

Then we try to exploit it other way, using the same string as input in a name field:

<script>test2</script>

To do so, we should extend the name field from 10 symbols to 10000 by changing its maxlength parameter.

And we can see the same result:

We get:

<td>Name : test2</td>
<td>Comment : test2</td> (via DevTools)

So, we cat go to the conclusion, that the backend of this application eliminates everything, that is inside the tags, and we should find some other way for hacking.

6. After many attempts of different ways to exploit this page, we achieved 2 results that looked like something like a success:

    - the first one - we got a succesful injection after typing this string in a name field: <img src="x" onerror=alert(test10)> <--- We use here an exemple of using attributes.
    we got here:
    <td>"Name : " <img src="x" onerror="alert(test10)"></td>
    <td>Comment : test10</td> (via DevTools)
    It could be the perfect example of exploit, if it gave us the flag, but it've never happend.

