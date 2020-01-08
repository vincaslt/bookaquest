import { send, setApiKey } from '@sendgrid/mail';

export function initEmail() {
  if (process.env.SENDGRID_API_KEY) {
    setApiKey(process.env.SENDGRID_API_KEY);
  }
}

export function sendBookingEmail() {
  const msg = {
    to: 'vincaslt@gmail.com',
    from: 'vincas.stonys@bookaquest.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  };

  return send(msg);
}
