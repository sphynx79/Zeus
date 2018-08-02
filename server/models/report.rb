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
    def get_report(start_dt, end_dt, type)
      pipeline = set_pipeline(start_dt, end_dt)
      aggragation_result = DB[:remit_centrali].aggregate(pipeline).allow_disk_use(true).to_a

      serialize = case type
                  when "tecnologia"
                    serialize_tecnologia(aggragation_result, start_dt, end_dt)
                  when "zona"
                    serialize_zona(aggragation_result, start_dt, end_dt)
                  when "tecnologia_giornaliero"
                    serialize_giornaliero_tecnologia(aggragation_result, start_dt, end_dt)
                  when "zona_giornaliero"
                    serialize_giornaliero_zona(aggragation_result, start_dt, end_dt)
                  else
                    "Errore"
                  end
      serialize
    end

    def serialize_tecnologia(aggragation_result, start_dt, end_dt)
      # range_input = TimeRange.new(start_dt, end_dt)
      # r = {}
      # aggragation_result.each do |remit|
      #   range_remit = TimeRange.new(remit["dt_start"], remit["dt_end"])
      #   days = range_input.overlap_with(range_remit).dates

      #   days.each do |day|
      #     day = day.strftime("%Y-%m-%d")
      #     r[day] ||= {termico: 0, pompaggio: 0, autoproduttore: 0, idrico: 0, eolico: 0, solare: 0, geotermico: 0}
      #     r[day][remit["tipo"].downcase.to_sym] += remit["remit"].to_i
      #   end
      # end
      # result = r.map { |k, v| {data: k}.merge(v) }.sort_by! { |remit| remit[:data] }
      # result
      # r
      range_input = TimeRange.new(start_dt, end_dt)
      r = {}
      aggragation_result.each do |remit|
        range_remit = TimeRange.new(remit["dt_start"], remit["dt_end"])
        days = range_input.overlap_with(range_remit).dates

        days.each do |day|
          day = day.strftime("%Y-%m-%d")
          r[day] ||= {termico: {}, pompaggio: {}, autoproduttore: {}, idrico: {}, eolico: {}, solare: {}, geotermico: {}}
          tipo = remit["tipo"].downcase.to_sym
          etso = remit["etso"]
          r_tipo = r[day][tipo]
          r_tipo[etso] ||= remit["remit"].to_i
          # if r_zona.key?(etso)
          #   r_zona[etso].push(remit["remit"].to_i)
          # else
          #   r_zona[etso] = [remit["remit"].to_i]
          # end
        end
      end
      result = r.map do |k, v|
        j =  {}
        v.each do |k,v|
          j[k] = v.values.sum
        end
        {data: k}.merge(j) 
      end.sort_by! { |remit| remit[:data] }
      result
    end

    def serialize_zona(aggragation_result, start_dt, end_dt)
      range_input = TimeRange.new(start_dt, end_dt)
      r = {}
      aggragation_result.each do |remit|
        range_remit = TimeRange.new(remit["dt_start"], remit["dt_end"])
        days = range_input.overlap_with(range_remit).dates

        days.each do |day|
          day = day.strftime("%Y-%m-%d")
          r[day] ||= {brnn: {}, cnor: {}, csud: {}, fogn: {}, nord: {}, prgp: {}, rosn: {}, sard: {}, sici: {}, sud: {}}
          # r[day][remit["zona"].downcase.to_sym][remit["etso"].downcase.to_sym] ||= [remit["remit"].to_i]
          zona = remit["zona"].downcase.to_sym
          etso = remit["etso"]
          r_zona = r[day][zona]
          r_zona[etso] ||= remit["remit"].to_i

          # if r_zona.key?(etso)
          #   r_zona[etso].push(remit["remit"].to_i)
          # else
          #   r_zona[etso] = [remit["remit"].to_i]
          # end
        end
      end
      result = r.map do |k, v|
        j =  {}
        v.each do |k,v|
          j[k] = v.values.sum
        end
        {data: k}.merge(j) 
      end.sort_by! { |remit| remit[:data] }
      result
    end

    def serialize_giornaliero_tecnologia(aggragation_result, start_dt, end_dt)
      range_input = TimeRange.new(start_dt, end_dt)

      r = {}
      aggragation_result.each do |remit|
        start_dt_round = remit["dt_start"].arrotonda(60.minutes)
        end_dt_round = remit["dt_end"].arrotonda(60.minutes) - 1
        start_dt_round < end_dt_round ? (range_remit = TimeRange.new(start_dt_round, end_dt_round)) : next
        # range_remit = TimeRange.new(remit["dt_start"].arrotonda(60.minutes), remit["dt_end"].arrotonda(60.minutes) - 1)
        days = range_input.overlap_with(range_remit)
        next if days.nil?
        min_dt = days.min
        max_dt = days.max

        step = min_dt
        begin
          hour = step.hour + 1
          hour = hour < 10 ? "0#{hour}" : hour
          datetime = step.strftime("%Y-%m-%d #{hour}")
          r[datetime] ||= {termico: 0, pompaggio: 0, autoproduttore: 0, idrico: 0, eolico: 0, solare: 0, geotermico: 0}
          r[datetime][remit["tipo"].downcase.to_sym] += remit["remit"].to_i
        end while (step += 3600) <= max_dt
      end
      result = r.map { |k, v| {data: k}.merge(v) }.sort_by! { |remit| remit[:data] }

      result
    end

    def serialize_giornaliero_zona(aggragation_result, start_dt, end_dt)
      range_input = TimeRange.new(start_dt, end_dt)

      r = {}
      aggragation_result.each do |remit|
        start_dt_round = remit["dt_start"].arrotonda(60.minutes)
        end_dt_round = remit["dt_end"].arrotonda(60.minutes) - 1
        start_dt_round < end_dt_round ? (range_remit = TimeRange.new(start_dt_round, end_dt_round)) : next
        days = range_input.overlap_with(range_remit)
        next if days.nil?
        min_dt = days.min
        max_dt = days.max

        step = min_dt
        begin
          hour = step.hour + 1
          hour = hour < 10 ? "0#{hour}" : hour
          datetime = step.strftime("%Y-%m-%d #{hour}")
          r[datetime] ||= {brnn: 0, cnor: 0, csud: 0, fogn: 0, nord: 0, prgp: 0, rosn: 0, sard: 0, sici: 0, sud: 0}
          r[datetime][remit["zona"].downcase.to_sym] += remit["remit"].to_i
        end while (step += 3600) <= max_dt
      end
      result = r.map { |k, v| {data: k}.merge(v) }.sort_by! { |remit| remit[:data] }

      result
    end

    def set_pipeline(start_dt, end_dt)
      pipeline = []
      pipeline << {:$match => {"event_status":  /.*active.*/i}}
      # pipeline << {:$match => {"dt_upd": {:$lte => start_dt}, :$or => [{:$and => [{"dt_start": {:$gte => start_dt}}, {"dt_start": {:$lte => end_dt}}]}, {"dt_start": {:$lte => start_dt}, "dt_end": {:$gte => start_dt}}]}}
      # pipeline << {:$match => {:$or => [{:$and => [{"dt_start": {:$gte => start_dt}}, {"dt_start": {:$lte => end_dt}}]},  {:$and => [{"dt_start": {:$lte => start_dt}, "dt_end": {:$gte => start_dt}}]}]}}
      pipeline << {:$match => {"dt_start": {:$lte => end_dt}, "dt_end": {:$gte => start_dt}}}

      pipeline << {"$project": {
        "_id": 0,
        "etso": "$etso",
        "tipo": "$tipo",
        "zona": "$zona",
        "remit": "$unaviable_capacity",
        "dt_start": "$dt_start",
        "dt_end": "$dt_end",
      }}
      pipeline
    end
  end
end

