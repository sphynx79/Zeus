ENV['RACK_ENV'] ||= 'development'
ENV['TZ']       ||= 'UTC'

require 'rubygems'
require 'bundler'
require 'bundler/setup'
require 'mongo'
require 'require_all'
require "sinatra/base"
require "sinatra/json"
require "sinatra/namespace"
require 'rack/cache'
require 'net/http'
require 'rack/gzip_static'

Mongo::Logger.logger.level = ::Logger::FATAL

APP_ROOT = Pathname.new(File.expand_path('../../', __FILE__))
APP_NAME = APP_ROOT.basename.to_s

require_all 'app'

