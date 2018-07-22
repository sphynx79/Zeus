# frozen_string_literal: true

class Remit
  class << self
    def get_remit(start_dt, end_dt, volt)
      if volt == "centrali"
        pipeline = set_pipeline_centrali(start_dt, end_dt)
        remit_result = DB[:remit_centrali].aggregate(pipeline).allow_disk_use(true).to_a
        features = features_centrali(remit_result)
      else
        pipeline = set_pipeline_linee(start_dt, end_dt, volt)
        remit_result = DB[:remit_linee].aggregate(pipeline).allow_disk_use(true).to_a
        features = features_linee(remit_result, volt)
      end
      return {"type" => "FeatureCollection", "features" => features}
    end

    def features_linee(remit_result, volt)
      Parallel.map(remit_result, in_threads: 4) do |x|
        feature = {}
        id_transmission = x["id_transmission"]
        feature["type"] = "Feature"
        feature["properties"] = {}
        feature["properties"]["nome"] = x["nome"]
        # feature["properties"]["volt"]     = x["volt"]
        feature["properties"]["update"] = x["dt_upd"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["start"] = x["start_dt"].strftime("%d-%m-%Y %H:%M")
        feature["properties"]["end"] = x["end_dt"].strftime("%d-%m-%Y %H:%M")
        feature["geometry"] = MAPBOX.send("linee_#{volt}").detect { |f| f["id"] == id_transmission }["geometry"]
        feature
      end
    end
    
    def features_centrali(remit_result)
      Parallel.map(remit_result, in_threads: 4) do |x|
        feature = {}
        etso = x["etso"]
        mapbox_feature = MAPBOX.centrali.detect { |f| f["properties"]["etso"] == etso }
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
    end

    def set_pipeline_centrali(start_dt, end_dt)
      pipeline = []
      pipeline << {:$match => {"event_status":  /.*active.*/i}}
      # pipeline << {:$match => {"dt_upd": {:$lte => start_dt}, :$or => [{:$and => [{"dt_start": {:$gte => start_dt}}, {"dt_start": {:$lte => end_dt}}]}, {"dt_start": {:$lte => start_dt}, "dt_end": {:$gte => start_dt}}]}}
      pipeline << {:$match => {"dt_start": {:$lte => end_dt}, "dt_end": {:$gte => start_dt}}}
      pipeline << {"$project": {
        "_id": 0,
        "etso": "$etso",
        "remit": "$unaviable_capacity",
        "dt_upd": "$dt_upd",
        "dt_start": "$dt_start",
        "dt_end": "$dt_end",
      }}
      return pipeline
    end

    def set_pipeline_linee(start_dt, end_dt, volt)
      pipeline = []
      pipeline << {:$match => {"dt_upd": {:$lte => start_dt}, "volt": volt}}
      pipeline << {:$match => {"start_dt": {:$lte => end_dt}, "end_dt": {:$gte => start_dt}}}
      pipeline << {:$group => {'_id': "$nome",
                               'dt_upd': {'$last': "$dt_upd"},
                               'nome': {'$first': "$nome"},
                               'volt': {'$first': "$volt"},
                               'start_dt': {'$first': "$start_dt"},
                               'end_dt': {'$first': "$end_dt"},
                               'reason': {'$first': "$reason"},
                               'id_transmission': {'$first': "$id_transmission"}}}
      return pipeline
    end
  end
end

