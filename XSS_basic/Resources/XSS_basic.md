Steps:

1. What is XSS and where we test it

XSS (Cross‑Site Scripting) is an attack where a malicious script is injected into a web application so that it runs in the victim’s browser. The most common injection points are user inputs like “comments”, “feedback” and similar forms.

In our case, we have such a page at /?page=feedback, which contains a guestbook‑style form.

2. Stored XSS context

On this page we can enter a Name and a Message. After submitting the form and reloading the page, our entry is still there in the guestbook. This means the values are stored on the server (for example, in a database or file) and then rendered again, which matches the OWASP definition of stored XSS (persistent XSS).

3. Idea: inject script instead of text

The basic idea is that instead of normal text we could try to inject a script into one of these fields. If this script is stored and later inserted into the page without proper encoding, the browser will execute it when someone views the feedback page. This is exactly how a stored XSS exploit would work in this context.

4. First we tried a simple script in the Message (comment) box:

<script>test1</script>

In DevTools we saw:

<td>Name : test1</td>
<td>Comment : test1</td>

As we can see, the input in the Message field is sanitized: the <script> tags are removed and only the inner text test1 is stored and displayed.

5. Test2:

Then we try to exploit it another way, using the same string as input in the Name field:

<script>test2</script>

To do so, we temporarily extended the Name field from 10 to 10000 characters by changing its maxlength attribute.

We can see the same result:

<td>Name : test2</td>
<td>Comment : test2</td> (via DevTools)

So, we can conclude that the backend of this application removes the <script> tags and keeps only the inner text, and we need to find another way to exploit this page.

6. After many attempts with different ways to exploit this page, we achieved two results that looked like a kind of success:

    - First result:
    We got a successful injection after typing the following string in the Name field:
    
    <img src="x" onerror=alert(test10)>

    (Here we use an example of an attribute‑based payload: onerror runs JavaScript when the image fails to load.)
    
    In DevTools we saw:
  
    <td>"Name : " <img src="x" onerror="alert(test10)"></td>
    <td>Comment : test10</td>

    This could be a perfect example of an exploit, because the browser executes our alert('test10'), but it never gave us the flag.

    - Second result.
    We also got a popup alert when we inserted this string in the Name field:

    <img src=x onerror=alert(1)>

    In DevTools we can see the same structure:

    <td>"Name : " <img src="x" onerror="alert(1)"></td>
    <td>Comment : test11</td> (via DevTools)

These two examples prove that inserting a script (via an image tag with an onerror attribute) is possible and that a stored XSS vulnerability exists in the Name field, but these payloads still did not give us any flags in this project version.

7. The solution was found accidentally after we just typed the letter a in the comment box. We could not find a full explanation of this behavior, but we discovered another keyword: typing the word script also gave us the flag:

0fbb54bbf7d099713ca4be297e1bc7da0173d8b3c21c1811b916a3a86652724e

It seems that this task was designed so that the backend checks the comment value and reveals the flag when it matches specific patterns (for example, exactly a or containing the word script). This looks more like a project‑specific trigger than real XSS code execution, because the comment output is sanitized and our <script> tags do not actually run in the browser.



