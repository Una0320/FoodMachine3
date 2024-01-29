# Generated by Django 4.2.6 on 2023-11-21 15:32

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
        ('categories', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='box',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('boxname', models.TextField(blank=True, null=True)),
                ('boximag', models.ImageField(blank=True, null=True, upload_to='image/')),
                ('plant', models.ManyToManyField(blank=True, null=True, related_name='which_plant', to='categories.category')),
                ('users', models.ManyToManyField(blank=True, default='root_test', null=True, related_name='used_by_users', to='users.user')),
            ],
        ),
    ]