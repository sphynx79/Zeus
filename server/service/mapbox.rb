# frozen_string_literal: true

class MapBox

  attr_reader :centrali, :linee_380, :linee_220

  def initialize
    @dataset_linee380_url = "#{Settings.mapbox.url}/datasets/v1/browserino/cjcb6ahdv0daq2xnwfxp96z9t/features?access_token=#{Settings.mapbox.api_token}"
    @dataset_linee220_url = "#{Settings.mapbox.url}/datasets/v1/browserino/cjcfb90n41pub2xp6liaz7quj/features?access_token=#{Settings.mapbox.api_token}"
    @dataset_centrali_url = "#{Settings.mapbox.url}/datasets/v1/browserino/cjaoj0nr54iq92wlosvaaki0y/features?access_token=#{Settings.mapbox.api_token}"
    threads = []
    threads << Thread.new { get_centrali }
    threads << Thread.new { get_linee_380 }
    threads << Thread.new { get_linee_220 }
    threads.each(&:join)
  end

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
    @linee_380 ||= Oj.load(get_json_data(@dataset_linee380_url), mode: :compat)["features"].freeze
  end

  #
  # Attraverso le api di mapbox faccio una query al mio dataset
  # e mi restituisce tutte le linee 220
  #
  def get_linee_220
    @linee_220 ||= Oj.load(get_json_data(@dataset_linee220_url), mode: :compat)["features"].freeze
  end

  #
  # Attraverso le api di mapbox faccio una query al mio dataset
  # e mi restituisce tutte le centrali
  #
  def get_centrali
    @centrali ||= (Oj.load(get_json_data(@dataset_centrali_url), mode: :compat)["features"]).freeze
  end
end


