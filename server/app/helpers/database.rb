#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

module Sinatra
  module Database
    #
    # Creao un oggetto geojson standardizzato della remit delle linee
    #
    def to_feature_collection(features)
      {"type" => "FeatureCollection", "features" => features}
    end

    #
    # Seleziono da setting la collezione del db da usare per la remit delle linee
    #
    def remit_linee_collection
      settings.remit_linee_collection
    end

    #
    # Seleziono da setting la collezione del db da usare per la remit delle centrali
    #
    def remit_centrali_collection
      settings.remit_centrali_collection
    end
  end

  helpers Database
end

