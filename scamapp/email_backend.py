# scamapp/email_backend.py

import smtplib
import ssl
import certifi
from django.core.mail.backends.base import BaseEmailBackend
from django.core.mail import EmailMessage
from django.conf import settings

class CustomSMTPEmailBackend(BaseEmailBackend):
    def __init__(self, host=None, port=None, username=None, password=None,
                 use_tls=None, fail_silently=False, timeout=None, **kwargs):
        super().__init__(fail_silently=fail_silently)
        self.host = host or settings.EMAIL_HOST
        self.port = port or settings.EMAIL_PORT
        self.username = username or settings.EMAIL_USER
        self.password = password or settings.EMAIL_PASSWORD
        self.use_tls = use_tls if use_tls is not None else settings.EMAIL_USE_TLS
        self.timeout = timeout or getattr(settings, 'EMAIL_TIMEOUT', None)  # Fixed: Use getattr
        self.connection = None

    def open(self):
        if self.connection:
            return False
        try:
            self.connection = smtplib.SMTP(self.host, self.port, timeout=self.timeout)
            if self.use_tls:
                context = ssl.create_default_context(cafile=certifi.where())
                self.connection.starttls(context=context)
            if self.username and self.password:
                self.connection.login(self.username, self.password)
            return True
        except Exception:
            if not self.fail_silently:
                raise
            return False

    def close(self):
        if self.connection is None:
            return
        try:
            self.connection.quit()
        except Exception:
            if self.fail_silently:
                return
            raise
        finally:
            self.connection = None

    def send_messages(self, email_messages):
        if not email_messages:
            return 0
        if not self.open():
            return 0
        num_sent = 0
        for email_message in email_messages:
            try:
                sent = self._send(email_message)
                if sent:
                    num_sent += 1
            except Exception:
                if not self.fail_silently:
                    raise
        self.close()
        return num_sent

    def _send(self, email_message):
        if not email_message.recipients():
            return False
        msg = email_message.message()
        try:
            self.connection.sendmail(
                email_message.from_email,
                email_message.recipients(),
                msg.as_string()
            )
            return True
        except Exception:
            if not self.fail_silently:
                raise
            return False