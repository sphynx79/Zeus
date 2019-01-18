# frozen_string_literal: true

class Report < Mongodb
  cattr :cache
  cattr :expiration_time

  class << self
    def refresh_cache(expiration_time: 240)
      @@cache           ||= {}
      @@task            ||= {}
      @@expiration_time ||= expiration_time

      %i[centrali_tecnologia_daily centrali_zona_daily centrali_tecnologia_hourly centrali_zona_hourly].each do |cache_type|
        around_before, around_after = (cache_type.to_s.include? 'daily') ?  [30,15] : [15,7]
        @@cache[cache_type] ||= Hash.new do |_hash, key|
          # puts 'did not find key in cache, fetch from db ...'
          # @@task[cache_type] ||= Concurrent::Future.new do
          @@task[cache_type] ||= Concurrent::ScheduledTask.new(5) do
              date_time = (cache_type.to_s.include? 'daily') ? DateTime.strptime(key, '%d-%m-%Y') : DateTime.strptime(key, '%d-%m-%Y %H:%M:%S')
              refresh_cache_around_day(data: date_time, cache_type: cache_type, keep_old: true, keep_day: false, around_before: around_before, around_after: around_after)
          end
          @@task[cache_type].execute unless @@task[cache_type].pending?
          @@cache[cache_type][key] = { value: fetch_from_db(key, cache_type), expiration_time: Time.now.to_i + @@expiration_time }
        end
        Concurrent::Promise.new{refresh_cache_around_today(cache_type)}.then{delete_expired_key(cache_type) }.execute
      end
    end

    def refresh_cache_around_day(data: nil, cache_type: nil, keep_old: false, keep_day: false, around_before: 30, around_after: 30)
      step,
      data_parser = if cache_type.to_s.include? 'daily'
                       [1.0, '%d-%m-%Y']
                     else
                       [(1.0 / 24), '%d-%m-%Y %H:%M:%S']
                    end
      st_dt       = data - around_before
      end_dt      = data + around_after

      range_date = st_dt.step(end_dt, step).map { |e| e.strftime(data_parser) }
      range_date.delete_if { |x| x.include?(data.strftime('%d-%m-%Y')) } unless keep_day

      Parallel.each(range_date, in_threads: 8) do |key|
        remit = fetch_from_db(key, cache_type)
        next if remit.nil?
        if !keep_old || !@@cache[cache_type].key?(key)
          @@cache[cache_type][key] = { value: remit, expiration_time: Time.now.to_i + @@expiration_time }
        end
      end
    end

    def refresh_cache_around_today(cache_type)
      prima = Time.now
      puts "start refresh_cache_around_today #{cache_type}"
      around_before, around_after = (cache_type.to_s.include? 'daily') ?  [600,360] : [380,60] 
      refresh_cache_around_day(data: Date.today.to_datetime, cache_type: cache_type, keep_old: false, keep_day: true, around_before: around_before, around_after: around_after)
      puts "end refresh_cache_around_today #{cache_type}"
      puts Time.now - prima
    end

    def delete_expired_key(cache_type)
      # print "delete expired key to report\n"
      now = Time.now.to_i
      @@cache[cache_type].delete_if { |_, v| now > v[:expiration_time] }
    end

    def fetch_from_db(data, type)
      collection   = "remit_#{type}"
      pipeline     = [] << pipeline_match_date(data) << pipeline_project(type)
      remit_result = client[collection].aggregate(pipeline).allow_disk_use(true).to_a
      remit_result.empty? ? nil : Oj.dump(remit_result[0], mode: :compat)
    end

    def get_remit(cache: false, type: nil, **args)
      return @@cache[type][args[:data]][:value] if cache 
      collection   = "remit_#{type}"
      pipeline     = [] << pipeline_match_range_date(args[:st_dt], args[:end_dt]) << pipeline_project(type)
      client[collection].aggregate(pipeline).allow_disk_use(true).to_a
    end

    def pipeline_match_date(data)
      {
        "$match": { data: data }
      }
    end

    def pipeline_match_range_date(start_dt, end_dt)
      {
        "$match": {
          "$and": [
            {
              "dataTime": {
                "$lte": end_dt,
              },
            }, {
              "dataTime": {
                "$gte": start_dt,
              },
            },
          ],
        },
      }
    end

    def pipeline_project(type)
      format_data = (type.to_s.include? 'daily') ?  "%d-%m-%Y" : "%d-%m-%Y %H:%M:%S"
      if type.to_s.include? 'tecnologia'
       {
          "$project": {
            _id: 0,
            data: {"$dateToString": {
              format: format_data,
              date: "$dataTime",
              timezone: "Europe/Rome",
            }},
            termico:        "$termico",
            pompaggio:      "$pompaggio",
            autoproduttore: "$autoproduttore",
            idrico:         "$idrico",
            eolico:         "$eolico",
            solare:         "$solare",
            geotermico:     "$geotermico",
          }
        }
      else
        {
          "$project": {
            _id: 0,
            data: {"$dateToString": {
              format: format_data,
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
            sud:  "$sud",
          }
        }
      end
    end

  end
end
