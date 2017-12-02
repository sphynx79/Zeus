class ApplicationController < Sinatra::Base
  @@my_app = {}
  def self.new(*) self < ApplicationController ? super : Rack::URLMap.new(@@my_app) end
  def self.map(url) @@my_app[url] = self end

  register Sinatra::Namespace

  configure(:production) do
    p "Start Production mode"
    ip = Socket.ip_address_list.keep_if{|intf| intf.ipv4_private? && (intf.ip_address =~ /^10/ || intf.ip_address =~ /^192/)}[0].ip_address
    File.open("ip.txt", 'w') { |file| file.write(ip) }
    set :server_adress, ip
    db = Mongo::Client.new([ '10.130.96.220:27018','10.130.96.220:27019', '10.130.96.144:27018' ], :database => 'transmission')
    set :db_transmission, db[:transmission]
    set :db_remit, db[:remit]
    set :db_point, db[:point]
    set :db_centrali, db[:centrali]
    use Rack::Cache, verbose: true
    use Rack::Deflater
  end

  configure(:development) do
    p "Start Development mode"
    require "sinatra/reloader"
    require "ap"
    require "pry"
    
    require 'better_errors'

    register Sinatra::Reloader

    use BetterErrors::Middleware
    BetterErrors.application_root = File.expand_path('..', __FILE__)
    set :raise_errors, true
    set :server_adress, "localhost"
    db = Mongo::Client.new(['localhost:27030'], :database => 'transmission')
    set :db_transmission, db[:transmission]
    set :db_remit, db[:remit]
    set :db_point, db[:point]
    set :db_centrali, db[:centrali]
  end

  configure do
    set :root, APP_ROOT.to_path
    set :server, :puma
    set :sessions, true
    set :session_secret, ENV['SESSION_KEY'] || 'lighthouselabssecret'
    set :public_folder, 'public'
    set :views, 'app/views'
  end 
 

end

