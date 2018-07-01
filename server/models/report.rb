# frozen_string_literal: true

class Report
  class << self
    def get_report(start_dt, end_dt)
      pipeline = set_pipeline(start_dt, end_dt)
      aggragation_result = DB[:remit_centrali].aggregate(pipeline).allow_disk_use(true).to_a
      serialize = serialize(aggragation_result, start_dt, end_dt)
      return serialize
    end

    def get_report_zona(start_dt, end_dt)
      pipeline = set_pipeline(start_dt, end_dt)
      aggragation_result = DB[:remit_centrali].aggregate(pipeline).allow_disk_use(true).to_a
      serialize = serialize_zona(aggragation_result, start_dt, end_dt)
      return serialize
    end

    def serialize(aggragation_result, start_dt, end_dt)
      Parallel.each(aggragation_result, in_threads: 8) do |x|
        mapbox_feature = MAPBOX.centrali.lazy.select { |f| f["properties"]["etso"] == x["etso"] }.first
        x.merge!("tipo" => mapbox_feature["properties"]["tipo"])
        x["dt_start"] = x["dt_start"].to_date
        x["dt_end"] = x["dt_end"].to_date
      end

      result = []
      start_dt.upto(end_dt) do |date|
        aggregation_step = {data: "", termico: [], pompaggio: [], autoproduttore: [], idrico: [], eolico: [], solare: [], geotermico: []}
        aggregation_step[:data] = date
        aggragation_result.each do |remit|
          if date.between?(remit["dt_start"], remit["dt_end"])
            aggregation_step[remit["tipo"].downcase.to_sym].push(remit["remit"])
          end
        end
        aggregation_step.each do |key, value|
          if key != :data
            aggregation_step[key] = aggregation_step[key].empty? ? nil : aggregation_step[key].sum.to_i
          end
        end
        result << aggregation_step
      end
      return result
    end

    def serialize_zona(aggragation_result, start_dt, end_dt)
      Parallel.each(aggragation_result, in_threads: 8) do |x|
        mapbox_feature = MAPBOX.centrali.lazy.select { |f| f["properties"]["etso"] == x["etso"] }.first
        x.merge!("zona" => mapbox_feature["properties"]["zona"])
        x["dt_start"] = x["dt_start"].to_date
        x["dt_end"] = x["dt_end"].to_date
      end

      result = []
      start_dt.upto(end_dt) do |date|
        aggregation_step = {data: "", brnn: [], cnor: [], csud: [], fogn: [], nord: [], prgp: [], rosn: [], sard: [], sici: [], sud: []}
        aggregation_step[:data] = date
        aggragation_result.each do |remit|
          if date.between?(remit["dt_start"], remit["dt_end"])
            aggregation_step[remit["zona"].downcase.to_sym].push(remit["remit"])
          end
        end
        aggregation_step.each do |key, value|
          if key != :data
            aggregation_step[key] = aggregation_step[key].empty? ? 0 : aggregation_step[key].sum.to_i
          end
        end
        result << aggregation_step
      end
      return result
    end

    def set_pipeline(start_dt, end_dt)
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
      return pipeline
    end

  end
end

