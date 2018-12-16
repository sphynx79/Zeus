#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

class UpdateCacheReport
  attr_reader :name, :description, :time_interval
  def initialize
    @name = "cache_report" 
    @description = "Update della cache dei report"
    @time_interval = 60*10
  end

  def call
    Report.initialize_cache
  end

end

