const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' });

// Environment variables
const TABLE_NAME = process.env.CONTACT_TABLE_NAME || 'anidha-contact-messages';
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'contact@anidha.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@anidha.com';

/**
 * Contact Form Handler
 * Stores messages in DynamoDB and sends email notification via SES
 */
exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;

    try {
        body = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ error: 'Invalid JSON' })
        };
    }

    // Validate required fields
    const { firstName, lastName, email, message } = body;

    if (!firstName || !lastName || !email || !message) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Missing required fields' })
        };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Invalid email format' })
        };
    }

    // Generate message ID
    const messageId = `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const contactData = {
        id: messageId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        company: body.company ? body.company.trim() : null,
        service: body.service || null,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        source: body.source || 'contact form',
        status: 'new'
    };

    try {
        // Store in DynamoDB
        const dbParams = {
            TableName: TABLE_NAME,
            Item: contactData
        };

        await dynamoDB.put(dbParams).promise();
        console.log('Message stored in DynamoDB:', messageId);

        // Send email notification
        const emailParams = {
            Source: SENDER_EMAIL,
            Destination: {
                ToAddresses: [RECIPIENT_EMAIL]
            },
            Message: {
                Subject: {
                    Data: `New Contact Form Submission: ${firstName} ${lastName}`,
                    Charset: 'UTF-8'
                },
                Body: {
                    Html: {
                        Data: `
                            <h2>New Contact Form Submission</h2>
                            <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
                            <p><strong>Email:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
                            ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
                            ${contactData.service ? `<p><strong>Service Interest:</strong> ${contactData.service}</p>` : ''}
                            <p><strong>Message:</strong></p>
                            <p style="white-space: pre-wrap;">${contactData.message}</p>
                            <p><strong>Submitted:</strong> ${contactData.timestamp}</p>
                            <p><strong>Message ID:</strong> ${messageId}</p>
                        `,
                        Charset: 'UTF-8'
                    }
                }
            }
        };

        await ses.sendEmail(emailParams).promise();
        console.log('Email notification sent');

        // Send confirmation email to sender
        const confirmationParams = {
            Source: SENDER_EMAIL,
            Destination: {
                ToAddresses: [contactData.email]
            },
            Message: {
                Subject: {
                    Data: 'Thank you for contacting Anidha Tech Solutions',
                    Charset: 'UTF-8'
                },
                Body: {
                    Html: {
                        Data: `
                            <h2>Thank you for contacting us!</h2>
                            <p>Hi ${contactData.firstName},</p>
                            <p>Thank you for reaching out to Anidha Tech Solutions LLP. We have received your message and will get back to you within 24 hours.</p>
                            <p>Here's a summary of your inquiry:</p>
                            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${contactData.message}</p>
                            <p>If you need immediate assistance, please contact us directly at <a href="mailto:${RECIPIENT_EMAIL}">${RECIPIENT_EMAIL}</a>.</p>
                            <p>Best regards,<br>Anidha Tech Solutions Team</p>
                        `,
                        Charset: 'UTF-8'
                    }
                }
            }
        };

        await ses.sendEmail(confirmationParams).promise();
        console.log('Confirmation email sent');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: 'Your message has been sent successfully. We will be in touch soon!',
                id: messageId
            })
        };

    } catch (error) {
        console.error('Error processing contact form:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: 'We apologize, but something went wrong. Please try again or contact us directly via email.'
            })
        };
    }
};
