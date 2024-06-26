const {NlpManager} = require('node-nlp')

const manager = new NlpManager({ languages: ['en'], forceNER: true });
// Adds the utterances and intents for the NLP
manager.addDocument('en', 'goodbye for now', 'greetings.bye');
manager.addDocument('en', 'bye bye take care', 'greetings.bye');
manager.addDocument('en', 'okay see you later', 'greetings.bye');
manager.addDocument('en', 'bye for now', 'greetings.bye');
manager.addDocument('en', 'i must go', 'greetings.bye');
manager.addDocument('en', 'farewell', 'greetings.bye');
manager.addDocument('en', 'until we meet again', 'greetings.bye');
manager.addDocument('en', 'take it easy', 'greetings.bye');
manager.addDocument('en', 'see you soon', 'greetings.bye');
manager.addDocument('en', 'catch you later', 'greetings.bye');
manager.addDocument('en', 'have a good one', 'greetings.bye');
manager.addDocument('en', 'good night', 'greetings.bye');
manager.addDocument('en', 'adios', 'greetings.bye');
manager.addDocument('en', 'later', 'greetings.bye');
manager.addDocument('en', 'bye now', 'greetings.bye');
manager.addDocument('en', 'hey there', 'greetings.hello');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'good morning', 'greetings.hello');
manager.addDocument('en', 'good afternoon', 'greetings.hello');
manager.addDocument('en', 'good evening', 'greetings.hello');
manager.addDocument('en', 'yo', 'greetings.hello');
manager.addDocument('en', 'what\'s up', 'greetings.hello');
manager.addDocument('en', 'hey', 'greetings.hello');
manager.addDocument('en', 'hi there', 'greetings.hello');
manager.addDocument('en', 'how\'s it going', 'greetings.hello');
manager.addDocument('en', 'how do you do', 'greetings.hello');
manager.addDocument('en', 'transfer funds from account xxxx to account yyyyy', 'transfer');
manager.addDocument('en', 'move money from xxxx to yyyyy', 'transfer');
manager.addDocument('en', 'give money to xxxx', 'transfer');
manager.addDocument('en', 'send money from xxxx to yyyyy', 'transfer');
manager.addDocument('en', 'transfer money between xxxx and yyyyy', 'transfer');
manager.addDocument('en', 'initiate transfer from xxxx to yyyyy', 'transfer');
manager.addDocument('en', 'execute transfer from xxxx to yyyyy', 'transfer');
manager.addDocument('en', 'move funds from account xxxx to account yyyyy', 'transfer');
manager.addDocument('en', 'transfer money from account xxxx to account yyyyy', 'transfer');
manager.addDocument('en', 'send funds from account xxxx to account yyyyy', 'transfer');
manager.addDocument('en', 'deposit funds into account yyyyy', 'deposit');
manager.addDocument('en', 'add money to account yyyyy', 'deposit');
manager.addDocument('en', 'put money into account yyyyy', 'deposit');
manager.addDocument('en', 'make a deposit to account yyyyy', 'deposit');
manager.addDocument('en', 'deposit cash to account yyyyy', 'deposit');
manager.addDocument('en', 'deposit money in account yyyyy', 'deposit');
manager.addDocument('en', 'give money to my account', 'deposit');
manager.addDocument('en', 'add funds to account yyyyy', 'deposit');
manager.addDocument('en', 'deposit amount into account yyyyy', 'deposit');
manager.addDocument('en', 'deposit cash into account yyyyy', 'deposit');
manager.addDocument('en', 'withdraw funds from account xxxx', 'withdraw');
manager.addDocument('en', 'take out money from account xxxx', 'withdraw');
manager.addDocument('en', 'withdraw cash from account xxxx', 'withdraw');
manager.addDocument('en', 'get money from account xxxx', 'withdraw');
manager.addDocument('en', 'make a withdrawal from account xxxx', 'withdraw');
manager.addDocument('en', 'pull out funds from account xxxx', 'withdraw');
manager.addDocument('en', 'withdraw amount from account xxxx', 'withdraw');
manager.addDocument('en', 'withdraw cash from my account xxxx', 'withdraw');
manager.addDocument('en', 'take funds from account xxxx', 'withdraw');
manager.addDocument('en', 'check account balance', 'checkbalance');
manager.addDocument('en', 'view balance', 'checkbalance');
manager.addDocument('en', 'see account balance', 'checkbalance');
manager.addDocument('en', 'get account balance', 'checkbalance');
manager.addDocument('en', 'show me the balance', 'checkbalance');
manager.addDocument('en', 'balance inquiry', 'checkbalance');
manager.addDocument('en', 'check my balance', 'checkbalance');
manager.addDocument('en', 'account balance check', 'checkbalance');
manager.addDocument('en', 'current balance', 'checkbalance');
manager.addDocument('en', 'log out', 'logout');
manager.addDocument('en', 'sign out', 'logout');
manager.addDocument('en', 'log me out', 'logout');
manager.addDocument('en', 'please log out', 'logout');
manager.addDocument('en', 'I want to sign out', 'logout');
manager.addDocument('en', 'sign me out', 'logout');
manager.addDocument('en', 'please sign out', 'logout');
manager.addDocument('en', 'I need to log out', 'logout');
manager.addDocument('en', 'I need to sign out', 'logout');
manager.addDocument('en', 'log off', 'logout');
manager.addDocument('en', 'I want to log off', 'logout');
manager.addDocument('en', 'please log off', 'logout');
manager.addDocument('en', 'sign off', 'logout');
manager.addDocument('en', 'I want to sign off', 'logout');
manager.addDocument('en', 'please sign off', 'logout');

// Train also the NLG
manager.addAnswer('en', 'greetings.bye', 'tocounter');
manager.addAnswer('en', 'greetings.hello', 'Hi! Welcome to our banking service. How may I help you?');
manager.addAnswer('en', 'greetings.hello', 'Hi there! I’m your virtual banking assistant. What can I do for you today?');
manager.addAnswer('en', 'greetings.hello', 'Hey! I’m here to help you with your banking needs. What can I assist you with?');
manager.addAnswer('en', 'greetings.hello', 'Hello! It’s great to see you. How can I assist you with your banking today?');
manager.addAnswer('en', 'greetings.hello', 'Hi there! Need assistance with anything banking-related?');
manager.addAnswer('en', 'greetings.hello', 'Greetings! How can I assist you with your banking matters today?');
manager.addAnswer('en', 'greetings.hello', 'Hello! I’m here to make your banking experience smooth. How can I assist you?');
manager.addAnswer('en', 'transfer', 'transfer');
manager.addAnswer('en', 'deposit', 'deposit');
manager.addAnswer('en', 'withdraw', 'withdraw');
manager.addAnswer('en', 'checkbalance', 'checkbalance');
manager.addAnswer('en', 'logout', 'logout');

async function trainandExport(){
    await manager.train();
    manager.save();
}

trainandExport().then(()=>{
    console.log("trained and exported");
})

module.exports = manager
