#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

class UpdateCacheReport
  attr_reader :description, :time_interval, :timeout, :result
  def initialize
    @description = "Update della cache dei report"
    @time_interval = "10m"
    @timeout = "10m"
  end

  def call
    begin
      Report.initialize_cache
      return true
    rescue Exception
      @result = $! # $! global variable reference to the Exception object
      return false
    end
  end

  def failed
    @result
  end

end

