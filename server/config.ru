# frozen_string_literal: true

require './server'

$stdout.sync = true

run(Server.freeze.app)
