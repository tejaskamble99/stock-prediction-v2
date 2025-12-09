from django.db import models

# Create your models here.
class Contact(models.Model):
    # contact_id=models.AutoField(primary_key=True)
    name=models.CharField(max_length=50)
    email=models.EmailField()
    desc=models.TextField(max_length=500)
    phonenumber=models.IntegerField()

    def __str__(self):
        # It's best practice to return the name or email, not just the ID, 
        # so you can easily identify the record in the Admin.
        return self.name 
        
    # Optional: If you really want to return the ID as a string, use:
    # def __str__(self):
    #     return str(self.id)