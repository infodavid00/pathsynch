when trying to create campaign, if first campaign, then the server terminates the 
request and respond to the end user the campaign is the first one nd onboarding has
to be completed.

now use the link to complete onboarding and complete the onboarding and then go
back and re-create the campaign. Note you must add the additional fields :
# {
#   "website" : "https://mybuisness.io",
#   "social" : {
#      "linkedin": "https://linkedin.com/id",
#      "twitter": "https://twitter.com/id",
#      "instagram": "https://instagram.com/id",
#      "facebook": "https://facebook.com/id"
#    },
#    "details": "details",
#    "menu" : "https://menu.jpg",
#    "logo" : "f://c/users/downloads/mylogo.jpg"
# }
since first campaign.