# frozen_string_literal: true

class Time
  def arrotonda(sec = 1)
    down = self - (to_i % sec)
    up = down + sec

    difference_down = self - down
    difference_up = up - self

    if difference_down < difference_up
      return down
    else
      return up
    end
  end
end

class Report
  class << self
    def get_report(type)
      # pipeline = set_pipeline(start_dt, end_dt)
      # aggragation_result = DB[:remit_centrali_last].aggregate(pipeline).allow_disk_use(true).to_a

      # tec_hourly = aggragation_result[0]["remit_tec_hourly"]
      # zona_hourly = aggragation_result[0]["remit_zona_hourly"]
      # tec_hourly = []
      # zona_hourly = []
      # threads = []
      # threads << Thread.new do
      # tec_hourly = DB[:remit_centrali_hourly_tecologia].aggregate(pipeline_hourly_tecologia(start_dt, end_dt)).allow_disk_use(true).to_a
      # end
      # threads << Thread.new do
      # zona_hourly = DB[:remit_centrali_hourly_zona].aggregate(pipeline_hourly_zona(start_dt, end_dt)).allow_disk_use(true).to_a
      # end
      # threads.each do |t|
      #   t.join
      # end
      # tec_hourly = DB[:remit_centrali_hourly_tecologia].aggregate(pipeline_hourly_tecologia(start_dt, end_dt)).allow_disk_use(true).to_a
      # zona_hourly = DB[:remit_centrali_hourly_zona].aggregate(pipeline_hourly_zona(start_dt, end_dt)).allow_disk_use(true).to_a
      # remit_tec_daily, remit_zona_daily = remit_daily(tec_hourly, zona_hourly)
      # remit = {}
      # remit[:tec_hourly] = tec_hourly
      # remit[:zona_hourly] = zona_hourly
      # remit[:tec_daily] = remit_tec_daily
      # remit[:zona_daily] = remit_zona_daily
      collection = case type
                  when "tecnologia"
                    DB[:remit_centrali_daily_tecologia].aggregate(pipeline_daily_tecologia()).allow_disk_use(true).to_a
                  when "zona"
                    DB[:remit_centrali_daily_zona].aggregate(pipeline_daily_zona()).allow_disk_use(true).to_a
                  when "tecnologia_giornaliero"
                    DB[:remit_centrali_hourly_tecologia].aggregate(pipeline_hourly_tecologia()).allow_disk_use(true).to_a
                  when "zona_giornaliero"
                    DB[:remit_centrali_hourly_zona].aggregate(pipeline_hourly_zona()).allow_disk_use(true).to_a
                  else
                    "Errore"
                  end
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

