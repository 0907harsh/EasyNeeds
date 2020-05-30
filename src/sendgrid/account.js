


const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_API_KEY);

const sendWelcomeEmail=async(email,username)=>{
    sgMail.send({
        to:email,
        from: '2000harshgupta@gmail.com',
        subject:'Thanks for joining :)',
        text: `Welcome to the app.${username},Let me know your hopes wth this application`, 
    })
}

const DeleteAccounEmail=async(email,name)=>{
    sgMail.send({
        to:email,
        from: '2000harshgupta@gmail.com',
        subject:'It\'s said that you left  :)',
        text: `it would be nice of you to give us feedback to to why u left.Please share your hopes wth this application ${name}`    
    })
}

module.exports={
    sendWelcomeEmail,
    DeleteAccounEmail
}