#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

module V1
  class Api < Roda
    include RequestHelpers

    plugin :multi_route
    plugin :halt
    plugin :optimized_string_matchers
    plugin :not_found do |r| 
      json({"error" => "Api #{r.path} non trovata"})
    end
      
    require_glob APP_ROOT.to_s + "/app/routes/v1/*.rb"

    route do |r|
      response["Access-Control-Allow-Headers"] = "*"
      response["Access-Control-Allow-Origin"] = "*"
      response["Access-Control-Allow-Methods"] = "POST, PUT, DELETE, GET, OPTIONS"
      response["Content-Type"] = "application/json"

      r.on_branch "remits" do
        r.route "remits"
      end

      r.on_branch "reports" do
        r.route "reports"
      end

      r.on_branch "units" do
        r.route "units"
      end

      r.on_branch "no_cache" do
        r.on_branch "remits" do
          r.route "remits_no_cache"
        end

        r.on_branch "reports" do
          r.route "reports_no_cache"
        end

        r.on_branch "units" do
          r.route "units_no_cache"
        end
      end


    end
  end
end

