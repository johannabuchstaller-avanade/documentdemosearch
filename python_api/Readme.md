## create a python venv
```bash	
python -m venv .venv
```
## create a .env file
```bash
touch .env
```
## copy the secrets in your .env file, example:

tenant_id = "xxx"
client_id = "xxx"
client_secret = "xxx"
base_url='xxx'


## activate the venv
```bash	
.venv\Scripts\activate
```

## install the requirements
```bash	
pip install -r requirements.txt
```

## run the function app
```bash	
func start
or
fn + f5
```