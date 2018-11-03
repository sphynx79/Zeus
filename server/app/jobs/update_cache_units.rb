#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

class UpdateCacheUnits
  attr_reader :description, :time_interval, :timeout, :result
  def initialize
    @description = "Update della cache delle unita"
    @time_interval = "1h"
    @timeout = "10m"
  end

  def call
    begin
      Units.initialize_cache
      return true
    rescue => e
      @result = e # $! global variable reference to the Exception object
      return false
    end
  end

  def failed
    @result
  end

end

