from typing import Any, Dict, Sequence, List
from langchain_core.tools import Tool
from langflow.base.langchain_utilities.model import LCToolComponent
from langflow.inputs import SecretStrInput
from langflow.io import Output
import requests
import logging
from datetime import datetime

class SuperMemoryComponent(LCToolComponent):
    """SuperMemory component for searching stored memories"""
    display_name: str = "SuperMemory Search"
    description: str = "Search through your SuperMemory AI stored memories"
    name = "SuperMemorySearch"
    icon = "Brain"
    inputs = [
        SecretStrInput(
            name="bearer_token",
            display_name="Bearer Token",
            required=True,
            info="Your SuperMemory AI Bearer token (starts with sm_)"
        ),
    ]
    outputs = [Output(name="tools", display_name="Tools", method="build_tools")]

    def search_memories(self, query: str) -> Dict[str, Any]:
        """Search through SuperMemory stored memories"""
        try:
            url = "https://api.supermemory.ai/v1/search"
            
            # Simple parameters matching the curl request format
            params = {
                "q": query
            }
            
            headers = {
                "Authorization": f"Bearer {self.bearer_token}"
            }
            
            logging.info(f"Making request to SuperMemory API with query: {query}")
            response = requests.post(url, params=params, headers=headers)
            response.raise_for_status()
            results = response.json()
            
            return {
                "status": "success",
                "search_results": results,
                "metadata": {
                    "query": query,
                    "timestamp": datetime.now().isoformat()
                }
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "status": "error",
                "message": f"API request failed: {str(e)}",
                "results": []
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"Unexpected error: {str(e)}",
                "results": []
            }

    def build_tools(self) -> Sequence[Tool]:
        """Build and return the SuperMemory search tools"""
        tools = [
            Tool(
                name="search_memories",
                description="""
                Search through your SuperMemory AI stored memories.
                Parameters:
                - query: Search query to find relevant memories (required)
                
                Example usage:
                search_memories("meeting notes from last week")
                search_memories("project deadlines")
                search_memories("python code examples")
                """,
                func=self.search_memories,
            )
        ]
        return tools
