function handleForm() {
    var fname, lname, email, message;
    fname = document.forms["contact"]["fname"].value;
    lname = document.forms["contact"]["lname"].value;
    email = document.forms["contact"]["email"].value;
    message = document.forms["contact"]["message"].value;
    window.alert(`Contactee:\nFirst name: ${fname}\nLast name: ${lname}\nEmail: ${email}\nMessage: ${message}`);
}