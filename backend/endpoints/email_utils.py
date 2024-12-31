import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

def send_email(recipient_email, subject, body_text, sender_email="no-reply@mail.colorvariantgenerator.com"):
    """
    Sends an email using AWS SES with credentials from environment variables.
    """
    # Retrieve AWS credentials and region from environment variables
    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    aws_region = os.getenv('AWS_REGION', 'us-east-2')  # Default to 'us-east-2' if not set

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
        return True
    except ClientError as e:
        print("Error sending email:", e.response['Error']['Message'])
        return False
