import smtplib
from email.mime.text import MIMEText
import certifi
import ssl

context = ssl.create_default_context(cafile=certifi.where())
msg = MIMEText("Test email")
msg['Subject'] = "Test"
msg['From'] = "no-reply@datasyncsvc.com"
msg['To'] = "oglesjovy@gmail.com"

try:
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls(context=context)
        server.login("markirving012@gmail.com", "zoqyvsrzitekntyr")
        server.send_message(msg)
    print("Email sent successfully")
except Exception as e:
    print(f"Failed: {str(e)}")

print(certifi.where())