# class QlikviewController < ApplicationController
#   map '/qlikview'
#  
#   get "/?:query?" do
#
#     zoom_level  = params['zoomlevel'] ? "zoomlevel=#{params['zoomlevel']}&" : "zoomlevel=6&"
#     center_lat  = params['centerlat'] ? "centerlat=#{params['centerlat']}&" : "centerlat=42&"
#     center_lon  = params['centerlon'] ? "centerlon=#{params['centerlon']}&" : "centerlon=11&"
#     data        = params['data']      ? "data=#{params['data']}&"           : "data=#{ (Date.today+1).strftime("%d-%m-%Y")}&"
#
#     content_type 'image/png'
#
#     sess = Patron::Session.new
#     sess.timeout = 15
#     sess.base_url = "http://localhost:8080"
#  
#     param = "/query?#{zoom_level}#{center_lat}#{center_lon}#{data}"
#     image = sess.get(param).body
#     decoded_image = Base64.decode64(image)
#
#     decoded_image
#   end
#
#   get "/phantomjs/?:query?" do
#     @zoom_level = params['zoomlevel']
#     @center_lat = params['centerlat']
#     @center_lon = params['centerlon']
#     @data       = params['data']
#
#     erb :welcome_qlikview, :layout => :layout_qlikview
#   end
#  
# end
#
