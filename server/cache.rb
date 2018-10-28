#!/usr/bin/env ruby
# Encoding: utf-8
# warn_indent: true
# frozen_string_literal: true

ENV['TZ'] = 'Europe/Rome'

$logger = Logger.new(STDOUT)
$logger.level = Logger::DEBUG

$logger.formatter = proc do |severity, datetime, _progname, msg|
  "#{severity[0]}, [#{datetime.strftime('%d-%m-%Y %X')}] [#{severity}] -- : #{msg}\n"
  # string = "#{datetime.strftime('%d-%m-%Y %X')} --[#{severity}]-- : #{msg}\n"
  # case severity
  # when 'DEBUG'
  #   $pastel.cyan.bold(string)
  # when 'WARN'
  #   $pastel.magenta.bold(string)
  # when 'INFO'
  #   $pastel.green.bold(string)
  # when 'ERROR'
  #   $pastel.red.bold(string)
  # when 'FATAL'
  #   $pastel.yellow.bold(string)
  # else
  #   $pastel.blue(string)
  # end
end

class Module
  def redefine_const(name, value)

    __send__(:remove_const, name) if const_defined?(name)

    const_set(name, value)

  end
end


class Handler
  attr_reader :action

  def initialize(action: nil)
    @action = action
  end

  def call(job)
    # $logger.info "#{job} at #{Time.now}"
    start_task(job)
  rescue Rufus::Scheduler::TimeoutError
    $logger.warn 'Sono andato in Timeout'
  end

  def start_task(job)
      $logger.info "Start task #{action}:"
      Object.redefine_const(:CACHE_TEC_DAILY, Report.get_report("tecnologia"))
      Object.redefine_const(:CACHE_ZONA_DAILY, Report.get_report("zona"))
      Object.redefine_const(:CACHE_TEC_HOURLY, Report.get_report("tecnologia_giornaliero"))
      Object.redefine_const(:CACHE_ZONA_HOURLY, Report.get_report("zona_giornaliero"))
  end
end

scheduler = Rufus::Scheduler.new(frequency: '20s')

def scheduler.on_error(job, error)
  $logger.warn("intercepted error in #{job.id}: #{error.message}")
end

$logger.info 'Start Scheduler'

report = Handler.new(action: 'update_report')
report.call(true)

scheduler.every('2m', report, :timeout => '10m', :tag  => 'Update Report')
