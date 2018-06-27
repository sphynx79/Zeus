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
    use Rack::CommonLogger, LOGGER
  end

  configure :production do
    # LOGGER.info("Sono in produzione")
    ip = Socket.ip_address_list.keep_if { |intf| intf.ipv4_private? && (intf.ip_address =~ /^10/ || intf.ip_address =~ /^192/) }[0].ip_address
    p "Start Production mode"
    p "ip: #{ip}:80"
    p "ip db: #{Settings.database.adress.join(", ")}"
    p "#"*70
    use Rack::Cache, verbose: false
    use Rack::Brotli, :if => lambda { |env, status, headers, body| headers["Content-Length"] > "360" }
    # LOGGER.level = Logger::FATAL
    # use Rack::Cache, verbose: false
    # use Rack::Deflater
    # set :public_folder, 'public'
    # use Rack::GzipStatic, urls: ['/css', '/js', '/fonts'], root: 'public', header_rules: [[:all, { 'Cache-Control' => 'public, max-age=3600' }]]

  end

  route do |r|

    r.public
    r.multi_route

    r.root do
      response['Content-Type'] = 'text/html'
      File.read(File.join(APP_ROOT, "public/index.html"))
    end
  end

  def self.root
    Pathname.new(File.expand_path('../..', __FILE__))
  end

  def self.logger
    LOGGER
  end
end
