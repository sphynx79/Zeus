#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

module Sinatra
  module Database
    def prova
      p "prova"
    end
  end
  helpers Database
end


