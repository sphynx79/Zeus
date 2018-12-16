# frozen_string_literal: true

class Report < Mongodb

  class << self

    def initialize_cache
      cache = {}
      cache[:cache_centrali_tecnologia_daily] = set_cache("centrali_tecnologia_daily") 
      cache[:cache_centrali_zona_daily] = set_cache("centrali_zona_daily")
      cache[:cache_centrali_tecnologia_hourly] = set_cache("centrali_tecnologia_hourly")
      cache[:cache_centrali_zona_hourly] = set_cache("centrali_zona_hourly")
      return cache
    end

    def set_cache(type)
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
            # dentro il db è gia in timezone italiano 30-08-2018 00:00:00
            # quando ho creato la collection per questo report, ho già raggrappato le ore 
            # del giorno con il timezone italiano vedere il programma che scarica le remit centrali
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
            # dentro il db è gia in timezone italiano 30-08-2018 00:00:00
            # quando ho creato la collection per questo report, ho già raggrappato le ore 
            # del giorno con il timezone italiano vedere il programma che scarica le remit centrali
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
            # la metto in timezone italiano perchè nel db è in utc, 
            # ma la mia cache deve avere il formato italiano
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
            # la metto in timezone italiano perchè nel db è in utc, 
            # ma la mia cache deve avere il formato italiano
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

  end
end

