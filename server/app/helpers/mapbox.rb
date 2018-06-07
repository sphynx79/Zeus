#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

module Sinatra
  module MapBox

    def get_json_data(url)
      uri = URI.parse(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.get(uri.request_uri).body
    end

    #
    # Attraverso le api di mapbox faccio una query al mio dataset
    # e mi restituisce tutte le linee 380
    #
    def get_linee_380
      url = "https://api.mapbox.com/datasets/v1/browserino/cjcb6ahdv0daq2xnwfxp96z9t/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      Oj.load(get_json_data(url), mode: :compat)["features"].freeze
    end

    #
    # Attraverso le api di mapbox faccio una query al mio dataset
    # e mi restituisce tutte le linee 220
    #
    def get_linee_220
      url = "https://api.mapbox.com/datasets/v1/browserino/cjcfb90n41pub2xp6liaz7quj/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      Oj.load(get_json_data(url), mode: :compat)["features"].freeze
    end

    #
    # Attraverso le api di mapbox faccio una query al mio dataset
    # e mi restituisce tutte le centrali
    #
    def get_centrali
      url = "https://api.mapbox.com/datasets/v1/browserino/cjaoj0nr54iq92wlosvaaki0y/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      Oj.load(get_json_data(url), mode: :compat)["features"].freeze
    end
  end

  helpers MapBox
end

