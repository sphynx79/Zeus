class TransmissionController < ApplicationController

  attr_reader :linee_380, :linee_220, :centrali

  def initialize
    super()
    threads = []
    threads << Thread.new { @linee_380 ||= get_linee_380 }
    threads << Thread.new { @linee_220 ||= get_linee_220 }
    threads << Thread.new { @centrali  ||= get_centrali }
    threads.each(&:join)
    @remit_collection ||= remit_collection
  end

  map "/"

  get "/?:query?" do
    # usare questo per usare un static index.html creato da webpack
    # la public folder in develoment mode e dentro client/dist
    # la public folder in production mode e dentro public
    send_file File.join(settings.public_folder, 'index.html')
    # se invece voglio usare la directory view con i file erb e il layout
    # usare la seguente riga
    # erb :index

  end

  namespace '/api' do

    before do
      content_type :json
      headers 'Access-Control-Allow-Origin' => '*', 'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
    end

    get "/remits/:data/:volt" do
      day, month, year = params['data'].split("-").map(&:to_i)

      start_dt = Date.parse(params['data']).to_time.utc
      end_dt   = (Date.parse(params['data'])+1).to_time.utc
      volt     = params['volt']

      pipeline = []


      pipeline << {:$match  => {"dt_upd": { :$lte => start_dt}, volt: volt,
                                :$or => [{:$and => [{"start_dt": {:$gte => start_dt}}, {"start_dt": {:$lte => end_dt}}]}, {"start_dt": {:$lte =>start_dt}, "end_dt": {:$gte => start_dt}}]}}

      pipeline << {:$group => {'_id': '$nome',
                               'dt_upd': {'$last':  '$dt_upd'},
                               'nome': {'$first': '$nome'},
                               'volt': {'$first': '$volt'},
                               'start_dt': {'$first': '$start_dt'},
                               'end_dt': {'$first': '$end_dt'},
                               'reason': {'$first': '$reason'},
                               'id_transmission': {'$first': '$id_transmission'}
      }}

      remit_result = @remit_collection.aggregate(pipeline).allow_disk_use(true).to_a

      features = Parallel.map(remit_result, in_threads: 4) do |x|
        # features = remit_result.map do |x|
        feature                           = {}
        id_transmission                   = x["id_transmission"]
        feature["type"]                   = "Feature"
        feature["properties"]             = {}
        feature["properties"]["nome"]     = x["nome"]
        # feature["properties"]["volt"]     = x["volt"]
        feature["properties"]["dt_upd"]   = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start_dt"] = x["start_dt"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end_dt"]   = x["end_dt"].strftime("%d-%m-%Y %H:%M")
        feature["geometry"]               = instance_variable_get("@linee_#{volt}").lazy.select{|f| f["id"] == id_transmission }.first["geometry"]
        feature
      end
      # feature_debug = features
      # if volt == "220"
      #
      #   puts "###############################################220##########################################"
      #   f = feature_debug.each { |h| h.delete("geometry") }
      #   f = f.each { |h| h.delete("type") }
      #   f = f.map do |x| x["properties"] end;
      #   print Hirb::Helpers::Table.render(f, {:width => 290, :height => 500, :formatter=> true, :number=> true, :headers => {:hirb_number => "Riga"}})
      # end
      # if volt == "380"
      #   puts "###############################################380##########################################"
      #   f = feature_debug.each { |h| h.delete("geometry") }
      #   f = f.each { |h| h.delete("type") }
      #   f = f.map do |x| x["properties"] end;
      #   print Hirb::Helpers::Table.render(f, {:width => 290, :height => 500, :formatter=> true, :number=> true, :headers => {:hirb_number => "Riga"}})
      # end
      #
      geojson_hash  = to_feature_collection features
      Oj.dump(geojson_hash,:mode => :compat)
    end

    get "/lista_centrali" do
      cache_control :public, :must_revalidate, :max_age => 3600
      last_modified Time.now
      lista_centrali = []
      @centrali.map do |centrale|
        lista_centrali << centrale["properties"]
      end
      etag Digest::MD5.hexdigest(lista_centrali.to_s)
      Oj.dump(lista_centrali,:mode => :compat)
    end

    # get "/lista_societa" do
    #   lista_societa = Set.new
    #   @centrali.each do |k,v|
    #     lista_societa << k.dig("properties", "company")
    #   end
    #   Oj.dump(lista_societa.to_a,:mode => :compat)
    # end
    #
    # get "/lista_etso" do
    #   lista_etso = Set.new
    #   @centrali.each do |k,v|
    #     lista_etso << k.dig("properties", "etso")
    #   end
    #   Oj.dump(lista_etso.to_a,:mode => :compat)
    # end

  end

  helpers do

    def to_feature_collection features
      {"type" => "FeatureCollection", "features" => features}
    end

    def get_linee_380
      url = "https://api.mapbox.com/datasets/v1/browserino/cjcb6ahdv0daq2xnwfxp96z9t/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      uri           = URI.parse(url)
      http          = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl  = true
      geojson       = http.get(uri.request_uri).body
      Oj.load(geojson, :mode => :compat)["features"]
    end

    def get_linee_220
      url = "https://api.mapbox.com/datasets/v1/browserino/cjcfb90n41pub2xp6liaz7quj/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      uri           = URI.parse(url)
      http          = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl  = true
      geojson       = http.get(uri.request_uri).body
      Oj.load(geojson, :mode => :compat)["features"]
    end

    def get_centrali
      url = "https://api.mapbox.com/datasets/v1/browserino/cjaoj0nr54iq92wlosvaaki0y/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      uri           = URI.parse(url)
      http          = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl  = true
      geojson       = http.get(uri.request_uri).body
      Oj.load(geojson, :mode => :compat)["features"]
    end

    def remit_collection
      settings.db_remit
    end

  end

end

