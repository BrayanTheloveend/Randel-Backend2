const nodemailer = require('nodemailer');
const fs = require('fs')
const handlebars = require('handlebars')


// Charger et compiler le template Handlebars
const template = handlebars.compile(fs.readFileSync('./File/TemplateMail/index.html', 'utf-8').toString())
const templateUserMail = handlebars.compile(fs.readFileSync('./File/TemplateMail/email.html', 'utf-8').toString())
const templateConfirm = handlebars.compile(fs.readFileSync('./File/TemplateMail/confirm.html', 'utf-8').toString())
const templateAuth = handlebars.compile(fs.readFileSync('./File/TemplateMail/auth.html', 'utf-8').toString())
const templatePayout = handlebars.compile(fs.readFileSync('./File/TemplateMail/payout.html', 'utf-8').toString())

handlebars.registerHelper('multiply', function(a, b) {
  return a * b;
});
const htmlToSend = (data)=> {
  return template(data)
}
const htmlToSenduserMail = (data)=> {
  return templateUserMail(data)
}
const htmlToSendconfirm = (data)=> {
  return templateConfirm(data)

}
const htmlToSendAuth = (data)=> {
  return templateAuth(data)
}

const htmlToSendPayout = (data)=> {
  return templatePayout(data)
}

// Fonction d'envoi d'email avec pièce jointe
async function sendMailWithAttachment(destEmail, title, userData) {
    // Créez un transporteur SMTP (exemple avec Gmail, à adapter selon votre config)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER, // Votre email
            pass: process.env.MAIL_PASS  // Votre mot de passe ou app password
        }
    });

    // Définir le contenu du mail
    let mailOptions = {
        from: process.env.MAIL_USER,
        to: destEmail,
        subject: title,
        // text: `Bonjour ${userData.name},\n\nVeuillez trouver le fichier en pièce jointe.\n\nCordialement.`,
        html: htmlToSend(userData),
    };

    // Envoyer le mail
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé: ' + info.response);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
}


async function sendMailCustomerTransaction(destEmail, title, userData) {
    // Créez un transporteur SMTP (exemple avec Gmail, à adapter selon votre config)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER, // Votre email
            pass: process.env.MAIL_PASS  // Votre mot de passe ou app password
        }
    });

    // Définir le contenu du mail
    let mailOptions = {
        from: process.env.MAIL_USER,
        to: destEmail,
        subject: title,
        // text: `Bonjour ${userData.name},\n\nVeuillez trouver le fichier en pièce jointe.\n\nCordialement.`,
        html: htmlToSenduserMail(userData),
    };

    // Envoyer le mail
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé: ' + info.response);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
}

async function sendMailConfirmTransaction(destEmail, title, userData) {
    // Créez un transporteur SMTP (exemple avec Gmail, à adapter selon votre config)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER, // Votre email
            pass: process.env.MAIL_PASS  // Votre mot de passe ou app password
        }
    });

    // Définir le contenu du mail
    let mailOptions = {
        from: process.env.MAIL_USER,
        to: destEmail,
        subject: title,
        // text: `Bonjour ${userData.name},\n\nVeuillez trouver le fichier en pièce jointe.\n\nCordialement.`,
        html: htmlToSendconfirm(userData),
    };

    // Envoyer le mail
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé: ' + info.response);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
}

async function sendMailAuth(destEmail, title, userData) {
    // Créez un transporteur SMTP (exemple avec Gmail, à adapter selon votre config)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER, // Votre email
            pass: process.env.MAIL_PASS  // Votre mot de passe ou app password
        }
    });

    // Définir le contenu du mail
    let mailOptions = {
        from: process.env.MAIL_USER,
        to: destEmail,
        subject: title,
        // text: `Bonjour ${userData.name},\n\nVeuillez trouver le fichier en pièce jointe.\n\nCordialement.`,
        html: htmlToSendAuth(userData),
    };

    // Envoyer le mail
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé: ' + info.response);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
}

async function sendMailPayout(destEmail, title, userData) {
    // Créez un transporteur SMTP (exemple avec Gmail, à adapter selon votre config)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER, // Votre email
            pass: process.env.MAIL_PASS  // Votre mot de passe ou app password
        }
    });

    // Définir le contenu du mail
    let mailOptions = {
        from: process.env.MAIL_USER,
        to: destEmail,
        subject: title,
        // text: `Bonjour ${userData.name},\n\nVeuillez trouver le fichier en pièce jointe.\n\nCordialement.`,
        html: htmlToSendPayout(userData),
    };

    // Envoyer le mail
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé: ' + info.response);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
}



// Exemple d'utilisation :
// sendMailWithAttachment('destinataire@email.com', './chemin/vers/fichier.pdf', {name: 'Brayan'});

module.exports = { sendMailWithAttachment, sendMailCustomerTransaction, sendMailConfirmTransaction, sendMailAuth, sendMailPayout };