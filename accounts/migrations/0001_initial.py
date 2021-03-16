# Generated by Django 3.0.5 on 2021-03-12 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=50, unique=True)),
                ('fullname', models.CharField(max_length=50)),
                ('password', models.CharField(max_length=70)),
                ('role', models.CharField(max_length=1)),
            ],
        ),
    ]
