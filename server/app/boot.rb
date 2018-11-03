#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

require "net/http"
require "digest/sha1"
require 'json'

def require_glob(glob)
  Dir.glob(glob).sort.each do |path|
    require path
  end
end


require_glob APP_ROOT.to_s + '/app/patch/*.rb'
require_glob APP_ROOT.to_s + '/app/initializers/*.rb'
require_glob APP_ROOT.to_s + '/app/helpers/*.rb'
require_glob APP_ROOT.to_s + '/app/models/*.rb'
require_glob APP_ROOT.to_s + '/app/services/*.rb'

