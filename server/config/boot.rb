# frozen_string_literal: true


env = ENV['RACK_ENV'] || 'development'
is_dev = env == 'development'

ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)
require 'bundler/setup' if File.exist?(ENV['BUNDLE_GEMFILE'])
Bundler.require(:default, env)
require 'net/http'
require 'digest/sha1'
require 'active_support/core_ext/numeric/time'
require 'time_range'

APP_ROOT = Pathname.new(File.expand_path('../../', __FILE__)).freeze
APP_NAME = APP_ROOT.basename.to_s.freeze

require 'logger'
# LOGGER = Logger.new("./log/#{env}.log")
LOGGER = Logger.new(STDOUT)
LOGGER.level = Logger::DEBUG
UTC_OFFSET = Time.now.utc_offset

require_relative 'settings'
Unreloader = Rack::Unreloader.new(subclasses: %w[Roda], logger: LOGGER, reload: is_dev) { Ampere }
Unreloader.require('./config/ampere.rb')

require_relative 'db'

