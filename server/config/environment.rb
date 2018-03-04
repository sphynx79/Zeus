ENV['RACK_ENV'] ||= 'development'
ENV['TZ']       ||= 'UTC'

require 'bundler/setup'
require 'mongo'
require 'require_all'
require 'sinatra/base'
require 'oj'
require 'parallel'
require 'sinatra/namespace'
require 'rack/cache'
require 'net/http'
require 'rack/gzip_static'

if ENV['RACK_ENV'] == 'development'
  require 'hirb'
  # extend Hirb::Console
  Hirb.enable
end

Mongo::Logger.logger.level = ::Logger::FATAL

APP_ROOT = Pathname.new(File.expand_path('../../', __FILE__))
APP_NAME = APP_ROOT.basename.to_s

require_all 'app'


