## Create an environment
```bash
python -m .backenv env
```

## Activate the environment
For MacOS and Linux
```bash
source .backenv/bin/activate
```
For Windows
```bash
.\.backenv\Scripts\activate
```
## Install the dependencies
```bash
pip install -r requirements.txt
```

## Run the application
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```