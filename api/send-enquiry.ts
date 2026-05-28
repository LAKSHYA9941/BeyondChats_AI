import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    
    const textContent = [
      `New Trip Inquiry`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      data.email ? `Email: ${data.email}` : "",
      `Destination: ${data.destination}`,
      data.travelDate ? `Travel date: ${data.travelDate}` : "",
      data.pax ? `Travellers: ${data.pax}` : "",
      data.service ? `Service: ${data.service}` : "",
      data.notes ? `Notes: ${data.notes}` : "",
    ].filter(Boolean).join("\n");

    const { data: emailData, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Update this to your verified domain later if you have one, or keep for testing
      to: ['atfacilities1999@gmail.com', 'slaki6462@gmail.com'],
      subject: `New Trip Inquiry from ${data.name}`,
      text: textContent,
    });

    if (error) {
      console.error('Error sending email:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data: emailData });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
