# Generated by Django 4.2.6 on 2023-11-21 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('boxes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='growthOUT',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField()),
                ('watertemp', models.FloatField(blank=True, null=True)),
                ('waterlevel', models.FloatField(blank=True, null=True)),
                ('airtemp', models.FloatField(blank=True, null=True)),
                ('humidity', models.FloatField(blank=True, null=True)),
                ('oxygen', models.FloatField(blank=True, null=True)),
                ('co2', models.FloatField(blank=True, null=True)),
                ('ec', models.FloatField(blank=True, null=True)),
                ('ph', models.FloatField(blank=True, null=True)),
                ('boxid', models.ManyToManyField(null=True, related_name='whichboxes', to='boxes.box')),
            ],
        ),
    ]
