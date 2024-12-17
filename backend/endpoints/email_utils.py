import boto3
from botocore.exceptions import ClientError

def send_email(sender_email, recipient_email, subject, body_text, region="us-east-2"):
    """
    Sends an email using AWS SES.
    """
    ses_client = boto3.client('ses', region_name=region)
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
