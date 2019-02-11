tag 'Ampere'
threads 1, 8

require 'childprocess'

# Specifies the `port` that Puma will listen on to receive requests, default is 3000.
#
port 80

bind 'tcp://wpws07133656:443'
bind 'tcp://wpws07133656:80'

ssl_bind 'wpws07133656', '443', {
  key: "./config/wpws07133656.key",
  cert: "./config/wpws07133656.crt"
}


process = ChildProcess.build("caddy.exe", "-quiet", "-quic", "-conf", "CaddyfileProd_wpws07133656")
process.cwd = '.\config'
process.io.inherit!
process.leader = true
process.start
sleep 5
unless process.alive?
  p "Errore nell'avvio del server Caddy"
  exit
end

early_hints true
environment "production"
preload_app!


