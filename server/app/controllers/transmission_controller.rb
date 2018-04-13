class TransmissionController < ApplicationController
  # helpers Sinatra::Database

  attr_reader :linee_380, :linee_220, :centrali

  def initialize
    super()
    threads = []
    threads << Thread.new { @linee_380 ||= get_linee_380 }
    threads << Thread.new { @linee_220 ||= get_linee_220 }
    threads << Thread.new { @centrali ||= get_centrali }
    threads.each(&:join)
    @remit_linee_collection ||= remit_linee_collection
    @remit_centrali_collection ||= remit_centrali_collection
  end

  map "/"

  #
  # Pagina iniziale static index.html
  # Attraverso il codice javascript carica la mia app
  #
  get "/?:query?" do
    # usare questo per usare un static index.html creato da webpack
    # la public folder in develoment mode e dentro client/dist
    # la public folder in production mode e dentro public
    send_file File.join(settings.public_folder, 'index.html')
    # se invece voglio usare la directory view con i file erb e il layout
    # usare la seguente riga
    # erb :index

  end

  #
  # NameSpace per le mie api
  #
  # Per fare una query alle API http://[adress]:[port]/api/[query]
  #
  namespace '/api' do
    before do
      content_type :json
      headers 'Access-Control-Allow-Origin' => '*', 'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
    end

    #
    # API => Lista linee in remit filtrate per data e voltaggio
    #
    # @param data [String] data di flusso della remit nella forma gg-mm-yyyy
    # @param volt [String] voltaggio della remit 220 oppure 380
    #
    get "/remits/:data/:volt" do
      day, month, year = params['data'].split("-").map(&:to_i)

      start_dt = Date.parse(params['data']).to_time.utc
      end_dt = (Date.parse(params['data']) + 1).to_time.utc
      volt = params['volt']

      pipeline = []

      pipeline << {:$match => {"dt_upd": {:$lte => start_dt}, volt: volt,
                               :$or => [{:$and => [{"start_dt": {:$gte => start_dt}}, {"start_dt": {:$lte => end_dt}}]}, {"start_dt": {:$lte => start_dt}, "end_dt": {:$gte => start_dt}}]}}

      pipeline << {:$group => {'_id': '$nome',
                               'dt_upd': {'$last': '$dt_upd'},
                               'nome': {'$first': '$nome'},
                               'volt': {'$first': '$volt'},
                               'start_dt': {'$first': '$start_dt'},
                               'end_dt': {'$first': '$end_dt'},
                               'reason': {'$first': '$reason'},
                               'id_transmission': {'$first': '$id_transmission'}}}

      remit_result = @remit_linee_collection.aggregate(pipeline).allow_disk_use(false).to_a

      features = Parallel.map(remit_result, in_threads: 4) do |x|
        # features = remit_result.map do |x|
        feature = {}
        id_transmission = x["id_transmission"]
        feature["type"] = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"] = x["nome"]
        # feature["properties"]["volt"]     = x["volt"]
        feature["properties"]["dt_upd"] = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start_dt"] = x["start_dt"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end_dt"] = x["end_dt"].strftime("%d-%m-%Y %H:%M")
        feature["geometry"] = instance_variable_get("@linee_#{volt}").lazy.select { |f| f["id"] == id_transmission }.first["geometry"]
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
      geojson_hash = to_feature_collection features
      Oj.dump(geojson_hash, :mode => :compat)
    end

    #
    # API => Lista delle up in remit filtrate  per data
    #
    # @param data [String] data di flusso della remit nella forma gg-mm-yyyy
    #
    get "/remits_centrali/:data" do
      data = params['data']
      start_date = Date.parse(data)
      end_date = Date.parse(data)
      date_filter = {"days.dt_flusso" => {:$gte => start_date, :$lte => end_date}}

      remit_result = @remit_centrali_collection.find(date_filter).projection({etso: 1, dt_upd: 1, dt_start: 1, dt_end: 1}).to_a

      features = Parallel.map(remit_result, in_threads: 4) do |x|
        feature = {}
        etso = x["etso"]
        mapbox_feature = @centrali.lazy.select { |f| f["properties"]["etso"] == etso }.first
        feature["type"] = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"] = x["etso"]
        feature["properties"]["company"] = mapbox_feature["properties"]["company"]
        feature["properties"]["dt_upd"] = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start_dt"] = x["dt_start"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end_dt"] = x["dt_end"].strftime("%d-%m-%Y %H:%M")
        feature["geometry"] = mapbox_feature["geometry"]
        feature["properties"]["pmax"] = mapbox_feature["properties"]["pmax"]
        feature["properties"]["tipo"] = mapbox_feature["properties"]["tipo"]
        feature
      end

      geojson_hash = to_feature_collection features
      Oj.dump(geojson_hash, :mode => :compat)
    end

    #
    # API => Elenco tutte le centrali con relative proprieta
    #
    get "/lista_centrali" do
      cache_control :public, :must_revalidate, :max_age => 3600
      last_modified Time.now
      lista_centrali = []
      @centrali.map do |centrale|
        lista_centrali << centrale["properties"]
      end
      etag Digest::MD5.hexdigest(lista_centrali.to_s)
      Oj.dump(lista_centrali, :mode => :compat)
    end
  end

  namespace '/api/v1' do
    before do
      content_type :json
      headers 'Access-Control-Allow-Origin' => '*', 'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
    end

    get "/remits_centrali/:data" do
      data = params['data']
      start_date = Date.parse(data)
      end_date = Date.parse(data)

      pipeline = []
      pipeline << {"$match": {"days.dt_flusso" => {:$gte => start_date, :$lte => end_date}}}
      pipeline << {"$sort": {"dt_upd": -1}}
      pipeline << {"$group": {"_id": "$etso", "record": {"$first": "$$ROOT"}}}
      pipeline << {"$project": {
        "_id": 0,
        "etso": "$record.etso",
        "dt_upd": "$record.dt_upd",
        "dt_start": "$record.dt_start",
        "dt_end": "$record.dt_end",
      }}
      remit_result = @remit_centrali_collection.aggregate(pipeline).allow_disk_use(false).to_a
      features = Parallel.map(remit_result, in_threads: 4) do |x|
        feature = {}
        etso = x["etso"]
        feature["type"] = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"] = x["etso"]
        feature["properties"]["dt_upd"] = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start_dt"] = x["dt_start"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end_dt"] = x["dt_end"].strftime("%d-%m-%Y %H:%M")
        mapbox_feature = @centrali.lazy.select { |f| f["properties"]["etso"] == etso }.first
        feature["geometry"] = mapbox_feature["geometry"]
        feature["properties"]["pmax"] = mapbox_feature["properties"]["pmax"]
        feature["properties"]["tipo"] = mapbox_feature["properties"]["tipo"]
        feature
      end

      geojson_hash = to_feature_collection features
      Oj.dump(geojson_hash, :mode => :compat)
    end
  end

    #
  # NameSpace per le mie api V1
  #
  # Per fare una query alle API http://[adress]:[port]/api/v1/[query]
  #
  namespace '/api/v2' do
    before do
      content_type :json
      headers 'Access-Control-Allow-Origin' => '*', 'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
    end

    #
    # API => Lista delle up in remit filtrate  per data
    #
    # @param data [String] data di flusso della remit nella forma gg-mm-yyyy
    #
    get "/remits_centrali/:data" do
      data = params['data']
      start_date = Date.parse(data)
      end_date = Date.parse(data)
      date_filter = {"days.dt_flusso" => {:$gte => start_date, :$lte => end_date}}

      group, project = set_aggregation_for_export

      pipeline = []
      pipeline << {:$unwind => "$days"}
      pipeline << {:$match => date_filter} unless date_filter.nil?
      pipeline << {:$group => group}
      pipeline << {:$project => project}
      pipeline << {:$unwind => "$docs"}
      pipeline << {:$match => {"docs.doc.last" => 1}}
      pipeline << {:$group => {"_id" => "$docs.etso",
                               "etso" => {:$first => "$docs.etso"},
                               "dt_upd" => {:$max => "$docs.dt_upd"},
                               "start_dt" => {:$min => "$docs.dt_start"},
                               "end_dt" => {:$max => "$docs.dt_end"}}}
      pipeline << {:$project => {:_id => 0}}

      remit_result = @remit_centrali_collection.aggregate(pipeline).allow_disk_use(false).to_a

      features = Parallel.map(remit_result, in_threads: 4) do |x|
        feature = {}
        etso = x["etso"]
        feature["type"] = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"] = x["etso"]
        feature["properties"]["dt_upd"] = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start_dt"] = x["start_dt"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end_dt"] = x["end_dt"].strftime("%d-%m-%Y %H:%M")
        feature["geometry"] = @centrali.lazy.select { |f| f["properties"]["etso"] == etso }.first["geometry"]
        feature
      end

      geojson_hash = to_feature_collection features
      Oj.dump(geojson_hash, :mode => :compat)
    end
  end

  #
  # NameSpace per le mie api V2
  #
  # Per fare una query alle API http://[adress]:[port]/api/v2/[query]
  #
  namespace '/api/v3' do
    before do
      content_type :json
      headers 'Access-Control-Allow-Origin' => '*', 'Access-Control-Allow-Methods' => ['OPTIONS', 'GET', 'POST']
    end

    get "/remits_centrali/:data" do
      data = params['data']
      start_date = Date.parse(data)
      end_date = Date.parse(data)
      date_filter = {"days.dt_flusso" => {:$gte => start_date, :$lte => end_date}}

      group, project = set_aggregation_for_export

      pipeline = []
      pipeline << {:$unwind => "$days"}
      pipeline << {:$match => date_filter} unless date_filter.nil?
      pipeline << {:$group => group}
      pipeline << {:$project => project}
      pipeline << {:$unwind => "$docs"}
      pipeline << {:$group => {"_id" => "$docs.etso",
                               "etso" => {:$first => "$docs.etso"},
                               "tp_source" => {:$first => "$docs.tp_source"},
                               "nm_source" => {:$first => "$docs.nm_source"},
                               "p_min" => {:$first => "$docs.p_min"},
                               "p_max" => {:$first => "$docs.p_max"},
                               "fuel_type" => {:$first => "$docs.fuel_type"},
                               "dt_start" => {:$min => "$docs.dt_start"},
                               "dt_end" => {:$max => "$docs.dt_end"},
                               "count" => {:$sum => 1},
                               "hours" => {:$push => {"hour" => "$docs.hour",
                                                      "dt_upd" => "$docs.dt_upd",
                                                      "v_remit" => "$docs.doc.v_remit",
                                                      "p_disp" => "$docs.doc.p_disp",
                                                      "stato" => "$docs.doc.stato",
                                                      "chk_disp" => "$docs.doc.chk_disp",
                                                      "tp_ind" => "$docs.tp_ind",
                                                      "unavailability_type" => "$docs.unavailability_type"}}}}

      pipeline << {:$project => {:_id => 0}}
      remit_result = @remit_centrali_collection.aggregate(pipeline).allow_disk_use(true).to_a
      Oj.dump(remit_result, :mode => :compat)
    end
  end

  #
  # NameSpace per le mie api V2
  #
  # Per fare una query alle API http://[adress]:[port]/api/v2/[query]
  #

  #
  # Metodi si supporto alle api
  #
  helpers do

    #
    # Creao un oggetto geojson standardizzato della remit delle linee
    #
    def to_feature_collection(features)
      {"type" => "FeatureCollection", "features" => features}
    end

    #
    # Attraverso le api di mapbox faccio una query al mio dataset
    # e mi restituisce tutte le linee 380
    #
    def get_linee_380
      url = "https://api.mapbox.com/datasets/v1/browserino/cjcb6ahdv0daq2xnwfxp96z9t/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      uri = URI.parse(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      geojson = http.get(uri.request_uri).body
      Oj.load(geojson, :mode => :compat)["features"]
    end

    #
    # Attraverso le api di mapbox faccio una query al mio dataset
    # e mi restituisce tutte le linee 220
    #
    def get_linee_220
      url = "https://api.mapbox.com/datasets/v1/browserino/cjcfb90n41pub2xp6liaz7quj/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      uri = URI.parse(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      geojson = http.get(uri.request_uri).body
      Oj.load(geojson, :mode => :compat)["features"]
    end

    #
    # Attraverso le api di mapbox faccio una query al mio dataset
    # e mi restituisce tutte le centrali
    #
    def get_centrali
      url = "https://api.mapbox.com/datasets/v1/browserino/cjaoj0nr54iq92wlosvaaki0y/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      uri = URI.parse(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      geojson = http.get(uri.request_uri).body
      Oj.load(geojson, :mode => :compat)["features"]
    end

    #
    # Metodo di supporto per aggragazione, utilizzato nelle api per lista centrali in remit
    #
    def set_aggregation_for_export
      group = {}
      set = []
      1.upto 24 do |i|
        group[i] = {:$push => {:doc => "$days.hours.#{i}",
                               :dt_upd => "$dt_upd",
                               :d_bdofrdt => "$days.d_bdofrdt",
                               :dt_flusso => "$_id.dt_flusso",
                               :dt_start => "$dt_start",
                               :dt_end => "$dt_end",
                               :etso => "$etso",
                               :fuel_type => "$fuel_type",
                               :unavailability_type => "$unavailability_type",
                               :msg_id => "$msg_id",
                               :p_min => "$p_min",
                               :p_max => "$p_max",
                               :tp_ind => "$tp_ind",
                               :nm_source => "$nm_source",
                               :tp_source => "$tp_source",
                               :hour => {:$literal => i}}}
        set.push("$#{i}")
      end
      group[:_id] = {:$dateToString => {:format => "%Y-%m-%d", :date => "$days.dt_flusso"}}
      project = {:docs => {:$setUnion => set}}
      return group, project
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
end

