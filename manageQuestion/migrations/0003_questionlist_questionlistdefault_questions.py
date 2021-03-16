# Generated by Django 3.0.5 on 2021-03-13 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('manageQuestion', '0002_auto_20210313_1519'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuestionList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.IntegerField()),
                ('listName', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='QuestionListDefault',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('listName', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Questions',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qlistId', models.IntegerField()),
                ('question', models.CharField(max_length=100)),
                ('qType', models.CharField(max_length=1)),
                ('qStatus', models.CharField(max_length=1)),
            ],
        ),
    ]
