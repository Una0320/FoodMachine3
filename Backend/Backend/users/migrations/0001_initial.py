# Generated by Django 4.2.6 on 2023-11-21 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='user',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.TextField(blank=True, null=True)),
                ('userfeedback', models.TextField(blank=True, null=True)),
            ],
        ),
    ]
