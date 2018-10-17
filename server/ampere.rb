#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

class Ampere < Roda
  plugin :environments
  plugin :multi_route
  plugin :optimized_string_matchers
  plugin :public, gzip: true
  plugin :caching
  plugin :halt
  plugin :json, serializer: proc { |o| Oj.dump o, mode: :compat }
  plugin :not_found do |r|
   {'error'=> "Api #{r.path} non trovata"}
  end
  # plugin :early_hints

  configure :development do
    p "#" * 80
    p "Start Development mode"
    p "Version: #{VERSION}"
    p "ip: localhost:9292"
    p "ip db: #{Settings.database.adress.join(", ")}"
    p "#" * 80
  end

  configure :production do
    ip = Socket.ip_address_list.keep_if { |intf| intf.ipv4_private? && (intf.ip_address =~ /^10/ || intf.ip_address =~ /^192/) }[0].ip_address
    p "#" * 80
    p "Start Production mode"
    p "Version: #{VERSION}"
    p "ip: #{ip}:80"
    p "ip db: #{Settings.database.adress.join(", ")}"
    p "#" * 80
    use Rack::Cache, verbose: false
    # use Rack::Brotli, :if => lambda { |env, status, headers, body| headers["Content-Length"] > "360" }
    # IMPORTANTE: Uso deflate perchè brotli funziona solo con localhost o su https, con http toglie brotli da Accept-Encoding: gzip, deflate
    # Ho provato anche a settare nella richiesta ajax Accept-Encoding: gzip, deflate, br ma il browser mi restituisce un allert
    use Rack::Deflater, :if => lambda { |env, status, headers, body| headers["Content-Length"].to_i > 3600 }
    # set :public_folder, 'public'

  end

  route do |r|
    r.public

    r.root do
      response["Content-Type"] = "text/html"
      File.read(File.join(APP_ROOT, "public/index.html"))
    end

    r.on "api/v1" do
      response["Content-Type"] = "application/json"
      response["Access-Control-Allow-Headers"] = "*"
      response["Access-Control-Allow-Origin"] = "*"
      response["Access-Control-Allow-Methods"] = "POST, PUT, DELETE, GET, OPTIONS"

      r.multi_route("api/v1")

    end


  end
end

