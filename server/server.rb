#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

APP_ROOT = Pathname.new(File.expand_path(__dir__)).freeze
APP_NAME = APP_ROOT.basename.to_s.freeze
VERSION = File.read("../VERSION").strip

require 'tzinfo'
ENV["TZ"] = "UTC"
TZ = TZInfo::Timezone.get('Europe/Rome')

env = ENV["RACK_ENV"] || "development"

ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../../Gemfile", __FILE__)
require "bundler/setup" if File.exist?(ENV["BUNDLE_GEMFILE"])
Bundler.require(:default, env)

require_relative 'app/initializers/settings'
require_relative 'app/boot'
require_relative 'app/boot_jobs'
require_glob APP_ROOT.to_s + '/app/routes/*.rb'

Logger.class_eval { alias :write :'<<' }

class Server < Roda
  plugin :environments
  plugin :public, gzip: true
  # plugin :caching
  # plugin :json, serializer: proc { |o| Oj.dump o, mode: :compat }
  plugin :early_hints
  include Logging

  configure :development do
    plugin :common_logger, Logging.logger 
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
    # use Rack::Cache, verbose: false
    # use Rack::Brotli, :if => lambda { |env, status, headers, body| headers["Content-Length"].to_i > 3600 }
    # IMPORTANTE: Uso deflate al posto di brotli perchè dai test mi e risultava piu performante
    use Rack::Deflater, :if => lambda { |env, status, headers, body| headers["Content-Length"].to_i > 3600 }
    # use Rack::RubyProf, :path => 'profile', :printers => [::RubyProf::CallTreePrinter]
    # set :public_folder, 'public'
  end

  route do |r|
    r.public

    r.root do
      response["Content-Type"] = "text/html"
      File.read(File.join(APP_ROOT, "public/index.html"))
    end

    r.on "api/v1" do
      
      r.run V1::Api

    end

  end

end

