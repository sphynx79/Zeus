#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

class UpdateCacheUnits
  attr_reader :name, :description, :time_interval 
  def initialize
    @name = "cache_units"
    @description = "Update della cache delle unita"
    @time_interval = 60*20
  end

  def call
    Units.initialize_cache
  end

end

