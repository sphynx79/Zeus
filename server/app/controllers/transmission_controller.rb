class TransmissionController < ApplicationController
  map "/"

  get "/?:query?" do

    @data       = params['data']      || (Date.today+1).strftime("%d-%m-%Y")
    @zoom_level = params['zoomlevel'] || "6"
    @center_lat = params['centerlat'] || "42.18"
    @center_lon = params['centerlon'] || "11.88"

    send_file File.join(settings.public_folder, 'index.html')
  end

  namespace '/api' do

    before do
      content_type :json
    end

    get "/remits/:data?" do

      day, month, year = params['data'].split("-").map(&:to_i)

      start_dt =  Date.parse(params['data']).to_time.utc
      end_dt   =  (Date.parse(params['data'])+1).to_time.utc

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


      remit_result = remit_collection.aggregate(pipeline).allow_disk_use(true).to_a

      features = remit_result.map do |x|
        id_transmission = x["id_transmission"]
        feature = transmission_collection.find({"_id": id_transmission}).limit(1).projection({"geometry": 1, "_id": 0}).first
        feature["type"]       = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"]     = x["nome"]
        feature["properties"]["dt_upd"]   = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start_dt"] = x["start_dt"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end_dt"]   = x["end_dt"].strftime("%d-%m-%Y %H:%M")
        feature
      end

      geojson  = to_geojson features
      geojson.to_json
    end

  end

  helpers do
    def all_transmissions
      transmission_collection.find().projection({_id: 0}).to_a
    end

    def to_geojson features
      {"type": "FeatureCollection", "features": features}
    end

    def remit_collection
      remit_collection ||= settings.db_remit
    end

  end

end
