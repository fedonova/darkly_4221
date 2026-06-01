Steps:

1. The file inclusion vulnerability allows an attacker to make the application include a file, which can lead to problems such as arbitrary code execution, denial of service, or sensitive information disclosure.

2. In our case we have an example of Local File Inclusion (LFI), which means including files that already exist on the same server. By using directory traversal sequences, we can access system directories and files.

Our example of the inclusion vulnerability is:

http://<our_IP_address>/index.php?page=../../../../../../../etc/passwd 

This means that, after several directory traversal steps, we reach the system file /etc/passwd. In a real‑world scenario, this could contribute to compromising user accounts, because /etc/passwd and related files may reveal information about system users and configuration.

In our educational case, the application is instrumented so that including /etc/passwd triggers a popup alert with the flag:

Congratulaton!! The flag is : b12c4b2cb8094750ae121a676269aa9e2872d07c06e429d25a63196ec1c8c1d0

3. How to avoid

- In the codebase, it is important to avoid using $_GET['page'] directly in include.

Examples of vulnerable patterns:

include $_GET['page'];
// or
include 'pages/' . $_GET['page'] . '.php';

- Instead, use a strict allow‑list of logical pages, for example:

$allowed_pages = [
    'home'    => 'pages/home.php',
    'about'   => 'pages/about.php',
    'contact' => 'pages/contact.php',
];