#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

class Settings < Settingslogic
  source "#{APP_ROOT}/config/config.yml"
  namespace ENV['RACK_ENV']
  load!
end

