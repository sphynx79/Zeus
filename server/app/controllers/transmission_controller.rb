class TransmissionController < ApplicationController

  def initialize
    super()
    @linee_380        ||= linee_380
    @remit_collection ||= remit_collection
  end

  map "/"

  get "/?:query?" do

    # @data       = params['data']      || (Date.today+1).strftime("%d-%m-%Y")
    # @zoom_level = params['zoomlevel'] || "6"
    # @center_lat = params['centerlat'] || "42.18"
    # @center_lon = params['centerlon'] || "11.88"
    # ap @linee_380

    # usare questo per usare un static index.html creato da webpack
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

      get "/remits/:data?" do

      day, month, year = params['data'].split("-").map(&:to_i)

      start_dt = Date.parse(params['data']).to_time.utc
      end_dt   = (Date.parse(params['data'])+1).to_time.utc

      pipeline = []

      pipeline << {:$match  => {"dt_upd": { :$lte => start_dt},
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

      features = remit_result.map do |x|
        id_transmission = x["id_transmission"]
        feature    = {}
        feature["type"]       = "Feature"
        feature["geometry"]   = @linee_380.lazy.select{|f| f[:id]== id_transmission }.first[:geometry]
        # feature   = transmission_collection.find({"_id": id_transmission}).limit(1).projection({"geometry": 1, "_id": 0}).first
        feature["properties"] = {}
        feature["properties"]["nome"]     = x["nome"]
        feature["properties"]["dt_upd"]   = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start_dt"] = x["start_dt"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end_dt"]   = x["end_dt"].strftime("%d-%m-%Y %H:%M")
        feature
      end

      geojson_hash  = to_feature_collection features
      ap geojson_hash
      geojson_hash.to_json
    end


  end

  helpers do

    def to_feature_collection features
      {"type": "FeatureCollection", "features": features}
    end

    def linee_380
      url = "https://api.mapbox.com/datasets/v1/browserino/cj9l3jgn21kwg33s2edl2pe0o/features?access_token=sk.eyJ1IjoiYnJvd3NlcmlubyIsImEiOiJjamEzdjBxOGM5Nm85MzNxdG9mOTdnaDQ0In0.tMMxfE2W6-WCYIRzBmCVKg"
      uri           = URI.parse(url)
      http          = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl  = true
      geojson       = http.get(uri.request_uri).body
      JSON.parse(geojson, :symbolize_names => true)[:features]
    end

    def remit_collection
      settings.db_remit
    end

  end

end
