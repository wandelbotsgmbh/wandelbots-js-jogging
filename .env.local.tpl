# Endpoint for the API gateway, set it to your instance in .env.local for development
WANDELAPI_BASE_URL="{{ .InstanceInformation.NovaApiHost }}" # e.g. http://172.30.0.91

# The cell on the service manager the robot pad will try to connect to
CELL_ID="{{ .InstanceInformation.CellName }}"