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
    def get_report(start_dt, end_dt)
      pipeline = set_pipeline(start_dt, end_dt)
      aggragation_result = DB[:remit_centrali].aggregate(pipeline).allow_disk_use(true).to_a

      tec_hourly = aggragation_result[0]["remit_tec_hourly"]
      zona_hourly = aggragation_result[0]["remit_zona_hourly"]
      remit_tec_daily, remit_zona_daily = remit_daily(tec_hourly, zona_hourly)

      remit = {}
      remit[:tec_hourly] = tec_hourly
      remit[:zona_hourly] = zona_hourly
      remit[:tec_daily] = remit_tec_daily
      remit[:zona_daily] = remit_zona_daily

      remit
    end

    def remit_daily(remit_tec_hourly, remit_zona_hourly)
      remit_tec_daily = aggragate_by_day_and_sum(remit_tec_hourly)
      remit_zona_daily = aggragate_by_day_and_sum(remit_zona_hourly)
      return [remit_tec_daily, remit_zona_daily]
    end

    def aggragate_by_day_and_sum(remit)
      remit = remit.group_by { |h| h[:data][0..-10] }.values
      keys = remit[0].first.keys.drop(1)
      remit.map! { |first, *rest|
        if rest.empty?
          first
        else
          first.dup.tap do |sum|
            rest.each { |h| keys.each { |k| sum[k] += h[k] } }
            keys.each { |k| sum[k] = (sum[k] / 24).to_i }
            sum[:data] = sum[:data][0..-10]
          end
        end
      }
      remit
    end

    def set_pipeline(start_dt, end_dt)
      pipeline = []
      # pipeline << {:$match => {"event_status": "Active"}}
      # pipeline << {:$match => {"dt_start": {:$lte => end_dt}, "dt_end": {:$gte => start_dt}}}
      pipeline << {
        "$match": {
          "$and": [{
            "event_status": {
              "$eq": "Active",
            },
          },
                   {
            "dt_start": {
              "$lte": end_dt,
            },
          }, {
            "dt_end": {
              "$gte": start_dt,
            },
          }],
        },
      }

      pipeline << {
        "$unwind": "$days",
      }

      pipeline << {
        "$project": {
          _id: 0,
          msg_id: 1,
          etso: 1,
          zona: 1,
          tipo: 1,
          dt_upd: 1,
          dt_start: 1,
          dt_end: 1,
          hours: "$days.hours",
        },
      }

      pipeline << {
        "$unwind": "$hours",
      }

      pipeline << {
        "$match": {
          "hours.data_hour": {
            "$gte": start_dt,
            "$lte": end_dt,
          },
        },
      }

      pipeline << {
        "$match": {
          "hours.last": 1,
        },
      }

      pipeline << {
            "$facet": {
                remit_tec_hourly: [{
                        "$group": {
                            _id: {
                                dateTime: "$hours.data_hour",
                                tipo: '$tipo'
                            },
                            totalremit: {
                                "$sum": "$hours.remit"
                            },
                        }
                    },
                    {
                        "$group": {
                            "_id": "$_id.dateTime",
                            "tipo": {
                                "$push": {
                                    k: "$_id.tipo",
                                    v: "$totalremit"
                                },
                            },
                        }
                    },
                    {
                        "$replaceRoot": {
                            "newRoot": {
                                "$mergeObjects": [{
                                        "$arrayToObject": "$tipo"
                                    },
                                    "$$ROOT"
                                ]
                            }
                        }
                    },
                    {"$sort": { "_id": 1}},
                    {
                        "$project": {
                            _id: 0,
                            data: { "$dateToString": {
                                      format: "%Y-%m-%d %H:%M:%S",
                                      date: "$_id",
                                      timezone: "Europe/Rome"
                                  }
                            },
                            termico: {
                                "$ifNull": ["$TERMICO", 0]
                            },
                            pompaggio: {
                                "$ifNull": ["$POMPAGGIO", 0]
                            },
                            autoproduttore: {
                                "$ifNull": ["$AUTOPRODUTTORE", 0]
                            },
                            idrico: {
                                "$ifNull": ["$IDRICO", 0]
                            },
                            eolico: {
                                "$ifNull": ["$EOLICO", 0]
                            },
                            solare: {
                                "$ifNull": ["$SOLARE", 0]
                            },
                            geotermico: {
                                "$ifNull": ["$GEOTERMICO", 0]
                            },
                        }
                    }
                ],
                remit_zona_hourly: [{
                        "$group": {
                            _id: {
                                dateTime: "$hours.data_hour",
                                zona: '$zona'
                            },
                            totalremit: {
                                "$sum": "$hours.remit"
                            },
                        }
                    },
                    {
                        "$group": {
                            "_id": "$_id.dateTime",
                            "zona": {
                                "$push": {
                                    k: "$_id.zona",
                                    v: "$totalremit"
                                },
                            },
                        }
                    },
                    {
                        "$replaceRoot": {
                            "newRoot": {
                                "$mergeObjects": [{
                                        "$arrayToObject": "$zona"
                                    },
                                    "$$ROOT"
                                ]
                            }
                        }
                    },
                    {"$sort": { "_id": 1}},
                    {
                        "$project": {
                            _id: 0,
                            data: { "$dateToString": {
                                      format: "%Y-%m-%d %H:%M:%S",
                                      date: "$_id",
                                      timezone: "Europe/Rome"
                                  }
                            },
                            brnn: {
                                "$ifNull": ["$BRNN", 0]
                            },
                            cnor: {
                                "$ifNull": ["$CNOR", 0]
                            },
                            csud: {
                                "$ifNull": ["$CSUD", 0]
                            },
                            fogn: {
                                "$ifNull": ["$FOGN", 0]
                            },
                            nord: {
                                "$ifNull": ["$NORD", 0]
                            },
                            prgp: {
                                "$ifNull": ["$PRGP", 0]
                            },
                            rosn: {
                                "$ifNull": ["$ROSN", 0]
                            },
                            sard: {
                                "$ifNull": ["$SARD", 0]
                            },
                            sici: {
                                "$ifNull": ["$SICI", 0]
                            },
                            sud: {
                                "$ifNull": ["$SUD", 0]
                            },
                        }
                    }
                ]
            }
        }

      # pipeline << {"$project": {
      #   "_id": 0,
      #   # "msg_id": "$msg_id",
      #   # "etso": "$etso",
      #   # "tipo": "$tipo",
      #   # "zona": "$zona",
      #   # "remit": "$unaviable_capacity",
      #   # "dt_upd": "$dt_upd",
      #   # "dt_start": "$dt_start",
      #   # "dt_end": "$dt_end",
      # }}
      pipeline
    end
  end
end

