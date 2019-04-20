#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

module Mapbox
  mattr :centrali, :linee_380, :linee_220
  @@dataset_linee380_url = "#{Settings.mapbox.url}/datasets/v1/browserino/cjcb6ahdv0daq2xnwfxp96z9t/features?access_token=#{Settings.mapbox.api_token}"
  @@dataset_linee220_url = "#{Settings.mapbox.url}/datasets/v1/browserino/cjcfb90n41pub2xp6liaz7quj/features?access_token=#{Settings.mapbox.api_token}"
  @@dataset_centrali_url = "#{Settings.mapbox.url}/datasets/v1/browserino/cjaoj0nr54iq92wlosvaaki0y/features?access_token=#{Settings.mapbox.api_token}"

  def self.extended(klass)
    @@centrali ||= Oj.load(klass.get_json_data(@@dataset_centrali_url), mode: :compat)['features']
    @@linee_380 ||= Oj.load(klass.get_json_data(@@dataset_linee380_url), mode: :compat)['features']
    @@linee_220 ||= Oj.load(klass.get_json_data(@@dataset_linee220_url), mode: :compat)['features']
  end

  def centrali
    @@centrali ||= Oj.load(get_json_data(@@dataset_centrali_url), mode: :compat)['features']
  end

  def linee_380
    @@linee_380 ||= Oj.load(get_json_data(@@dataset_linee380_url), mode: :compat)['features']
  end

  def linee_220
    @@linee_220 ||= Oj.load(get_json_data(@@dataset_linee220_url), mode: :compat)['features']
  end

  def get_json_data(url)
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.get(uri.request_uri).body
  end
end
