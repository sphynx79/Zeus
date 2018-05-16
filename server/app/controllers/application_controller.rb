# frozen_string_literal: true

class ApplicationController < Sinatra::Base
  @@my_app = {}
  def self.new(*)
    self < ApplicationController ? super : Rack::URLMap.new(@@my_app)
  end

  def self.map(url)
    @@my_app[url] = self
  end

  register Sinatra::Namespace

  configure(:production) do
    ip = Socket.ip_address_list.keep_if { |intf| intf.ipv4_private? && (intf.ip_address =~ /^10/ || intf.ip_address =~ /^192/) }[0].ip_address
    p 'Start Production mode'
    p "ip: #{ip}:80"
    set :port, 80
    set :logging, false
    # File.open('ip.txt', 'w') { |file| file.write(ip) }
    set :server_adress, ip
    begin
      db = Mongo::Client.new(['10.130.96.220:27018', '10.130.96.220:27019', '10.130.96.144:27018'], database: 'transmission', write: { w: 0, j: true })
      # db = Mongo::Client.new(['127.0.0.1:27030'], database: 'transmission', write: { w: 0, j: false })
      db.database_names
      set :db, db
    rescue Mongo::Error::NoServerAvailable
      p 'Non riesco connetermi al server mongo db'
      exit!
    end
    use Rack::Cache, verbose: false
    use Rack::Deflater
    set :public_folder, 'public'
    use Rack::GzipStatic, urls: ['/css', '/js', '/fonts'], root: 'public', header_rules: [[:all, { 'Cache-Control' => 'public, max-age=3600' }]]
    # set :static_cache_control, [:public, :max_age => 3600]
    # use Rack::Static, :root => 'public'
  end

  configure(:development) do
    p 'Start Development mode'
    require 'sinatra/reloader'
    require 'ap'
    require 'pry'
    require 'better_errors'

    register Sinatra::Reloader

    use BetterErrors::Middleware
    use PryRescue::Rack
    BetterErrors.application_root = File.expand_path(__dir__)
    set :raise_errors, true
    set :server_adress, 'localhost'
    begin
      db = Mongo::Client.new(['127.0.0.1:27030'], database: 'transmission', write: { w: 0, j: false })
      db.database_names
      set :db, db
    rescue Mongo::Error::NoServerAvailable
      p 'Non riesco connetermi al server mongo db'
      exit!
    end
    # la seguente riga mi permette di usare yarn watch
    # poi lancio guard nella cartella client
    # e con livereload ogni modifica che faccio al mio codice
    # fai il refesh nel browser
    set :public_folder, '../client/dist'
  end

  configure do
    set :root, APP_ROOT.to_path
    set :server, :puma
    set :sessions, true
    set :session_secret, ENV['SESSION_KEY'] || 'lighthouselabssecret'
    set :views, 'app/views'
    set :remit_linee_collection, settings.db[:remit_linee]
    set :remit_centrali_collection, settings.db[:remit_centrali]
  end
end
