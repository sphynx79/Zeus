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

Concurrent::ScheduledTask.execute(2) do
  Scheduler.start
end

