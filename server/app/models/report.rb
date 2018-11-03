# frozen_string_literal: true

class Report < Mongodb
  mattr :cache_centrali_tecnologia_daily
  mattr :cache_centrali_zona_daily
  mattr :cache_centrali_tecnologia_hourly
  mattr :cache_centrali_zona_hourly

  class << self

    def initialize_cache
      @@cache_centrali_tecnologia_daily = get_report("centrali_tecnologia_daily")
      @@cache_centrali_zona_daily = get_report("centrali_zona_daily")
      @@cache_centrali_tecnologia_hourly = get_report("centrali_tecnologia_hourly")
      @@cache_centrali_zona_hourly = get_report("centrali_zona_hourly")
    end

    def get_report(type)
      collection = case type
                  when "centrali_tecnologia_daily"
                    client[:remit_centrali_daily_tecologia].aggregate(pipeline_daily_tecologia()).allow_disk_use(true).to_a
                  when "centrali_zona_daily"
                    client[:remit_centrali_daily_zona].aggregate(pipeline_daily_zona()).allow_disk_use(true).to_a
                  when "centrali_tecnologia_hourly"
                    client[:remit_centrali_hourly_tecologia].aggregate(pipeline_hourly_tecologia()).allow_disk_use(true).to_a
                  when "centrali_zona_hourly"
                    client[:remit_centrali_hourly_zona].aggregate(pipeline_hourly_zona()).allow_disk_use(true).to_a
                  else
                    "Errore"
                  end
      return "cache #{type} non trovata" if collection == "Errore"

      collection.inject({}) do |r, s| r.merge!({s["data"] => s.dup{|x| x.delete("data")}.to_json }) end
   
      # remit = {}
      # remit[:tec_hourly] = DB[:remit_centrali_hourly_tecologia].aggregate(pipeline_hourly_tecologia(start_dt, end_dt)).allow_disk_use(true).to_a
      # remit[:zona_hourly] = DB[:remit_centrali_hourly_zona].aggregate(pipeline_hourly_zona(start_dt, end_dt)).allow_disk_use(true).to_a
      # remit[:tec_daily] = DB[:remit_centrali_daily_tecologia].aggregate(pipeline_daily_tecologia(start_dt, end_dt)).allow_disk_use(true).to_a
      # remit[:zona_daily] = DB[:remit_centrali_daily_zona].aggregate(pipeline_daily_zona(start_dt, end_dt)).allow_disk_use(true).to_a

      # remit
    end

    def pipeline_hourly_tecologia()
      pipeline = []
      # pipeline << {:$match => {"event_status": "Active"}}
      # pipeline << {:$match => {"dt_start": {:$lte => end_dt}, "dt_end": {:$gte => start_dt}}}
      # pipeline << {
      #   "$match": {
      #     "$and": [
      #       {
      #         "dataTime": {
      #           "$lte": end_dt,
      #         },
      #       }, {
      #         "dataTime": {
      #           "$gte": start_dt,
      #         },
      #       },
      #     ],
      #   },
      # }
      pipeline << {
        "$project": {
          _id: 0,
          data: {"$dateToString": {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$dataTime",
            timezone: "Europe/Rome",
          }},
          termico: "$termico",
          pompaggio: "$pompaggio",
          autoproduttore: "$autoproduttore",
          idrico: "$idrico",
          eolico: "$eolico",
          solare: "$solare",
          geotermico: "$geotermico",
        },
      }
    end

    def pipeline_hourly_zona()
      pipeline = []
      # pipeline << {:$match => {"event_status": "Active"}}
      # pipeline << {:$match => {"dt_start": {:$lte => end_dt}, "dt_end": {:$gte => start_dt}}}
      # pipeline << {
      #   "$match": {
      #     "$and": [
      #       {
      #         "dataTime": {
      #           "$lte": end_dt,
      #         },
      #       }, {
      #         "dataTime": {
      #           "$gte": start_dt,
      #         },
      #       },
      #     ],
      #   },
      # }
      pipeline << {
        "$project": {
          _id: 0,
          data: {"$dateToString": {
            format: "%Y-%m-%d %H:%M:%S",
            date: "$dataTime",
            timezone: "Europe/Rome",
          }},
          brnn: "$brnn",
          cnor: "$cnor",
          csud: "$csud",
          fogn: "$fogn",
          nord: "$nord",
          prgp: "$prgp",
          rosn: "$rosn",
          sard: "$sard",
          sici: "$sici",
          sud: "$sud",
        },
      }
    end

    def pipeline_daily_zona()
      pipeline = []
      # pipeline << {:$match => {"event_status": "Active"}}
      # pipeline << {:$match => {"dt_start": {:$lte => end_dt}, "dt_end": {:$gte => start_dt}}}
      # pipeline << {
      #   "$match": {
      #     "$and": [
      #       {
      #         "dataTime": {
      #           "$lte": end_dt,
      #         },
      #       }, {
      #         "dataTime": {
      #           "$gte": start_dt,
      #         },
      #       },
      #     ],
      #   },
      # }
      pipeline << {
        "$project": {
          _id: 0,
          data: {"$dateToString": {
            format: "%Y-%m-%d",
            date: "$dataTime",
          # timezone: "Europe/Rome",
          }},
          brnn: "$brnn",
          cnor: "$cnor",
          csud: "$csud",
          fogn: "$fogn",
          nord: "$nord",
          prgp: "$prgp",
          rosn: "$rosn",
          sard: "$sard",
          sici: "$sici",
          sud: "$sud",
        },
      }
    end

    def pipeline_daily_tecologia()
      pipeline = []
      # pipeline << {:$match => {"event_status": "Active"}}
      # pipeline << {:$match => {"dt_start": {:$lte => end_dt}, "dt_end": {:$gte => start_dt}}}
      # pipeline << {
      #   "$match": {
      #     "$and": [
      #       {
      #         "dataTime": {
      #           "$lte": end_dt,
      #         },
      #       }, {
      #         "dataTime": {
      #           "$gte": start_dt,
      #         },
      #       },
      #     ],
      #   },
      # }
      pipeline << {
        "$project": {
          _id: 0,
          data: {"$dateToString": {
            format: "%Y-%m-%d",
            date: "$dataTime",
          # timezone: "Europe/Rome",
          }},
          termico: "$termico",
          pompaggio: "$pompaggio",
          autoproduttore: "$autoproduttore",
          idrico: "$idrico",
          eolico: "$eolico",
          solare: "$solare",
          geotermico: "$geotermico",
        },
      }
    end
  end
end

