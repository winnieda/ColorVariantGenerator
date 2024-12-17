import boto3
from botocore.exceptions import ClientError

# Function to send an email
def send_email():
    # Configure these values
    sender_email = "no-reply@mail.colorvariantgenerator.com"  # Your custom mail-from address
    recipient_email = "colorvariantgenerator@gmail.com"  # Replace with the email to test
    subject = "Test Email from AWS SES"
    body_text = "This is a test email sent using Amazon SES and Python."

    # Initialize the SES client
    ses_client = boto3.client('ses', region_name='us-east-2')  # Replace with your SES region

    try:
        # Send the email
        response = ses_client.send_email(
            Source=sender_email,
            Destination={
                'ToAddresses': [recipient_email],
            },
            Message={
                'Subject': {
                    'Data': subject,
                },
                'Body': {
                    'Text': {
                        'Data': body_text,
                    },
                },
            },
        )
        print("Email sent successfully! Message ID:", response['MessageId'])
    except ClientError as e:
        print("Error sending email:", e.response['Error']['Message'])

# Call the function
send_email()
