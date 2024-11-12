# Endpoint for the API gateway, set it to your instance in .env.local for development
WANDELAPI_BASE_URL="{{ .InstanceInformation.NovaApiHost }}" # e.g. http://172.30.0.91

# The cell on the service manager the robot pad will try to connect to
CELL_ID="{{ .InstanceInformation.CellName }}"

###
# SECRETS
#
# These should never be defined in the .env file, only in the gitignored .env.local or 
# in the environment variables of the deployment.
###

# For basic auth with the API
NOVA_USERNAME="{{ .InstanceInformation.BasicAuth.Username }}"
NOVA_PASSWORD="{{ .InstanceInformation.BasicAuth.Password }}"
NOVA_ACCESS_TOKEN="{{ .InstanceInformation.AccessToken }}"