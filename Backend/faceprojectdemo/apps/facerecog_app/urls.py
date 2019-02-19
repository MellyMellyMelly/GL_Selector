from django.conf.urls import url
from . import views           # This line is new!
urlpatterns = [
    url(r'^check$', views.check),
    url(r'^capture$', views.capture),
    url(r'^register$', views.register),
    url(r'^login$', views.login),
    url(r'^logout$', views.logout),
]