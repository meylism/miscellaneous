/*
-Mocking is very useful while you are doing testing stuff.
-For example, our app sends welcome or goodbye emails when user
creates or deletes his/her account.
-Testing will use your free email plan in vain, so we are here to
prevent this.
-We will mock @sendgrid/mail module by providing functions that our
program needs to run 
*/
module.exports = {
    setApiKey() {

    },
    send() {

    }
}

//We modified only 2 functions. Because they are the only ones that our program needs