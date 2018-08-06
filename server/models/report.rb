# frozen_string_literal: true

require "csv"

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

      remit_hourly = split_in_hours(aggragation_result, start_dt, end_dt)

      group_by_datetime = remit_hourly.group_by { |x| x["datetime"] }

      remit = {}
      remit_tec_hourly, remit_zona_hourly = remit_hourly(group_by_datetime)
      remit_tec_daily, remit_zona_daily = remit_daily(remit_tec_hourly, remit_zona_hourly)

      remit[:tec_hourly] = remit_tec_hourly
      remit[:zona_hourly] = remit_zona_hourly
      remit[:tec_daily] = remit_tec_daily
      remit[:zona_daily] = remit_zona_daily
      
      remit
    end

    def split_in_hours(aggragation_result, start_dt, end_dt)
      range_input = TimeRange.new(start_dt, end_dt)
      split_in_hour = []
      aggragation_result.each do |remit|
        start_dt_round = remit["dt_start"].arrotonda(60.minutes)
        end_dt_round = remit["dt_end"].arrotonda(60.minutes) - 1
        start_dt_round < end_dt_round ? (range_remit = TimeRange.new(start_dt_round, end_dt_round)) : next
        days = range_input.overlap_with(range_remit)
        next if days.nil?
        min_dt = days.min
        max_dt = days.max

        datetime = min_dt
        remit_tmp = remit.dup
        remit_tmp["dt_start"] = remit_tmp["dt_start"].localtime.strftime("%Y-%m-%d %H:%M")
        remit_tmp["dt_end"] = remit_tmp["dt_end"].localtime.strftime("%Y-%m-%d %H:%M")
        remit_tmp["dt_upd"] = remit_tmp["dt_upd"].localtime.strftime("%Y-%m-%d %H:%M")
        begin
          localtime = datetime.localtime
          hour = localtime.hour + 1
          hour = hour < 10 ? "0#{hour}" : hour
          split_in_hour << remit_tmp.merge({"datetime" => localtime.strftime("%Y-%m-%d #{hour}")})
        end while (datetime += 3600) <= max_dt
      end
      split_in_hour.sort_by! { |r| [r["etso"], r["dt_upd"]] }.reverse!.uniq! { |y| [y["etso"], y["datetime"]] }
      return split_in_hour
    end

    def remit_hourly(group_by_datetime)
      remit_tec = {}
      remit_zona = {}
      group_by_datetime.map do |datatime, item|
        aggragate_by_type_and_sum("tipo", item, datatime, remit_tec)
        aggragate_by_type_and_sum("zona", item, datatime, remit_zona)
      end
      remit_tec = remit_tec.map { |k, v| {data: k}.merge(v) }.sort_by! { |remit| remit[:data] }
      remit_zona = remit_zona.map { |k, v| {data: k}.merge(v) }.sort_by! { |remit| remit[:data] }

      return [remit_tec, remit_zona]
    end

    def remit_daily(remit_tec_hourly, remit_zona_hourly)
      remit_tec_daily = aggragate_by_day_and_sum(remit_tec_hourly)
      remit_zona_daily = aggragate_by_day_and_sum(remit_zona_hourly)
      return [remit_tec_daily, remit_zona_daily]
    end

    def aggragate_by_day_and_sum(remit)
      remit = remit.group_by { |h| h[:data][0..-4] }.values
      keys = remit[0].first.keys.drop(1)
      remit.map! { |first, *rest|
        if rest.empty?
          first
        else
          first.dup.tap do |sum|
            rest.each { |h| keys.each { |k| sum[k] += h[k] } }
            keys.each { |k| sum[k] = (sum[k] / 24).to_i }
            sum[:data] = sum[:data][0..-4]
          end
        end
      }
      remit
    end

    def aggragate_by_type_and_sum(type, item, datatime, remit)
      if type == "tipo"
          remit[datatime] ||= {termico: 0, pompaggio: 0, autoproduttore: 0, idrico: 0, eolico: 0, solare: 0, geotermico: 0}
      else
          remit[datatime] ||= {brnn: 0, cnor: 0, csud: 0, fogn: 0, nord: 0, prgp: 0, rosn: 0, sard: 0, sici: 0, sud: 0}
      end
      item.group_by { |x| x[type] }.map do |type, rows_by_type|
        remit[datatime][type.downcase.to_sym] = rows_by_type.map { |h| h["remit"] }.sum
      end
    end

    def set_pipeline(start_dt, end_dt)
      pipeline = []
      pipeline << {:$match => {"event_status": /.*active.*/i}}
      # pipeline << {:$match => {"dt_upd": {:$lte => start_dt}, :$or => [{:$and => [{"dt_start": {:$gte => start_dt}}, {"dt_start": {:$lte => end_dt}}]}, {"dt_start": {:$lte => start_dt}, "dt_end": {:$gte => start_dt}}]}}
      # pipeline << {:$match => {:$or => [{:$and => [{"dt_start": {:$gte => start_dt}}, {"dt_start": {:$lte => end_dt}}]},  {:$and => [{"dt_start": {:$lte => start_dt}, "dt_end": {:$gte => start_dt}}]}]}}
      pipeline << {:$match => {"dt_start": {:$lte => end_dt}, "dt_end": {:$gte => start_dt}}}

      pipeline << {"$project": {
        "_id": 0,
        "msg_id": "$msg_id",
        "etso": "$etso",
        "tipo": "$tipo",
        "zona": "$zona",
        "remit": "$unaviable_capacity",
        "dt_upd": "$dt_upd",
        "dt_start": "$dt_start",
        "dt_end": "$dt_end",
      }}
      pipeline
    end
  end
end

