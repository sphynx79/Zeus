#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

require_glob APP_ROOT.to_s + "/app/jobs/*.rb"

class Scheduler
  class << self
    include Logging

    def jobs
       @@jobs ||= [UpdateCacheReport.new, UpdateCacheRemit.new, UpdateCacheUnits.new]
    end

    def start
      jobs.each do |job|
        task = job.init
        task.execute
      end
    end

  end

end
Scheduler.start

# class Scheduler
#   class << self
#     include Logging

#     def jobs
#       @@jobs ||= [UpdateCacheReport.new, UpdateCacheUnits.new]
#     end

#     def start
#       scheduler = Rufus::Scheduler.new(frequency: "20s")
#       def scheduler.on_error(job, error)
#         warn("intercepted error in #{job.id}: #{error.message}")
#       end
#       jobs.each do |job|
#         Thread.new {
#           sleep 7
#           start_job(job)
#         }
#         scheduler.every job.time_interval, :timeout => job.timeout, :tag => job.description do
#           start_job(job)
#         end
#       end
#     end

#     def start_job(job)
#       if job.call
#         info job.description + "   [PASSED]"
#       else
#         error job.description + "   [FAILED]"
#         puts "Message: #{job.failed.message}"
#         puts "Backtrace:\n\t#{job.failed.backtrace.join("\n\t")}"
#       end
#     end
#   end
# end

# Scheduler.start

# class Scheduler2
#   class << self
#     include Logging

#     def jobs
#       @@jobs ||= [UpdateCacheReport.new]
#       # @@jobs ||= [UpdateCacheRemit.new ]
#     end

#     def start
#       jobs.each do |job|
#         cache_id = job.name.to_sym
#         Caddy[cache_id].refresher = -> { job.call }
#         Caddy[cache_id].refresh_interval = job.time_interval
#         Caddy[cache_id].error_handler = -> (exception) {  
#           Logging.logger.warn  job.description
#           puts "Message:\n\t#{exception.message}"
#           puts "Backtrace:\n\t#{exception.backtrace.join("\n\t")}"
#         }
#       end
#       Caddy.logger = Logging.logger
#       Caddy.start
#     end
#   end
# end

# Scheduler2.start

