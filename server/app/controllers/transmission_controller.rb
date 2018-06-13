# frozen_string_literal: true

class TransmissionController < ApplicationController
  helpers Sinatra::Database
  helpers Sinatra::MapBox

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
    send_file File.join(settings.public_folder, "index.html")
    # se invece voglio usare la directory view con i file erb e il layout
    # usare la seguente riga
    # erb :index
  end

  #
  # NameSpace per le mie api
  #
  # Per fare una query alle API http://[adress]:[port]/api/[query]
  #
  namespace "/api" do
    before do
      content_type :json
      headers "Access-Control-Allow-Origin" => "*", "Access-Control-Allow-Methods" => %w[OPTIONS GET POST]
    end

    #
    # API => Lista linee in remit filtrate per data e voltaggio
    #
    # @param data [String] data di flusso della remit nella forma gg-mm-yyyy
    # @param volt [String] voltaggio della remit 220 oppure 380
    #
    get "/remits/:data/:volt" do
      start_dt = Date.parse(params["data"]).to_time.utc
      end_dt = (Date.parse(params["data"]) + 1).to_time.utc
      volt = params["volt"]

      pipeline = []

      pipeline << {:$match => {"dt_upd": {:$lte => start_dt}, volt: volt,
                               :$or => [{:$and => [{"start_dt": {:$gte => start_dt}}, {"start_dt": {:$lte => end_dt}}]}, {"start_dt": {:$lte => start_dt}, "end_dt": {:$gte => start_dt}}]}}

      pipeline << {:$group => {'_id': "$nome",
                               'dt_upd': {'$last': "$dt_upd"},
                               'nome': {'$first': "$nome"},
                               'volt': {'$first': "$volt"},
                               'start_dt': {'$first': "$start_dt"},
                               'end_dt': {'$first': "$end_dt"},
                               'reason': {'$first': "$reason"},
                               'id_transmission': {'$first': "$id_transmission"}}}

      remit_result = @remit_linee_collection.aggregate(pipeline).allow_disk_use(true).to_a

      features = Parallel.map(remit_result, in_threads: 4) do |x|
        feature = {}
        id_transmission = x["id_transmission"]
        feature["type"] = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"] = x["nome"]
        # feature["properties"]["volt"]     = x["volt"]
        feature["properties"]["update"] = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start"] = x["start_dt"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end"] = x["end_dt"].strftime("%d-%m-%Y %H:%M")
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
      Oj.dump(geojson_hash, mode: :compat)
    end

    get "/remits_centrali/:data" do
      data = params["data"]
      start_dt = Date.parse(data)
      end_dt = Date.parse(data)

      pipeline = []
      pipeline << {:$match => {"event_status": "Active"}}
      pipeline << {:$match => {"dt_upd": {:$lte => start_dt},
                               :$or => [{:$and => [{"dt_start": {:$gte => start_dt}}, {"dt_start": {:$lte => end_dt}}]}, {"dt_start": {:$lte => start_dt}, "dt_end": {:$gte => start_dt}}]}}
      pipeline << {"$project": {
        "_id": 0,
        "etso": "$etso",
        "remit": "$unaviable_capacity",
        "dt_upd": "$dt_upd",
        "dt_start": "$dt_start",
        "dt_end": "$dt_end",
      }}

      remit_result = @remit_centrali_collection.aggregate(pipeline).allow_disk_use(true).to_a

      features = Parallel.map(remit_result, in_threads: 8) do |x|
        feature = {}
        etso = x["etso"]
        mapbox_feature = @centrali.lazy.select { |f| f["properties"]["etso"] == etso }.first
        feature["type"] = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"] = x["etso"]
        feature["properties"]["company"] = mapbox_feature["properties"]["company"]
        feature["properties"]["tipo"] = mapbox_feature["properties"]["tipo"]
        feature["properties"]["sottotipo"] = mapbox_feature["properties"]["sottotipo"]
        feature["properties"]["remit"] = x["remit"].to_i
        feature["properties"]["pmax"] = mapbox_feature["properties"]["pmax"]
        feature["properties"]["update"] = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start"] = x["dt_start"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end"] = x["dt_end"].strftime("%d-%m-%Y %H:%M")
        feature["geometry"] = mapbox_feature["geometry"]
        feature
      end
      
      geojson_hash = to_feature_collection features
      Oj.dump(geojson_hash, mode: :compat)
    end

    get "/report_centrali/:start_dt/:end_dt" do
      start_dt = Date.parse(params["start_dt"])
      end_dt = Date.parse(params["end_dt"])


      pipeline = []
      pipeline << {:$match => {"event_status": "Active"}}
      pipeline << {:$match => {"dt_upd": {:$lte => start_dt},
                               :$or => [{:$and => [{"dt_start": {:$gte => start_dt}}, {"dt_start": {:$lte => end_dt}}]}, {"dt_start": {:$lte => start_dt}, "dt_end": {:$gte => start_dt}}]}}

      pipeline << {"$project": {
        "_id": 0,
        "etso": "$etso",
        "remit": "$unaviable_capacity",
        "dt_start": "$dt_start",
        "dt_end": "$dt_end",
      }}

      remit_result = @remit_centrali_collection.aggregate(pipeline).allow_disk_use(true).to_a

      Parallel.map(remit_result, in_threads: 8) do |x|
        mapbox_feature = @centrali.lazy.select { |f| f["properties"]["etso"] == x["etso"] }.first
        x.merge!("tipo" =>  mapbox_feature["properties"]["tipo"])
        x["dt_start"] = x["dt_start"].to_date
        x["dt_end"] = x["dt_end"].to_date
      end

      aggregation = []
      start_dt.upto(end_dt) do |date|
        aggregation_step = {data: "", termico: [], pompaggio: [], autoproduttore: [], idrico: [], eolico: [], solare: [], geotermico: [] }
        aggregation_step[:data] = date
        remit_result.each do |remit|
          if date.between?(remit["dt_start"], remit["dt_end"])
            aggregation_step[remit["tipo"].downcase.to_sym].push(remit["remit"])
          end
        end
        aggregation_step.each do |key, value|
          if key != :data
            aggregation_step[key] = aggregation_step[key].empty? ? nil : aggregation_step[key].sum.to_i
          end
        end
        aggregation << aggregation_step
      end
      # aggregation.each do |x|
      #   array = [x[:data]]
      #   x.keys[1..-1].each do |y|
      #     x[y] = x[y].sum.to_i
      #   end
      # end

      # aggregation_array = []
      # Parallel.map(aggregation, in_threads: 8) do |x|
      #   array = [x[:data]]
      #   x.keys[1..-1].each do |y|
      #     x[y].empty? ? array << nil : array << x[y].sum.to_i
      #     # array << x[y].sum.to_i
      #   end
      #   aggregation_array << array
      # end

      Oj.dump(aggregation, mode: :compat)
    end

    #
    # API => Elenco tutte le centrali con relative proprieta
    #
    get "/lista_centrali" do
      cache_control :public, :must_revalidate, max_age: 3600
      last_modified Time.now
      lista_centrali = []
      @centrali.map do |centrale|
        lista_centrali << centrale["properties"]
      end
      etag Digest::MD5.hexdigest(lista_centrali.to_s)
      Oj.dump(lista_centrali, mode: :compat)
    end
  end

end

