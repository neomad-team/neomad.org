from math import sin, cos, sqrt, atan2, radians


# approximate radius of earth in km
R = 6373.0

# from http://stackoverflow.com/a/19412565/328117
def distance(lat_lng1, lat_lng2):
    lat1 = radians(lat_lng1[0])
    lon1 = radians(lat_lng1[1])
    lat2 = radians(lat_lng2[0])
    lon2 = radians(lat_lng2[1])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c
