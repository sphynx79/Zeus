#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

APP_ROOT = Pathname.new(File.expand_path("../", __FILE__)).freeze
APP_NAME = APP_ROOT.basename.to_s.freeze
VERSION = File.read("../VERSION").strip

ENV['TZ'] = 'Europe/Rome'

env = ENV["RACK_ENV"] || "development"

ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../../Gemfile", __FILE__)
require "bundler/setup" if File.exist?(ENV["BUNDLE_GEMFILE"])
Bundler.require(:default, env)
require "net/http"
require "digest/sha1"
require 'json'

# require "logger"
# LOGGER = Logger.new("./log/#{env}.log")
# LOGGER = Logger.new(STDOUT)
# LOGGER.level = Logger::DEBUG

if env == "development"
  Unreloader = Rack::Unreloader.new(subclasses: %w[Roda], logger: Logger.new(STDOUT), reload: env == "development") { Ampere }
  Unreloader.require("./config/settings.rb")
  Unreloader.require("./ampere.rb")
  Unreloader.require("./models")
  Unreloader.require("./service")
  Unreloader.require("./helpers")
  Unreloader.require("./routes")
else
  require "./config/settings.rb"
  require "./ampere.rb"
  GLOB = "./{models,service,helpers,routes}/**/*.rb"
  # Load components
  Dir[GLOB].each { |file| require file }
end

Mongo::Logger.logger.level = ::Logger::FATAL

begin
  DB = Mongo::Client.new(Settings.database.adress, database: Settings.database.name, write: {w: 0, j: false}, wait_queue_timeout: 3, min_pool_size: 10, max_pool_size: 50)
  DB.database_names
rescue Mongo::Error::NoServerAvailable
  p "Non riesco connetermi al server mongo db"
  exit!
end

class Module

  def redefine_const(name, value)

    __send__(:remove_const, name) if const_defined?(name)

    const_set(name, value)

  end

end

CACHE_TEC_DAILY = Report.get_report("tecnologia")
CACHE_ZONA_DAILY = Report.get_report("zona")
CACHE_TEC_HOURLY = Report.get_report("tecnologia_giornaliero")
CACHE_ZONA_HOURLY = Report.get_report("zona_giornaliero")

scheduler = Rufus::Scheduler.new

scheduler.every '5m' do
      Object.redefine_const(:CACHE_TEC_DAILY, Report.get_report("tecnologia"))
      Object.redefine_const(:CACHE_ZONA_DAILY, Report.get_report("zona"))
      Object.redefine_const(:CACHE_TEC_HOURLY, Report.get_report("tecnologia_giornaliero"))
      Object.redefine_const(:CACHE_ZONA_HOURLY, Report.get_report("zona_giornaliero"))
end


MAPBOX = MapBox.new()

