class ApplicationController < Sinatra::Base
  @@my_app = {}
  def self.new(*) self < ApplicationController ? super : Rack::URLMap.new(@@my_app) end
  def self.map(url) @@my_app[url] = self end

  register Sinatra::Namespace

  configure(:production) do
    ip = Socket.ip_address_list.keep_if{ |intf| intf.ipv4_private? && (intf.ip_address =~ /^10/ || intf.ip_address =~ /^192/) }[0].ip_address
    p 'Start Production mode'
    p "ip: #{ip}:80"
    set :port, 80
    File.open('ip.txt', 'w') { |file| file.write(ip) }
    set :server_adress, ip
    db = Mongo::Client.new(['10.130.96.220:27018','10.130.96.220:27019', '10.130.96.144:27018'], database: 'transmission', write: {w: 0, j: false})
    set :db_remit, db[:remit]
    use Rack::Cache, verbose: false
    # use Rack::Deflater
    set :public_folder, 'public'
    use Rack::GzipStatic, urls: ['/css', '/js', '/fonts'], root: 'public'
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
    BetterErrors.application_root = File.expand_path('..', __FILE__)
    set :raise_errors, true
    set :server_adress, 'localhost'
    db = Mongo::Client.new(['127.0.0.1:27030'], database: 'transmission', write: {w: 0, j: false})
    set :db_remit, db[:remit]
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
  end

end

