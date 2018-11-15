tag 'Ampere'
threads 0, 16

# Specifies the `port` that Puma will listen on to receive requests, default is 3000.
#
port 80

early_hints true
# Specifies the `environment` that Puma will run in.
#
environment "production"
preload_app!

