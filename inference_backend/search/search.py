async def SearchClient(self, query: str) -> dict:
    return {"status": "search " + query}
