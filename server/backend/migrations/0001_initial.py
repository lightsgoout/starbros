# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'StarSystem'
        db.create_table(u'backend_starsystem', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('player', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['accounts.User'])),
            ('planets_count', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
        ))
        db.send_create_signal(u'backend', ['StarSystem'])

        # Adding model 'Planet'
        db.create_table(u'backend_planet', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('star', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['backend.StarSystem'])),
            ('size', self.gf('django.db.models.fields.SmallIntegerField')()),
            ('speed', self.gf('django.db.models.fields.FloatField')()),
            ('richness', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
            ('order', self.gf('django.db.models.fields.PositiveSmallIntegerField')()),
        ))
        db.send_create_signal(u'backend', ['Planet'])

        # Adding unique constraint on 'Planet', fields ['star', 'order']
        db.create_unique(u'backend_planet', ['star_id', 'order'])

        # Adding model 'Game'
        db.create_table(u'backend_game', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created_at', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('finished_at', self.gf('django.db.models.fields.DateTimeField')(null=True, blank=True)),
            ('left_star', self.gf('django.db.models.fields.related.ForeignKey')(related_name='left_star', to=orm['backend.StarSystem'])),
            ('right_star', self.gf('django.db.models.fields.related.ForeignKey')(related_name='right_star', to=orm['backend.StarSystem'])),
        ))
        db.send_create_signal(u'backend', ['Game'])


    def backwards(self, orm):
        # Removing unique constraint on 'Planet', fields ['star', 'order']
        db.delete_unique(u'backend_planet', ['star_id', 'order'])

        # Deleting model 'StarSystem'
        db.delete_table(u'backend_starsystem')

        # Deleting model 'Planet'
        db.delete_table(u'backend_planet')

        # Deleting model 'Game'
        db.delete_table(u'backend_game')


    models = {
        u'accounts.user': {
            'Meta': {'object_name': 'User'},
            'email': ('django.db.models.fields.EmailField', [], {'unique': 'True', 'max_length': '75'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '16'})
        },
        u'backend.game': {
            'Meta': {'object_name': 'Game'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'finished_at': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'left_star': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'left_star'", 'to': u"orm['backend.StarSystem']"}),
            'right_star': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'right_star'", 'to': u"orm['backend.StarSystem']"})
        },
        u'backend.planet': {
            'Meta': {'unique_together': "(('star', 'order'),)", 'object_name': 'Planet'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'order': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'richness': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'size': ('django.db.models.fields.SmallIntegerField', [], {}),
            'speed': ('django.db.models.fields.FloatField', [], {}),
            'star': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['backend.StarSystem']"})
        },
        u'backend.starsystem': {
            'Meta': {'object_name': 'StarSystem'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'planets_count': ('django.db.models.fields.PositiveSmallIntegerField', [], {}),
            'player': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['accounts.User']"})
        }
    }

    complete_apps = ['backend']