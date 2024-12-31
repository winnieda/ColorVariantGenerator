import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Function to send an email
def send_email():
    # Configure these values
    sender_email = "no-reply@mail.colorvariantgenerator.com"  # Your custom mail-from address
    recipient_email = "colorvariantgenerator@gmail.com"  # Replace with the email to test
    subject = "Test Email from AWS SES"
    body_text = "This is a test email sent using Amazon SES and Python."

    # Retrieve AWS credentials and region from environment variables
    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    aws_region = os.getenv('AWS_REGION')

    # Initialize the SES client
    ses_client = boto3.client(
        'ses',
        region_name=aws_region,
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )

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
if __name__ == "__main__":
    send_email()
