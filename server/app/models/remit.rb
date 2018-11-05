# frozen_string_literal: true

class Remit < Mongodb
  extend Mapbox

  # cattr :cache_remit_linee_220
  # cattr :cache_remit_linee_220

  class << self
    # def initialize_cache
    #   @@cache_remit_linee_220 = set_cache("linee_220")
    #   @@cache_remit_linee_220 = set_cache("linee_380")
    # end

    # def set_cache(type)
    #   collection = case type
    #                when "linee_220"
    #                  client[:remit_centrali_daily_tecologia].aggregate(pipeline_daily_tecologia()).allow_disk_use(true).to_a
    #                when "linee_380"
    #                  client[:remit_centrali_daily_zona].aggregate(pipeline_daily_zona()).allow_disk_use(true).to_a
    #                else
    #                  "Errore"
    #                end
    #   return "cache #{type} non trovata" if collection == "Errore"

    #   collection.inject({}) do |r, s| r.merge!({s["data"] => s.dup { |x| x.delete("data") }.to_json}) end
    # end

    def get_remit_linee(start_dt, end_dt, volt)
      pipeline = set_pipeline_linee(start_dt, end_dt, volt)
      remit_result = client[:remit_linee].aggregate(pipeline).allow_disk_use(true).to_a
      features = features_linee(remit_result, volt)
      return {"type" => "FeatureCollection", "features" => features}
    end

    def get_remit_centrali(data)
      pipeline = set_pipeline_centrali(data)
      remit_result = client[:remit_centrali_last_daily].aggregate(pipeline).allow_disk_use(true).to_a
      features = features_centrali(remit_result)
      return {"type" => "FeatureCollection", "features" => features}
    end

    def features_linee(remit_result, volt)
      remit_result.map do |x|
        feature = {}
        id_transmission = x["id_transmission"]
        feature["type"] = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"] = x["nome"]
        # feature["properties"]["volt"]     = x["volt"]
        feature["properties"]["update"] = TZ.utc_to_local(x["dt_upd"]).strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start"] = TZ.utc_to_local(x["start_dt"]).strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end"] = TZ.utc_to_local(x["end_dt"]).strftime("%d-%m-%Y %H:%M")
        feature["geometry"] = self.send("linee_#{volt}").detect { |f| f["id"] == id_transmission }["geometry"]
        feature
      end
    end

    def features_centrali(remit_result)
      remit_result[0][:remits].map do |x|
        feature = {}
        etso = x["etso"]
        mapbox_feature = centrali.detect { |f| f["properties"]["etso"] == etso }
        feature["type"] = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"] = x["etso"]
        feature["properties"]["company"] = mapbox_feature["properties"]["company"]
        feature["properties"]["tipo"] = mapbox_feature["properties"]["tipo"]
        feature["properties"]["sottotipo"] = mapbox_feature["properties"]["sottotipo"]
        feature["properties"]["remit"] = x["remit"].to_i
        feature["properties"]["pmax"] = mapbox_feature["properties"]["pmax"]
        feature["properties"]["update"] = TZ.utc_to_local(x["dt_upd"]).strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start"] = TZ.utc_to_local(x["dt_start"]).strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end"] = TZ.utc_to_local(x["dt_end"]).strftime("%d-%m-%Y %H:%M")
        feature["geometry"] = mapbox_feature["geometry"]
        feature
      end
    end

    def set_pipeline_centrali(data)
      pipeline = []

      pipeline << {"$match": {data: data}}

      pipeline << {"$project": {
        "_id": 0,
        "remits": 1,
      }}

      return pipeline
    end

    def set_pipeline_linee(start_dt, end_dt, volt)
      pipeline = []
      pipeline << {:$match => {"dt_upd": {:$lte => start_dt}, "volt": volt}}
      pipeline << {:$match => {"start_dt": {:$lte => end_dt}, "end_dt": {:$gte => start_dt}}}
      pipeline << {:$group => {
        '_id': "$nome",
        'dt_upd':  {
          '$last': "$dt_upd"
        },
        'nome': {
          '$first': "$nome",
        },
        'volt': {
          '$first': "$volt",
        },
        'start_dt': {
          '$first': "$start_dt" 
        },
        'end_dt': {
          '$first': "$end_dt"
        },
        'reason': {
          '$first': "$reason",
        },
        'id_transmission': {
          '$first': "$id_transmission",
        },
      }}
      return pipeline
    end
  end
end

