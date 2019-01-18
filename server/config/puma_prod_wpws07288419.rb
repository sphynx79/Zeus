tag 'Ampere'
threads 1, 8

require 'childprocess'

# Specifies the `port` that Puma will listen on to receive requests, default is 3000.
#
port 80

bind 'tcp://wpws07288419:443'
bind 'tcp://wpws07288419:80'

ssl_bind 'wpws07288419', '443', {
  key: "./config/wpws07288419.key",
  cert: "./config/wpws07288419.crt"
}


process = ChildProcess.build("caddy.exe", "-quic", "-conf", "CaddyfileProd_wpws07288419")
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


