#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

class UpdateCacheRemit
  attr_reader :name, :description, :time_interval 
  def initialize
    @name = "cache_remits"
    @description = "Update della cache delle remit"
    @time_interval = 60*20
  end

  def call
    Remit.refresh_cache
  end

end

