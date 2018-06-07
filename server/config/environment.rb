#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

$:.unshift File.expand_path("app",  File.dirname(__dir__)) 

ENV['RACK_ENV'] ||= 'development'
ENV['TZ']       ||= 'UTC'

require 'rubygems'
require 'bundler/setup'
if ENV['RACK_ENV'] == 'production'
  require 'bootsnap'
  Bootsnap.setup(
    cache_dir:            './cache',
    development_mode:     ENV['RACK_ENV'] == 'development',
    load_path_cache:      true,
    autoload_paths_cache: true,
    disable_trace:        true,
    compile_cache_iseq:   true,
    compile_cache_yaml:   true
  )
end

require 'mongo'
require 'require_all'
require 'sinatra/base'
require 'oj'
require 'parallel'
require 'sinatra/namespace'
require 'rack/cache'
require 'net/http'
require 'rack/gzip_static'
require 'helpers/mapbox'
require 'helpers/database'

if ENV['RACK_ENV'] == 'development'
  require 'hirb'
  # extend Hirb::Console
  Hirb.enable
end

Mongo::Logger.logger.level = ::Logger::FATAL

APP_ROOT = Pathname.new(File.expand_path('../../', __FILE__))
APP_NAME = APP_ROOT.basename.to_s

require_all 'app'


