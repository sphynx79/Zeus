#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

require_glob APP_ROOT.to_s + "/app/jobs/*.rb"

class Scheduler
  class << self
    include Logging

    def jobs
      @@jobs ||= [UpdateCacheReport.new, UpdateCacheUnits.new]
    end

    def start
      scheduler = Rufus::Scheduler.new(frequency: "20s")
      def scheduler.on_error(job, error)
        warn("intercepted error in #{job.id}: #{error.message}")
      end
      jobs.each do |job|
        Thread.new {
          sleep 7
          start_job(job)
        }
        scheduler.every job.time_interval, :timeout => job.timeout, :tag => job.description do
          start_job(job)
        end
      end
    end

    def start_job(job)
      if job.call
        info job.description + "   [PASSED]"
      else
        error job.description + "   [FAILED]"
        puts "Message: #{job.failed.message}"
        puts "Backtrace:\n\t#{job.failed.backtrace.join("\n\t")}"
      end
    end
  end
end

Scheduler.start

