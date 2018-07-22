# frozen_string_literal: true

class Ampere < Roda
  plugin :environments
  plugin :multi_route
  plugin :public, gzip: true
  plugin :caching
  # plugin :early_hints
  plugin :halt
  # plugin :not_found do "Where did it go?" end
  # plugin :json, classes: [Array, Hash]

  Unreloader.require('./routes') {}

  configure :development do
    p "Start Development mode"
    p "ip: localhost:9292"
    p "ip db: #{Settings.database.adress.join(", ")}"
    p "#"*70
  end

  configure :production do
    ip = Socket.ip_address_list.keep_if { |intf| intf.ipv4_private? && (intf.ip_address =~ /^10/ || intf.ip_address =~ /^192/) }[0].ip_address
    p "Start Production mode"
    p "ip: #{ip}:80"
    p "ip db: #{Settings.database.adress.join(", ")}"
    p "#"*70
    use Rack::Cache, verbose: false
    # use Rack::Brotli, :if => lambda { |env, status, headers, body| headers["Content-Length"] > "360" }
    # IMPORTANTE: Uso deflate perchè brotli funziona solo con localhost o su https, con http tolgie brotli da Accept-Encoding: gzip, deflate
    # Ho provato anche a settare nella riquiesta ajax Accept-Encoding: gzip, deflate, br ma il browser mi restituisce un allert 
    use Rack::Deflater, :if => lambda { |env, status, headers, body| headers["Content-Length"] > "360" }
    # set :public_folder, 'public'

  end

  route do |r|
    r.public
    r.multi_route

    r.root do
      response['Content-Type'] = 'text/html'
      File.read(File.join(APP_ROOT, "public/index.html"))
    end
  end

end